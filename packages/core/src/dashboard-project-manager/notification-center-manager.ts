import { NotificationCategory } from "./dashboard-types";

export interface DashboardNotification {
  readonly notificationId: string;
  readonly category: NotificationCategory;
  readonly title: string;
  readonly message: string;
  readonly isDismissed: boolean;
  readonly createdAt: Date;
}

/**
 * Actionable Notification Center Manager (Vol 05 Part 02 - Section 13).
 * Categorizes and manages actionable notifications (Information, Recommendation, Warning, Error, Review Request).
 */
export class NotificationCenterManager {
  private notifications: DashboardNotification[] = [
    {
      notificationId: "notif_rev_1",
      category: "ReviewRequest",
      title: "Script Fact-Check Audit Complete",
      message: "Fact Checker identified 0 critical issues and 1 citation suggestion.",
      isDismissed: false,
      createdAt: new Date(),
    },
  ];

  public getUnreadNotifications(): ReadonlyArray<DashboardNotification> {
    return this.notifications.filter((n) => !n.isDismissed);
  }

  public dismissNotification(id: string): void {
    const notif = this.notifications.find((n) => n.notificationId === id);
    if (notif) {
      const idx = this.notifications.indexOf(notif);
      this.notifications[idx] = { ...notif, isDismissed: true };
    }
  }
}
