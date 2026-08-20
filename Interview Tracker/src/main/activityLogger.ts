import activeWin from 'active-win';
import { ActivityEvent } from '../shared/types';
import { apiClient } from '../shared/apiClient';

export class ActivityLoggerManager {
  private isRunning: boolean = false;
  private pollInterval: NodeJS.Timeout | null = null;
  private flushInterval: NodeJS.Timeout | null = null;
  private candidateId: string | null = null;
  private interviewId: string | null = null;
  private queuedEvents: ActivityEvent[] = [];
  private lastActiveTitle: string = '';

  public startLogging(candidateId: string, interviewId: string): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.candidateId = candidateId;
    this.interviewId = interviewId;
    this.queuedEvents = [];

    console.log('[ActivityLogger] Monitoring foreground window and activity events...');

    // Poll active window title every 3 seconds
    this.pollInterval = setInterval(async () => {
      await this.checkActiveWindow();
    }, 3000);

    // Flush queued logs to backend every 10 seconds
    this.flushInterval = setInterval(async () => {
      await this.flushLogs();
    }, 10000);
  }

  public stopLogging(): void {
    this.isRunning = false;
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    // Flush remaining logs on stop
    this.flushLogs();
  }

  public logEvent(event: ActivityEvent): void {
    if (!this.isRunning) return;
    this.queuedEvents.push(event);

    // Flush immediately if queue reaches 20 events
    if (this.queuedEvents.length >= 20) {
      this.flushLogs();
    }
  }

  public logUrlNavigation(url: string): void {
    this.logEvent({
      type: 'url_navigation',
      detail: `Navigated to ${url}`,
      timestamp: new Date().toISOString()
    });
  }

  private async checkActiveWindow(): Promise<void> {
    try {
      const windowInfo = await activeWin();
      if (windowInfo && windowInfo.title) {
        const titleDesc = `${windowInfo.owner.name} - "${windowInfo.title}"`;
        if (titleDesc !== this.lastActiveTitle) {
          this.lastActiveTitle = titleDesc;
          this.logEvent({
            type: 'app_switch',
            detail: `Active window changed: ${titleDesc}`,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (err) {
      // Ignore active window resolution errors
    }
  }

  private async flushLogs(): Promise<void> {
    if (this.queuedEvents.length === 0 || !this.candidateId || !this.interviewId) return;

    const eventsToUpload = [...this.queuedEvents];
    this.queuedEvents = [];

    const success = await apiClient.uploadActivityLogs({
      candidateId: this.candidateId,
      interviewId: this.interviewId,
      events: eventsToUpload
    });

    if (!success) {
      // Re-queue events if upload fails
      this.queuedEvents = [...eventsToUpload, ...this.queuedEvents];
    } else {
      console.log(`[ActivityLogger] Successfully uploaded ${eventsToUpload.length} activity log events.`);
    }
  }
}

export const activityLoggerManager = new ActivityLoggerManager();
