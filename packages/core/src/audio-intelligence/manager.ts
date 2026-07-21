import type { AIntWord, AIntSemanticAudioMap, AIntTranscriptionResult, AIntBreathEvent } from "./types.js";
import { AIntTranscriptionEngine } from "./transcription.js";
import { AIntForcedAlignment } from "./forced-alignment.js";
import { AIntPhraseDetector, AIntSentenceDetector } from "./phrase-sentence.js";
import { AIntPauseDetector } from "./pause.js";
import { AIntEmphasisDetector } from "./emphasis.js";
import { AIntSpeechRateAnalyzer } from "./speech-rate.js";
import { AIntEmotionDetector } from "./emotion.js";
import { AIntSilenceAnalyzer } from "./silence.js";
import { AIntTTSManager } from "./tts.js";
import { AIntAudioQualityAnalyzer } from "./quality.js";
import { AIntBackgroundMusicDucker } from "./ducking.js";
import { AIntAudioNormalizer } from "./normalization.js";
import { AIntAudioSemanticFusion } from "./semantic-fusion.js";
import { AIntIntelligentBreathEngine } from "./breath-engine.js";
import { AIntAudioEventBus } from "./event-bus.js";

export class AIntAudioIntelligenceEngine {
  readonly transcription: AIntTranscriptionEngine;
  readonly forcedAlignment: AIntForcedAlignment;
  readonly phraseDetector: AIntPhraseDetector;
  readonly sentenceDetector: AIntSentenceDetector;
  readonly pauseDetector: AIntPauseDetector;
  readonly emphasisDetector: AIntEmphasisDetector;
  readonly speechRate: AIntSpeechRateAnalyzer;
  readonly emotionDetector: AIntEmotionDetector;
  readonly silenceAnalyzer: AIntSilenceAnalyzer;
  readonly tts: AIntTTSManager;
  readonly quality: AIntAudioQualityAnalyzer;
  readonly ducking: AIntBackgroundMusicDucker;
  readonly normalizer: AIntAudioNormalizer;
  readonly semanticFusion: AIntAudioSemanticFusion;
  readonly breathEngine: AIntIntelligentBreathEngine;
  readonly eventBus: AIntAudioEventBus;

  constructor() {
    this.transcription = new AIntTranscriptionEngine();
    this.forcedAlignment = new AIntForcedAlignment();
    this.phraseDetector = new AIntPhraseDetector();
    this.sentenceDetector = new AIntSentenceDetector();
    this.pauseDetector = new AIntPauseDetector();
    this.emphasisDetector = new AIntEmphasisDetector();
    this.speechRate = new AIntSpeechRateAnalyzer();
    this.emotionDetector = new AIntEmotionDetector();
    this.silenceAnalyzer = new AIntSilenceAnalyzer();
    this.tts = new AIntTTSManager();
    this.quality = new AIntAudioQualityAnalyzer();
    this.ducking = new AIntBackgroundMusicDucker();
    this.normalizer = new AIntAudioNormalizer();
    this.semanticFusion = new AIntAudioSemanticFusion();
    this.breathEngine = new AIntIntelligentBreathEngine();
    this.eventBus = new AIntAudioEventBus();
  }

  async process(audio: unknown, script?: string): Promise<{
    transcription: AIntTranscriptionResult;
    semanticMap: AIntSemanticAudioMap;
    breaths: AIntBreathEvent[];
  }> {
    const transcription = await this.transcription.transcribe(audio);
    let words: AIntWord[] = transcription.words;

    if (script) {
      const result = this.forcedAlignment.align(script, words);
      words = result.aligned;
    }

    const phrases = this.phraseDetector.detect(words);
    const sentences = this.sentenceDetector.detect(words);
    const pauses = this.pauseDetector.detect(words);

    for (const s of sentences) this.sentenceDetector.classifyRole(s);

    const semanticMap = this.semanticFusion.fuse(words, phrases, sentences, pauses);
    const breaths = this.breathEngine.classify(pauses, []);

    return { transcription, semanticMap, breaths };
  }
}
