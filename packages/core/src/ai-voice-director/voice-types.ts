export type NarrationStyle =
  | "NeutralDocumentary"
  | "Historical"
  | "Investigative"
  | "Educational"
  | "Inspirational"
  | "Dramatic"
  | "Scientific"
  | "CalmStorytelling"
  | "UrgentReporting";

export type VocalEmotion =
  | "Curiosity"
  | "Suspense"
  | "Wonder"
  | "Sadness"
  | "Hope"
  | "Urgency"
  | "Triumph"
  | "Reflection";

export type PauseType =
  | "BreathPause"
  | "DramaticPause"
  | "TopicTransition"
  | "EmphasisPause"
  | "ReflectionPause";

export type SpeakerRole =
  | "PrimaryNarrator"
  | "SecondaryNarrator"
  | "HistoricalQuotation"
  | "CharacterReenactment"
  | "InterviewVoiceover";

export interface VoiceProfile {
  readonly voiceId: string;
  readonly name: string;
  readonly gender: "Male" | "Female" | "Neutral";
  readonly accent: string;
  readonly vocalTexture: string;
  readonly idealGenre: string;
}

export interface PauseMarker {
  readonly positionCharOffset: number;
  readonly type: PauseType;
  readonly durationMs: number;
}

export interface SpeechPlan {
  readonly planId: string;
  readonly sceneId: string;
  readonly speakerRole: SpeakerRole;
  readonly assignedVoice: VoiceProfile;
  readonly style: NarrationStyle;
  readonly emotion: VocalEmotion;
  readonly rawText: string;
  readonly SSMLText: string;
  readonly pauses: ReadonlyArray<PauseMarker>;
  readonly emphasizedWords: ReadonlyArray<string>;
  readonly targetWpm: number;
  readonly estimatedDurationSecs: number;
}

export interface VoiceQualityReport {
  readonly clarityScore: number; // 0 to 100
  readonly naturalnessScore: number;
  readonly emotionalConsistencyScore: number;
  readonly pronunciationAccuracyScore: number;
  readonly listenerFatigueRiskScore: number; // Lower is better
  readonly overallScore: number;
}
