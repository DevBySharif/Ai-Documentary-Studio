export type NarrationApprovalStage =
  | "Draft"
  | "AIReviewed"
  | "HumanReviewed"
  | "Approved"
  | "Locked";

export type EmotionalToneStyle =
  | "Neutral"
  | "Serious"
  | "Curious"
  | "Inspirational"
  | "Urgent"
  | "Reflective"
  | "Dramatic";

export type SpeakerRoleType =
  | "MainNarrator"
  | "HistoricalQuotation"
  | "CharacterDialogue"
  | "InterviewRecreation"
  | "TranslatorVoice";

export interface VoiceProfileDescriptor {
  readonly voiceId: string;
  readonly name: string;
  readonly isAiGenerated: boolean;
  readonly language: string;
  readonly accent: string;
  readonly gender: string;
  readonly speakingStyle: string;
  readonly supportedEmotions: ReadonlyArray<EmotionalToneStyle>;
  readonly sampleAudioUrl: string;
}

export interface PronunciationRule {
  readonly ruleId: string;
  readonly originalWord: string;
  readonly phoneticSpelling: string; // e.g. "Is-am-bard"
  readonly category: "PersonalName" | "HistoricalFigure" | "ScientificTerm" | "GeographicLocation" | "Custom";
}

export interface AudioCleanupSettings {
  readonly enableNoiseReduction: boolean;
  readonly noiseThresholdDb: number;
  readonly enableSilenceTrimming: boolean;
  readonly targetLoudnessLufs: number; // e.g. -24 LUFS
  readonly enableBreathReduction: boolean;
  readonly fadeInOutSecs: number;
}

export interface VoiceVersionItem {
  readonly versionNumber: number;
  readonly versionName: string; // e.g. "Take 2 - Emotional Dramatic"
  readonly audioFileUrl: string;
  readonly durationSecs: number;
  readonly isApproved: boolean;
  readonly createdAt: Date;
}

export interface SpeakerAssignment {
  readonly speakerId: string;
  readonly name: string;
  readonly role: SpeakerRoleType;
  readonly assignedVoiceId: string;
}
