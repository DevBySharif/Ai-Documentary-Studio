import type { AudioIntelligenceResult, WhisperResult, VoiceDNAProfile, WordTimestamp, EmphasisWord } from "./types.js";
import type { SceneObjective } from "../narrative/types.js";
import { WhisperEngine } from "./whisper.js";
import { PauseDetector, SilenceDetector } from "./pause-silence.js";
import { SpeechRateAnalyzer } from "./speech-rate.js";
import { VoiceEmotionDetector } from "./emotion-detect.js";
import { EmphasisDetector } from "./emphasis.js";
import { AudioQualityValidator } from "./quality.js";
import { SubtitleGenerator } from "./subtitles.js";
import { AudioSyncEngine } from "./sync.js";
import { MasterTimelineGenerator } from "./master-timeline.js";
import { SemanticAudioMapGenerator } from "./semantic-map.js";
import { AudioMemory } from "./memory.js";

export class AudioIntelligenceSystem {
  public whisper: WhisperEngine;
  public pauseDetector: PauseDetector;
  public silenceDetector: SilenceDetector;
  public speechRateAnalyzer: SpeechRateAnalyzer;
  public emotionDetector: VoiceEmotionDetector;
  public emphasisDetector: EmphasisDetector;
  public qualityValidator: AudioQualityValidator;
  public subtitleGenerator: SubtitleGenerator;
  public syncEngine: AudioSyncEngine;
  public timelineGenerator: MasterTimelineGenerator;
  public semanticMapGenerator: SemanticAudioMapGenerator;
  public memory: AudioMemory;
  private voiceDNA: VoiceDNAProfile;

  constructor(voiceDNA: VoiceDNAProfile) {
    this.voiceDNA = voiceDNA;
    this.whisper = new WhisperEngine();
    this.pauseDetector = new PauseDetector();
    this.silenceDetector = new SilenceDetector();
    this.speechRateAnalyzer = new SpeechRateAnalyzer();
    this.emotionDetector = new VoiceEmotionDetector();
    this.emphasisDetector = new EmphasisDetector();
    this.qualityValidator = new AudioQualityValidator();
    this.subtitleGenerator = new SubtitleGenerator();
    this.syncEngine = new AudioSyncEngine();
    this.timelineGenerator = new MasterTimelineGenerator();
    this.semanticMapGenerator = new SemanticAudioMapGenerator();
    this.memory = new AudioMemory();
  }

  async processScript(
    _script: string,
    sceneObjectives: SceneObjective[],
    importanceConcepts: string[]
  ): Promise<AudioIntelligenceResult> {
    const wordTimestamps = this.whisper.estimateTimings(_script, this.voiceDNA.speechRate);
    const totalDuration = wordTimestamps.length > 0 ? wordTimestamps[wordTimestamps.length - 1].end : 0;

    return this.processTimestamps(wordTimestamps, totalDuration, _script, sceneObjectives, importanceConcepts);
  }

  processTimestamps(
    wordTimestamps: WordTimestamp[],
    totalDuration: number,
    fullText: string,
    sceneObjectives: SceneObjective[],
    importanceConcepts: string[]
  ): AudioIntelligenceResult {
    const phrases = this.whisper.buildPhrases(wordTimestamps);
    const pauses = this.pauseDetector.detect(wordTimestamps);
    const silences = this.silenceDetector.detect(pauses);
    const speechRate = this.speechRateAnalyzer.analyze(wordTimestamps, totalDuration);
    const voiceEmotion = this.emotionDetector.detect(wordTimestamps, speechRate.wordsPerMinute);
    const emphasis = this.emphasisDetector.detectByLength(wordTimestamps, importanceConcepts);
    const quality = this.qualityValidator.validate(wordTimestamps, totalDuration, wordTimestamps.length);
    const emphasisWords = emphasis.map((e) => e.word);
    const subtitles = this.subtitleGenerator.generate(wordTimestamps, emphasisWords, "calm");
    const syncPoints = this.syncEngine.generateSyncPoints(wordTimestamps, pauses, silences);
    const masterTimeline = this.timelineGenerator.generate(wordTimestamps, phrases, pauses, syncPoints);
    const semanticMap = this.semanticMapGenerator.generate(wordTimestamps, sceneObjectives, importanceConcepts);
    const metadata = {
      duration: totalDuration,
      language: "en",
      speechRate: speechRate.wordsPerMinute,
      averagePause: speechRate.averagePauseLength,
      confidence: 0.95,
    };

    const result: AudioIntelligenceResult = {
      whisper: {
        text: fullText,
        language: "en",
        words: wordTimestamps,
        phrases,
        sentences: [],
        pauses,
        silences,
        confidence: 0.95,
        metadata,
      },
      speechRate,
      voiceEmotion,
      emphasis,
      quality,
      subtitles,
      syncPoints,
      masterTimeline,
      semanticMap,
      metadata,
    };

    return result;
  }
}
