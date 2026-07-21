import { AudioIntelligenceSystem } from "./audio-intelligence.js";
import { TTSProviderFactory } from "./tts.js";
import { VoiceDNAManager, createDefaultVoiceDNA, createNormalizationConfig } from "./voice-dna.js";
import type { AudioIntelligenceResult, VoiceDNAProfile, WhisperResult, WordTimestamp } from "./types.js";
import type { ChannelDNA } from "../dna/types.js";
import type { ProjectDNA } from "../project/types.js";

export class AudioManager {
  private intelligence: AudioIntelligenceSystem;
  public ttsFactory: TTSProviderFactory;
  private voiceDNAManager: VoiceDNAManager;
  private voiceDNA: VoiceDNAProfile;

  constructor(voiceDNA?: VoiceDNAProfile) {
    this.voiceDNA = voiceDNA || createDefaultVoiceDNA();
    this.intelligence = new AudioIntelligenceSystem(this.voiceDNA);
    this.ttsFactory = new TTSProviderFactory();
    this.voiceDNAManager = new VoiceDNAManager();
  }

  compileVoiceDNA(channelDNA: ChannelDNA, projectDNA?: ProjectDNA): VoiceDNAProfile {
    const base = this.voiceDNAManager.compile(channelDNA);
    if (projectDNA) {
      this.voiceDNA = this.voiceDNAManager.applyProjectOverrides(base, projectDNA);
    } else {
      this.voiceDNA = base;
    }
    return this.voiceDNA;
  }

  async processScript(
    script: string,
    objectives: any[],
    concepts: string[]
  ): Promise<AudioIntelligenceResult> {
    return this.intelligence.processScript(script, objectives, concepts);
  }

  processTimestamps(
    words: WordTimestamp[],
    totalDuration: number,
    fullText: string,
    objectives: any[],
    concepts: string[]
  ): AudioIntelligenceResult {
    return this.intelligence.processTimestamps(words, totalDuration, fullText, objectives, concepts);
  }

  getIntelligence(): AudioIntelligenceSystem {
    return this.intelligence;
  }

  getNormalizationConfig() {
    return createNormalizationConfig();
  }
}
