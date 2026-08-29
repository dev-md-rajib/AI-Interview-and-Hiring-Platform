/**
 * Multi-Tier Resilient Camera & Microphone Acquisition and Diagnostic Utility
 */

/**
 * Diagnostic check for available media devices and permissions
 */
export async function checkMediaDevices() {
  const result = {
    isSupported: Boolean(navigator?.mediaDevices?.getUserMedia),
    isSecureContext: window.isSecureContext,
    videoDevices: [],
    audioInputDevices: [],
    audioOutputDevices: [],
    cameraPermission: 'prompt', // 'granted' | 'denied' | 'prompt' | 'unknown'
    micPermission: 'prompt',
    hasCamera: false,
    hasMicrophone: false,
    error: null,
  };

  if (!result.isSupported) {
    result.error = !window.isSecureContext
      ? 'Media API is disabled in insecure HTTP contexts. Please use http://localhost:5173 or HTTPS.'
      : 'Camera and Microphone APIs (navigator.mediaDevices) are not supported by this browser.';
    return result;
  }

  // Check browser permissions query API where supported
  try {
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const camStatus = await navigator.permissions.query({ name: 'camera' });
        result.cameraPermission = camStatus.state;
      } catch (_) {
        // camera name might not be supported in some browsers
      }
      try {
        const micStatus = await navigator.permissions.query({ name: 'microphone' });
        result.micPermission = micStatus.state;
      } catch (_) {
        // microphone name might not be supported
      }
    }
  } catch (_) {}

  // Enumerate physical hardware devices
  try {
    if (navigator.mediaDevices.enumerateDevices) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      result.videoDevices = devices.filter((d) => d.kind === 'videoinput');
      result.audioInputDevices = devices.filter((d) => d.kind === 'audioinput');
      result.audioOutputDevices = devices.filter((d) => d.kind === 'audiooutput');
      result.hasCamera = result.videoDevices.length > 0;
      result.hasMicrophone = result.audioInputDevices.length > 0;
    }
  } catch (enumErr) {
    console.warn('[Media Diagnostic] enumerateDevices warning:', enumErr);
  }

  return result;
}

/**
 * Parse and translate user-friendly error messages
 */
export function getMediaErrorMessage(error) {
  if (!error) return 'Unknown media error occurred.';
  const name = error.name || error.constructor?.name || '';
  const message = error.message || '';

  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return {
      title: 'Camera / Microphone Permission Denied',
      details: 'Permission was denied by your browser or Windows Privacy Settings.',
      action: 'Click the lock icon 🔒 next to the URL in your browser address bar and set Camera and Microphone to "Allow". In Windows, verify Settings > Privacy & security > Camera.',
      type: 'permission',
    };
  }

  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return {
      title: 'Device Not Found',
      details: 'No camera or microphone hardware was detected.',
      action: 'Ensure your webcam/mic is connected. If using a laptop, check the physical camera shutter or Fn key (Fn+F6 / Fn+F10).',
      type: 'hardware',
    };
  }

  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return {
      title: 'Camera / Mic In Use by Another App',
      details: 'The camera or microphone is already locked by another program or browser tab.',
      action: 'Close applications like Zoom, Microsoft Teams, Discord, Skype, OBS, or other browser tabs that might be using your camera/mic.',
      type: 'conflict',
    };
  }

  if (name === 'OverconstrainedError' || name === 'ConstraintNotSatisfiedError') {
    return {
      title: 'Hardware Resolution Unsupported',
      details: 'Your hardware does not support the requested video resolution.',
      action: 'We will automatically fallback to default video constraints.',
      type: 'constraints',
    };
  }

  if (name === 'SecurityError' || !window.isSecureContext) {
    return {
      title: 'Insecure Context (HTTPS Required)',
      details: 'Browsers block media access on insecure network origins.',
      action: 'Access the application via http://localhost:5173 or an HTTPS URL.',
      type: 'security',
    };
  }

  return {
    title: 'Camera / Mic Access Error',
    details: message || 'Unable to access media stream.',
    action: 'Check your browser permissions and device connections, then try again.',
    type: 'unknown',
  };
}

/**
 * Acquire media stream with 4-tier graceful fallback
 * @param {Object} options - { video: boolean | object, audio: boolean | object }
 * @returns {Promise<{ stream: MediaStream, videoTrack: MediaStreamTrack | null, audioTrack: MediaStreamTrack | null, errors: Array }>}
 */
