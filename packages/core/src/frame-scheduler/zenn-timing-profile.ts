import type { FSZennProfile, FSTransitionType } from "./types.js";

export class FSZennTimingProfile {
  private profile: FSZennProfile = {
    pacing: "slow",
    holds: "long",
    transitions: "gentle",
    subtitleTiming: "frame-perfect",
    motionSync: "narration-synced",
    cameraRhythm: "smooth",
    cadence: "stable"
  };

  getProfile(): FSZennProfile {
    return { ...this.profile };
  }

  getHoldDurationMultiplier(): number {
    return 1.3;
  }

  getTransitionDuration(): number {
    return 500;
  }

  getPreferredTransition(): FSTransitionType {
    return "crossfade";
  }

  getSubtitleLeadIn(): number {
    return 2;
  }

  getMotionSmoothingFrames(): number {
    return 3;
  }

  getDefaultFPS(): 30 {
    return 30;
  }
}
