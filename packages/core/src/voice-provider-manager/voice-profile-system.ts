import { VPVoiceProfile, VPLanguage, VPEmotion } from "./types";

export class VPVoiceProfileSystem {
  private profiles: Map<string, VPVoiceProfile> = new Map();

  register(profile: VPVoiceProfile): void {
    this.profiles.set(profile.voiceName.toLowerCase(), { ...profile });
  }

  get(name: string): VPVoiceProfile | undefined {
    const profile = this.profiles.get(name.toLowerCase());
    return profile ? { ...profile } : undefined;
  }

  findByLanguage(language: VPLanguage): VPVoiceProfile[] {
    return Array.from(this.profiles.values()).filter(
      (p) => p.language === language
    );
  }

  findByEmotion(emotion: VPEmotion): VPVoiceProfile[] {
    return Array.from(this.profiles.values()).filter(
      (p) => p.emotionalRange.includes(emotion)
    );
  }

  findByGender(gender: "male" | "female" | "neutral"): VPVoiceProfile[] {
    return Array.from(this.profiles.values()).filter(
      (p) => p.gender === gender
    );
  }

  findBySpeakingStyle(style: string): VPVoiceProfile[] {
    return Array.from(this.profiles.values()).filter(
      (p) => p.speakingStyle === style
    );
  }

  getAll(): VPVoiceProfile[] {
    return Array.from(this.profiles.values()).map((p) => ({ ...p }));
  }

  remove(name: string): boolean {
    return this.profiles.delete(name.toLowerCase());
  }

  count(): number {
    return this.profiles.size;
  }
}
