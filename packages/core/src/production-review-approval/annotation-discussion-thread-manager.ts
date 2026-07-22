import { ContextualAnnotation, CommentThreadItem, ReviewTargetType } from "./review-types";

/**
 * Contextual Annotation Engine & Threaded Discussion Manager (Vol 08 Part 04 - Section 5, Section 6, Section 7).
 * Attaches feedback directly to specific locations (text highlight, timeline timestamp, storyboard frame, image region) and manages threaded discussions.
 */
export class AnnotationDiscussionThreadManager {
  private annotations: ContextualAnnotation[] = [];
  private comments: CommentThreadItem[] = [];

  public createAnnotation(
    targetId: string,
    targetType: ReviewTargetType,
    contextAnchor: string,
    authorUserId: string,
    initialCommentText: string
  ): ContextualAnnotation {
    const ann: ContextualAnnotation = {
      annotationId: `ann_${Math.random().toString(36).substring(2, 7)}`,
      targetId,
      targetType,
      contextAnchor,
      authorUserId,
      initialComment: initialCommentText,
      createdAt: new Date(),
    };

    this.annotations.push(ann);
    this.replyToAnnotation(ann.annotationId, authorUserId, initialCommentText, false);
    return ann;
  }

  public replyToAnnotation(
    annotationId: string,
    authorUserId: string,
    text: string,
    isAiSuggestion = false
  ): CommentThreadItem {
    const reply: CommentThreadItem = {
      commentId: `cmt_${Math.random().toString(36).substring(2, 7)}`,
      annotationId,
      authorUserId,
      text,
      isAiSuggestion,
      timestamp: new Date(),
    };

    this.comments.push(reply);
    return reply;
  }

  public getThreadForAnnotation(annotationId: string): ReadonlyArray<CommentThreadItem> {
    return this.comments.filter((c) => c.annotationId === annotationId);
  }
}
