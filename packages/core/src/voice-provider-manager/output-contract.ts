import { VPOutputContract, VPProviderName, VPLanguage } from "./types";

export type VPTimingLevel = "word" | "phrase" | "sentence";
export type VPContractStatus = "delivered" | "pending" | "rejected";

export class VPOutputContractBuilder {
  private contract: Partial<VPOutputContract>;

  constructor() {
    this.contract = {};
  }

  setProvider(provider: VPProviderName): VPOutputContractBuilder {
    this.contract.provider = provider;
    return this;
  }

  setVoice(voice: string): VPOutputContractBuilder {
    this.contract.voice = voice;
    return this;
  }

  setLanguage(language: VPLanguage): VPOutputContractBuilder {
    this.contract.language = language;
    return this;
  }

  setDuration(duration: number): VPOutputContractBuilder {
    this.contract.duration = duration;
    return this;
  }

  setTimingLevel(timing: VPTimingLevel): VPOutputContractBuilder {
    this.contract.timing = timing;
    return this;
  }

  setStatus(status: VPContractStatus): VPOutputContractBuilder {
    this.contract.status = status;
    return this;
  }

  build(): VPOutputContract {
    if (!this.contract.provider) throw new Error("Provider is required");
    if (!this.contract.voice) throw new Error("Voice is required");
    if (!this.contract.language) throw new Error("Language is required");
    return {
      provider: this.contract.provider,
      voice: this.contract.voice,
      language: this.contract.language,
      duration: this.contract.duration ?? 0,
      timing: this.contract.timing ?? "sentence",
      status: this.contract.status ?? "pending",
    };
  }

  static fromDefaults(
    provider: VPProviderName,
    voice: string,
    language: VPLanguage
  ): VPOutputContract {
    return new VPOutputContractBuilder()
      .setProvider(provider)
      .setVoice(voice)
      .setLanguage(language)
      .setDuration(0)
      .setTimingLevel("sentence")
      .setStatus("pending")
      .build();
  }
}
