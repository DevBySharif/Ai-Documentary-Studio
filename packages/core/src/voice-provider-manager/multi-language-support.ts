import {
  VPLanguage,
  VPProviderName,
  VPVoiceProfile,
} from "./types";
import { VPVoiceProfileSystem } from "./voice-profile-system";
import { VPProviderAbstraction } from "./provider-abstraction";

const LANGUAGE_PROVIDER_MAP: Map<VPLanguage, VPProviderName[]> = new Map([
  ["english", ["edge_tts", "piper", "kokoro", "google_cloud_tts", "azure_speech", "elevenlabs", "openai_tts", "amazon_polly"]],
  ["bangla", ["google_cloud_tts", "azure_speech", "elevenlabs"]],
  ["hindi", ["google_cloud_tts", "azure_speech", "elevenlabs"]],
  ["arabic", ["google_cloud_tts", "azure_speech", "elevenlabs"]],
  ["japanese", ["google_cloud_tts", "azure_speech", "elevenlabs", "kokoro"]],
  ["korean", ["google_cloud_tts", "azure_speech", "elevenlabs"]],
  ["chinese", ["google_cloud_tts", "azure_speech", "elevenlabs", "kokoro"]],
]);

const LANGUAGE_DETECTION_KEYWORDS: Record<string, string[]> = {
  english: ["the", "is", "are", "was", "were", "have", "has", "been", "will", "would", "could", "should", "this", "that", "and", "but", "for", "not", "with"],
  bangla: ["আমি", "তুমি", "সে", "আমরা", "তারা", "এটা", "ওটা", "এবং", "কিন্তু", "না", "হ্যাঁ", "কি", "যে", "এই", "ওই"],
  hindi: ["मैं", "तुम", "वह", "हम", "वे", "यह", "वह", "और", "लेकिन", "नहीं", "हाँ", "क्या", "कि", "ये", "वो"],
  arabic: ["أنا", "أنت", "هو", "هي", "نحن", "هم", "هذا", "ذلك", "و", "لكن", "لا", "نعم", "ماذا", "ما", "في"],
  japanese: ["私は", "あなた", "です", "ます", "した", "いる", "ある", "こと", "もの", "ため", "とき", "さん", "たち", "これ", "それ"],
  korean: ["저는", "나는", "입니다", "습니다", "했다", "있다", "하다", "것", "수", "위해", "때", "이", "그", "저", "않다"],
  chinese: ["我", "你", "他", "她", "它", "我们", "他们", "是", "的", "了", "在", "有", "不", "和", "就"],
};

export class VPMultiLanguageSupport {
  private profileSystem: VPVoiceProfileSystem;
  private providerAbstraction: VPProviderAbstraction;

  constructor(
    profileSystem: VPVoiceProfileSystem,
    providerAbstraction: VPProviderAbstraction
  ) {
    this.profileSystem = profileSystem;
    this.providerAbstraction = providerAbstraction;
  }

  isLanguageSupported(
    language: VPLanguage,
    provider: VPProviderName
  ): boolean {
    const providers = LANGUAGE_PROVIDER_MAP.get(language);
    if (!providers) return false;
    return providers.includes(provider);
  }

  getCompatibleVoices(language: VPLanguage): VPVoiceProfile[] {
    return this.profileSystem.findByLanguage(language);
  }

  autoSelectVoice(
    language: VPLanguage,
    gender?: "male" | "female" | "neutral"
  ): VPVoiceProfile | undefined {
    const voices = this.profileSystem.findByLanguage(language);
    if (voices.length === 0) return undefined;
    if (gender) {
      const gendered = voices.filter((v) => v.gender === gender);
      if (gendered.length > 0) return gendered[0];
    }
    return voices[0];
  }

  detectLanguage(script: string): VPLanguage {
    const cleanScript = script.toLowerCase().replace(/[^\w\s\u0600-\u06FF\u0900-\u097F\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/g, " ");
    const scores: Map<VPLanguage, number> = new Map();

    for (const [lang, keywords] of Object.entries(LANGUAGE_DETECTION_KEYWORDS)) {
      let score = 0;
      for (const kw of keywords) {
        const regex = new RegExp(kw, "gi");
        const matches = cleanScript.match(regex);
        if (matches) score += matches.length;
      }
      scores.set(lang as VPLanguage, score);
    }

    let bestLang: VPLanguage = "english";
    let bestScore = 0;
    for (const [lang, score] of scores) {
      if (score > bestScore) {
        bestScore = score;
        bestLang = lang;
      }
    }

    return bestLang;
  }

  getSupportedLanguages(
    provider: VPProviderName
  ): VPLanguage[] {
    const languages: VPLanguage[] = [];
    for (const [lang, providers] of LANGUAGE_PROVIDER_MAP) {
      if (providers.includes(provider)) {
        languages.push(lang);
      }
    }
    return languages;
  }

  getAllSupportedLanguages(): VPLanguage[] {
    return Array.from(LANGUAGE_PROVIDER_MAP.keys());
  }
}