export async function acquireMediaStream({ video = true, audio = true } = {}) {
  if (!navigator?.mediaDevices?.getUserMedia) {
    throw new Error('Camera and Microphone APIs (navigator.mediaDevices.getUserMedia) are not available.');
  }

  const errors = [];
  let videoTrack = null;
  let audioTrack = null;

  // Tier 1: Try combined request with optimal quality constraints
  if (video && audio) {
    try {
      const optimalStream = await navigator.mediaDevices.getUserMedia({
        video: typeof video === 'object' ? video : { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: typeof audio === 'object' ? audio : { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      videoTrack = optimalStream.getVideoTracks()[0] || null;
      audioTrack = optimalStream.getAudioTracks()[0] || null;
      return { stream: optimalStream, videoTrack, audioTrack, errors };
    } catch (t1Err) {
      console.warn('[acquireMediaStream] Tier 1 optimal combined request failed:', t1Err.name, t1Err.message);
      errors.push({ tier: 1, error: t1Err });
    }

    // Tier 2: Try basic combined request { video: true, audio: true }
    try {
      const basicStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoTrack = basicStream.getVideoTracks()[0] || null;
      audioTrack = basicStream.getAudioTracks()[0] || null;
      return { stream: basicStream, videoTrack, audioTrack, errors };
    } catch (t2Err) {
      console.warn('[acquireMediaStream] Tier 2 basic combined request failed:', t2Err.name, t2Err.message);
      errors.push({ tier: 2, error: t2Err });
    }
  }

  // Tier 3: Independent split acquisition (Video & Audio separately)
  if (video && !videoTrack) {
    try {
      const vStream = await navigator.mediaDevices.getUserMedia({
        video: typeof video === 'object' ? video : { width: { ideal: 640 }, height: { ideal: 480 } },
      });
      videoTrack = vStream.getVideoTracks()[0] || null;
    } catch (vErr1) {
      console.warn('[acquireMediaStream] Tier 3 video request with dimensions failed, trying video: true:', vErr1.name);
      errors.push({ component: 'video', tier: 3, error: vErr1 });
      try {
        const vStream2 = await navigator.mediaDevices.getUserMedia({ video: true });
        videoTrack = vStream2.getVideoTracks()[0] || null;
      } catch (vErr2) {
        console.warn('[acquireMediaStream] Tier 3 basic video request failed:', vErr2.name);
        errors.push({ component: 'video', tier: 3.5, error: vErr2 });
      }
    }
  }

  if (audio && !audioTrack) {
    try {
      const aStream = await navigator.mediaDevices.getUserMedia({
        audio: typeof audio === 'object' ? audio : { echoCancellation: true },
      });
      audioTrack = aStream.getAudioTracks()[0] || null;
    } catch (aErr1) {
      console.warn('[acquireMediaStream] Tier 3 audio request with options failed, trying audio: true:', aErr1.name);
      errors.push({ component: 'audio', tier: 3, error: aErr1 });
      try {
        const aStream2 = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioTrack = aStream2.getAudioTracks()[0] || null;
      } catch (aErr2) {
        console.warn('[acquireMediaStream] Tier 3 basic audio request failed:', aErr2.name);
        errors.push({ component: 'audio', tier: 3.5, error: aErr2 });
      }
    }
  }

  // Tier 4: Direct device ID targeting via enumerateDevices if still missing
  if ((video && !videoTrack) || (audio && !audioTrack)) {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      if (video && !videoTrack) {
        const vDev = devices.find((d) => d.kind === 'videoinput' && d.deviceId);
        if (vDev) {
          try {
            const devVStream = await navigator.mediaDevices.getUserMedia({
              video: { deviceId: { exact: vDev.deviceId } },
            });
            videoTrack = devVStream.getVideoTracks()[0] || null;
          } catch (devVErr) {
            errors.push({ component: 'video', tier: 4, error: devVErr });
          }
        }
      }
      if (audio && !audioTrack) {
        const aDev = devices.find((d) => d.kind === 'audioinput' && d.deviceId);
        if (aDev) {
          try {
            const devAStream = await navigator.mediaDevices.getUserMedia({
              audio: { deviceId: { exact: aDev.deviceId } },
            });
            audioTrack = devAStream.getAudioTracks()[0] || null;
          } catch (devAErr) {
            errors.push({ component: 'audio', tier: 4, error: devAErr });
          }
        }
      }
    } catch (enumErr) {
      errors.push({ tier: 4, error: enumErr });
    }
  }

  const combinedTracks = [videoTrack, audioTrack].filter(Boolean);
  const stream = combinedTracks.length > 0 ? new MediaStream(combinedTracks) : null;

  return {
    stream,
    videoTrack,
    audioTrack,
    errors,
  };
}
