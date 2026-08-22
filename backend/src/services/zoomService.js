const https = require('https');
const logger = require('../config/logger');

const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;

// Cache token to avoid re-fetching on every call
let cachedToken = null;
let tokenExpiresAt = null;

/**
 * Get a Zoom Server-to-Server OAuth access token.
 * Caches the token until it expires.
 */
async function getAccessToken() {
  if (cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  return new Promise((resolve, reject) => {
    const credentials = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');
    const body = `grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`;

    const options = {
      hostname: 'zoom.us',
      path: '/oauth/token',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.access_token) {
            cachedToken = parsed.access_token;
            // expires_in is in seconds; cache with 60s buffer
            tokenExpiresAt = Date.now() + (parsed.expires_in - 60) * 1000;
            resolve(cachedToken);
          } else {
            logger.error('Zoom token error:', data);
            reject(new Error(parsed.reason || 'Failed to get Zoom access token'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/**
 * Make an authenticated request to the Zoom API.
 */
async function zoomApiRequest(method, path, body = null) {
  const token = await getAccessToken();

  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null;

    const options = {
      hostname: 'api.zoom.us',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    if (bodyStr) {
      options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            logger.error(`Zoom API error [${res.statusCode}]:`, data);
            reject(new Error(parsed.message || `Zoom API returned ${res.statusCode}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

/**
 * Create a Zoom meeting.
 * @param {object} options
 * @param {string} options.topic - Meeting title
 * @param {Date}   options.startTime - Meeting start time
 * @param {number} options.durationMinutes - Duration in minutes (default 60)
 * @param {string} options.agenda - Meeting agenda/description
 * @param {string} [options.hostEmail] - Email of the host (defaults to rajibmiah978@gmail.com)
 * @returns {{ meetingId, joinUrl, startUrl, password }}
 */
async function createMeeting({ topic, startTime, durationMinutes = 60, agenda = '', hostEmail = '' }) {
  const meetingData = {
    topic,
    type: 2, // Scheduled meeting
    start_time: startTime instanceof Date ? startTime.toISOString() : startTime,
    duration: durationMinutes,
    agenda,
    timezone: 'Asia/Dhaka',
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: false,
      mute_upon_entry: false,
      waiting_room: true,
      auto_recording: 'none',
    },
  };

  const targetHost = (hostEmail && hostEmail.trim()) ? hostEmail.trim().toLowerCase() : 'rajibmiah978@gmail.com';
  logger.info(`Creating Zoom meeting with host: ${targetHost}`);

  let response;
  try {
    response = await zoomApiRequest('POST', `/v2/users/${encodeURIComponent(targetHost)}/meetings`, meetingData);
  } catch (err) {
    logger.warn(`Failed to create Zoom meeting for host "${targetHost}" (${err.message}). Attempting fallback...`);
    if (targetHost !== 'rajibmiah978@gmail.com') {
      try {
        response = await zoomApiRequest('POST', `/v2/users/${encodeURIComponent('rajibmiah978@gmail.com')}/meetings`, meetingData);
      } catch (fallbackErr) {
        response = await zoomApiRequest('POST', '/v2/users/me/meetings', meetingData);
      }
    } else {
      response = await zoomApiRequest('POST', '/v2/users/me/meetings', meetingData);
    }
  }

  return {
    meetingId: String(response.id),
    joinUrl: response.join_url,
    startUrl: response.start_url,
    password: response.password || '',
  };
}

/**
 * Delete a Zoom meeting (e.g., when interview is cancelled).
 * @param {string} meetingId
 */
async function deleteMeeting(meetingId) {
  try {
    await zoomApiRequest('DELETE', `/v2/meetings/${meetingId}`);
    logger.info(`Zoom meeting ${meetingId} deleted`);
  } catch (err) {
    logger.error(`Failed to delete Zoom meeting ${meetingId}: ${err.message}`);
  }
}

module.exports = { getAccessToken, createMeeting, deleteMeeting };
