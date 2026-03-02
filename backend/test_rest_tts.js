const https = require('https');

const text = "Hi there, testing voice synthesis.";
const apiKey = "AIzaSyDSViaziVgTRCdLI2w8_ChNTZbB89k04_s";
const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

const data = JSON.stringify({
  input: { text },
  voice: { languageCode: 'en-US', name: 'en-US-Journey-F' },
  audioConfig: { audioEncoding: 'MP3' }
});

const req = https.request(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log("Status Code:", res.statusCode);
    try {
      const parsed = JSON.parse(body);
      if (parsed.error) {
        console.error("API Error:", parsed.error.message);
      } else {
        console.log("Success! Audio content received (base64 length):", parsed.audioContent.length);
      }
    } catch (e) {
      console.log("Raw Response:", body);
    }
  });
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
