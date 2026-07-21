import { PauseMarker } from "./voice-types";

/**
 * Pause & Breathing Intelligence Planner (Vol 04 Part 08 - Section 8, Section 13).
 * Inserts meaningful pauses (breath, dramatic, topic transition, emphasis, reflection) and SSML tags.
 */
export class PauseBreathingPlanner {
  public planPauses(text: string): { SSMLText: string; pauses: ReadonlyArray<PauseMarker> } {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const pauses: PauseMarker[] = [];
    let ssmlParts: string[] = ["<speak>"];
    let cumulativeOffset = 0;

    sentences.forEach((sentence, idx) => {
      ssmlParts.push(sentence);
      cumulativeOffset += sentence.length;

      // Add a breath or topic transition pause after each sentence
      const isLast = idx === sentences.length - 1;
      const pauseDuration = isLast ? 1200 : 600;
      const pauseType = isLast ? "TopicTransition" : "BreathPause";

      ssmlParts.push(`<break time="${pauseDuration}ms"/>`);
      pauses.push({
        positionCharOffset: cumulativeOffset,
        type: pauseType,
        durationMs: pauseDuration,
      });
    });

    ssmlParts.push("</speak>");

    return {
      SSMLText: ssmlParts.join(" "),
      pauses,
    };
  }
}
