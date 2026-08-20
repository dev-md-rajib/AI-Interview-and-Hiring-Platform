import { EndInterviewPayload } from '../shared/types';
import { apiClient } from '../shared/apiClient';
import { lockdownManager } from './lockdown';
import { screenshotCaptureManager } from './screenshotCapture';
import { activityLoggerManager } from './activityLogger';
import { readySyncManager } from './readySync';

export class KillSwitchManager {
  public async executeTermination(payload: EndInterviewPayload): Promise<boolean> {
    console.log(`[KillSwitch] Initiating interview termination (endedBy: ${payload.endedBy})...`);

    // 1. Stop active surveillance and lockdown mechanisms
    lockdownManager.stopLockdown();
    screenshotCaptureManager.stopCapture();
    activityLoggerManager.stopLogging();

    // 2. Notify backend of interview submission / termination
    await apiClient.endInterview(payload);

    // 3. Update status state
    readySyncManager.setStatus(payload.endedBy === 'candidate' ? 'completed' : 'terminated');

    return true;
  }
}

export const killSwitchManager = new KillSwitchManager();
