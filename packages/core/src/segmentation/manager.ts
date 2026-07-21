import type { SemanticSegment, SegmentationResult, VisualComplexity } from "./types.js";
import type { StoryScript } from "../story/types.js";
import { ConceptDetector } from "./concept-detector.js";
import { ContinuityScoreCalculator } from "./continuity-score.js";
import { WordClusterDetector } from "./word-cluster.js";
import { MetaphorDetector } from "./metaphor-detector.js";
import { QuestionRevealDetector } from "./question-reveal-detector.js";
import { VisualIntentDetector } from "./visual-intent-detector.js";

export class SemanticSegmentationEngine {
  private conceptDetector: ConceptDetector;
  private continuity: ContinuityScoreCalculator;
  private wordCluster: WordClusterDetector;
  private metaphor: MetaphorDetector;
  private questionReveal: QuestionRevealDetector;
  private visualIntent: VisualIntentDetector;

  constructor() {
    this.conceptDetector = new ConceptDetector();
    this.continuity = new ContinuityScoreCalculator();
    this.wordCluster = new WordClusterDetector();
    this.metaphor = new MetaphorDetector();
    this.questionReveal = new QuestionRevealDetector();
    this.visualIntent = new VisualIntentDetector();
  }

  segment(script: StoryScript): SegmentationResult {
    const segments: SemanticSegment[] = [];
    let lastConcept = "";
    let lastEmotion = "";
    let currentTime = 0;
    let conceptShifts = 0;
    let emotionShifts = 0;
    let metaphors = 0;
    let questions = 0;
    let reveals = 0;

    for (const scene of script.scenes) {
      for (const sentence of scene.narration) {
        const conceptCluster = this.conceptDetector.detect(sentence, lastConcept);
        const emotion = sentence.emotion;
        const isQuestion = this.questionReveal.detectQuestion(sentence.text);
        const isReveal = this.questionReveal.detectReveal(sentence.text);
        const metaphorResult = this.metaphor.detect(sentence.text);
        const visualIntent = this.visualIntent.detect(isQuestion, isReveal, metaphorResult.isMetaphor, scene.importance, emotion, sentence.text);
        const continuityScore = this.continuity.calculate(conceptCluster.primary, lastConcept, emotion, lastEmotion);
        const type = this.conceptDetector.detectSegmentType(conceptCluster, isQuestion, isReveal, metaphorResult.isMetaphor);

        if (metaphorResult.isMetaphor) metaphors++;
        if (isQuestion) questions++;
        if (isReveal) reveals++;
        if (lastConcept && conceptCluster.primary !== lastConcept) conceptShifts++;
        if (lastEmotion && emotion !== lastEmotion) emotionShifts++;

        const segment: SemanticSegment = {
          id: `seg_${segments.length}`,
          index: segments.length,
          start: currentTime,
          end: currentTime + sentence.estimatedDuration,
          type,
          concept: conceptCluster,
          emotion,
          importance: scene.importance,
          complexity: this.determineComplexity(scene.importance, conceptCluster),
          visualIntent,
          isQuestion,
          isReveal,
          isMetaphor: metaphorResult.isMetaphor,
          metaphorSymbol: metaphorResult.symbol,
          continuityScore,
          recommendedStrategy: "reuse",
          scene: scene.sceneNumber,
          text: sentence.text,
        };

        const merged = this.tryMerge(segments, segment);
        if (!merged) segments.push(segment);

        currentTime += sentence.estimatedDuration;
        lastConcept = conceptCluster.primary;
        lastEmotion = emotion;
      }
    }

    const finalSegments = this.splitAfterMerge(segments);
    this.assignStrategies(finalSegments);

    const totalImportance = finalSegments.reduce((s, seg) => s + seg.importance, 0);

    return {
      segments: finalSegments,
      totalSegments: finalSegments.length,
      averageImportance: finalSegments.length > 0 ? totalImportance / finalSegments.length : 0,
      metadata: {
        generatedAt: new Date().toISOString(),
        conceptShifts,
        emotionShifts,
        metaphors,
        questions,
        reveals,
        merges: segments.length - finalSegments.length,
      },
    };
  }

  private determineComplexity(importance: number, concept: { primary: string; secondary: string[] }): VisualComplexity {
    if (importance >= 9) return "highly_abstract";
    if (importance >= 7) return "complex";
    if (importance >= 4) return "medium";
    return "simple";
  }

  private tryMerge(segments: SemanticSegment[], candidate: SemanticSegment): boolean {
    if (segments.length === 0) return false;
    const last = segments[segments.length - 1];

    if (
      last.concept.primary === candidate.concept.primary &&
      last.emotion === candidate.emotion &&
      last.visualIntent === candidate.visualIntent
    ) {
      last.end = candidate.end;
      last.text += " " + candidate.text;
      if (candidate.importance > last.importance) last.importance = candidate.importance;
      if (candidate.isReveal) last.isReveal = true;
      if (candidate.isQuestion) last.isQuestion = true;
      return true;
    }

    return false;
  }

  private splitAfterMerge(segments: SemanticSegment[]): SemanticSegment[] {
    const result: SemanticSegment[] = [];
    for (const seg of segments) {
      if (seg.isReveal || seg.isQuestion || seg.isMetaphor) {
        const words = seg.text.split(/\s+/);
        if (words.length > 20) {
          const mid = Math.floor(words.length / 2);
          const firstText = words.slice(0, mid).join(" ");
          const secondText = words.slice(mid).join(" ");
          const midTime = seg.start + (seg.end - seg.start) / 2;

          result.push({ ...seg, text: firstText, end: midTime });
          result.push({ ...seg, id: `seg_${seg.index}_split`, index: result.length, text: secondText, start: midTime });
        } else {
          result.push(seg);
        }
      } else {
        result.push(seg);
      }
    }
    return result;
  }

  private assignStrategies(segments: SemanticSegment[]): void {
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const prev = i > 0 ? segments[i - 1] : null;

      if (seg.isMetaphor && seg.metaphorSymbol) {
        seg.recommendedStrategy = "symbol_insert";
      } else if (prev && seg.continuityScore >= 0.7) {
        seg.recommendedStrategy = "reuse";
      } else if (seg.importance >= 8 && seg.visualIntent === "emphasize") {
        seg.recommendedStrategy = "word_insert";
      } else if (prev && seg.continuityScore >= 0.5) {
        seg.recommendedStrategy = "motion_only";
      } else {
        seg.recommendedStrategy = "new_image";
      }
    }
  }
}
