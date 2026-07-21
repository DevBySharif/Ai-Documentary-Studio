import { ChannelDNA } from '@studio/dna';

export class PromptDNACompiler {
  /**
   * Serializes the rich DNA profile from @studio/dna into a standardized prompt section.
   */
  static compileToPromptContext(dna: ChannelDNA): string {
    return [
      `### CHANNEL IDENTITY`,
      `Channel: ${dna.identity.channelName}`,
      `Philosophy: ${dna.identity.creativePhilosophy}`,
      `Tone: ${dna.identity.tone}`,
      
      `### NARRATIVE GUIDELINES`,
      `Story Structure: ${dna.narrative.storyStructure}`,
      `Fact Presentation: ${dna.narrative.factPresentation}`,
      `Emotional Intensity: ${dna.narrative.emotionalIntensity}`,
      
      `### VISUAL LANGUAGE`,
      `Art Direction: ${dna.visuals.artDirection}`,
      `Color Philosophy: ${dna.visuals.colorPhilosophy}`,
      `Shot Composition: ${dna.visuals.shotComposition}`,
      
      `### VOICE & PACING`,
      `Narration Style: ${dna.voice.narrationStyle}`,
      `Emotion: ${dna.voice.emotion}`,
    ].filter(Boolean).join('\n');
  }
}
