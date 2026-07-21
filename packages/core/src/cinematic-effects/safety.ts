import type { CESafetyResult, CEEffectStack } from "./types.js";

export class CEEffectSafetySystem {
  check(stack: CEEffectStack, subtitleArea: { x: number; y: number; width: number; height: number }): CESafetyResult {
    const messages: string[] = [];
    const overexposed = stack.exposure.highlights > 0.8;
    const excessiveBloom = stack.lighting.bloom > 0.5;
    const strongVignette = stack.lighting.vignette > 0.7;
    const artificialBlur = stack.depth.depthOfField > 0.8;
    const distractingParticles = stack.atmosphere.intensity > 0.6;
    const reducedReadability = strongVignette || (stack.lighting.bloom > 0.3 && subtitleArea.width > 0);

    if (overexposed) messages.push("Overexposed highlights detected");
    if (excessiveBloom) messages.push("Excessive bloom detected");
    if (strongVignette) messages.push("Strong vignette may distract");
    if (artificialBlur) messages.push("Artificial-looking blur");
    if (distractingParticles) messages.push("Distracting atmospheric particles");
    if (reducedReadability) messages.push("Reduced subtitle readability");

    const passed = !overexposed && !excessiveBloom && !strongVignette && !artificialBlur && !reducedReadability;

    return { overexposed, excessiveBloom, strongVignette, artificialBlur, distractingParticles, reducedReadability, passed, messages };
  }

  correct(stack: CEEffectStack, result: CESafetyResult): CEEffectStack {
    const corrected = { ...stack, lighting: { ...stack.lighting }, exposure: { ...stack.exposure }, depth: { ...stack.depth }, atmosphere: { ...stack.atmosphere } };
    if (result.overexposed) corrected.exposure.highlights = Math.min(corrected.exposure.highlights, 0.5);
    if (result.excessiveBloom) corrected.lighting.bloom = 0.2;
    if (result.strongVignette) corrected.lighting.vignette = 0.4;
    if (result.artificialBlur) corrected.depth.depthOfField = 0.3;
    if (result.distractingParticles) corrected.atmosphere.intensity = 0.2;
    return corrected;
  }
}
