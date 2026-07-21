import type { MRMotionPreset, MRCinematographerDecision } from "./types.js";

export class MRAICinematographer {
  select(sceneIndex: number, scriptMeaning: string, narrationEmotion: string, subjectImportance: number, previousMotion: MRMotionPreset | null, upcomingTransition: string): MRCinematographerDecision {
    const lower = scriptMeaning.toLowerCase();

    if (lower.includes("?") || narrationEmotion === "curiosity") {
      return { sceneIndex, selectedMotion: "push_in", reason: "Question or curiosity — slow push in to engage", confidence: 0.85 };
    }
    if (narrationEmotion === "wonder" || narrationEmotion === "reflection") {
      return { sceneIndex, selectedMotion: "push_out", reason: "Reflection — slow push out for space", confidence: 0.8 };
    }
    if (lower.includes("because") || lower.includes("but") || narrationEmotion === "hope") {
      return { sceneIndex, selectedMotion: "reveal", reason: "Reveal or hope — reveal movement", confidence: 0.75 };
    }
    if (narrationEmotion === "fear" || narrationEmotion === "urgency") {
      return { sceneIndex, selectedMotion: "drift", reason: "Tension — subtle drift", confidence: 0.7 };
    }
    if (subjectImportance > 0.8) {
      return { sceneIndex, selectedMotion: "push_in", reason: "High importance subject — focus attention", confidence: 0.9 };
    }
    if (upcomingTransition === "hard_cut") {
      return { sceneIndex, selectedMotion: "hold", reason: "Hard cut incoming — static hold", confidence: 0.65 };
    }

    if (previousMotion === "push_in") {
      return { sceneIndex, selectedMotion: "hold", reason: "Alternating from push_in — hold for pacing", confidence: 0.6 };
    }
    if (previousMotion === "hold") {
      return { sceneIndex, selectedMotion: "pan_right", reason: "Alternating from hold — gentle pan", confidence: 0.55 };
    }

    return { sceneIndex, selectedMotion: "micro_motion", reason: "Default — subtle micro motion", confidence: 0.5 };
  }

  getMotionForNarrativeRole(role: string): MRMotionPreset {
    const map: Record<string, MRMotionPreset> = {
      question: "push_in", reveal: "hold", reflection: "push_out", exposition: "micro_motion"
    };
    return map[role] ?? "hold";
  }
}
