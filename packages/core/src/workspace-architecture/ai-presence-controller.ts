export interface AiNotification {
  readonly id: string;
  readonly type: "Suggestion" | "Recommendation" | "ApprovalRequired" | "StatusUpdate";
  readonly title: string;
  readonly message: string;
  readonly actionPayload?: unknown;
  readonly createdAt: Date;
}

/**
 * Non-Intrusive AI Presence Controller (Vol 05 Part 01 - Section 16).
 * Delivers AI suggestions, recommendations, and status updates cleanly without intrusive popups or forced dialogs.
 */
export class AiPresenceController {
  private notifications: AiNotification[] = [];

  public notifySuggestion(title: string, message: string, actionPayload?: unknown): AiNotification {
    const notification: AiNotification = {
      id: `ai_notif_${Math.random().toString(36).substring(2, 7)}`,
      type: "Suggestion",
      title,
      message,
      actionPayload,
      createdAt: new Date(),
    };
    this.notifications.push(notification);
    return notification;
  }

  public getUnreadNotifications(): ReadonlyArray<AiNotification> {
    return this.notifications;
  }
}
