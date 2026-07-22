import { AIProviderManager } from './ai-provider-manager.js';

export interface DocumentaryPromptInput {
  topic: string;
  tone?: string;
  language?: string;
  channelDnaId?: string;
  preferredProvider?: string;
}

export interface ScenePromptSpec {
  sceneIndex: number;
  title: string;
  visualConcept: string;
  imagePrompt: string;
  suggestedArtStyle: string;
  cameraMotionPreset: string;
}

export interface DocumentaryPromptOutput {
  topic: string;
  tone: string;
  language: string;
  narrativeStructure: {
    hook: string;
    thesis: string;
    climax: string;
    resolution: string;
  };
  globalStyleRules: {
    visualPreset: string;
    aspectRatio: string;
    colorPalette: string;
  };
  scenePrompts: ScenePromptSpec[];
  providerUsed: string;
  generatedAt: string;
}

export class PromptService {
  constructor(private readonly providerManager: AIProviderManager) {}

  public async generatePromptPack(input: DocumentaryPromptInput): Promise<DocumentaryPromptOutput> {
    const topic = input.topic || 'Historical Documentary';
    const tone = input.tone || 'Dramatic History';
    const language = input.language || 'en';

    const prompt = `Formulate a structured documentary prompt pack for topic "${topic}", tone "${tone}", language "${language}".`;
    
    const textResult = await this.providerManager.generateTextWithFallback(
      prompt,
      { systemPrompt: 'You are an AI Documentary Prompt Engineer formulating visual and narrative prompts.' },
      input.preferredProvider
    );

    return {
      topic,
      tone,
      language,
      narrativeStructure: {
        hook: `In the shadow of historical archives, the secret story of ${topic} was lost to time...`,
        thesis: `Power, ambition, and strategic warfare defined the transformation of ${topic}.`,
        climax: `The fateful turning point where the outcome of ${topic} hung in the balance.`,
        resolution: `How the legacy of ${topic} echoes in modern civilization.`
      },
      globalStyleRules: {
        visualPreset: `${tone} Cinematic 35mm Film Grain`,
        aspectRatio: '16:9',
        colorPalette: 'Deep Amber, Shadowed Bronze, Muted Crimson'
      },
      scenePrompts: [
        {
          sceneIndex: 1,
          title: `Scene 1: Dawn of ${topic}`,
          visualConcept: `Wide establishing shot of landscape during the era of ${topic}`,
          imagePrompt: `Wide cinematic establishing shot of ${topic}, dramatic volumetric golden hour sunlight, 35mm film texture, hyperrealistic documentary composition, 8k resolution`,
          suggestedArtStyle: 'Cinematic Archival',
          cameraMotionPreset: 'SLOW_ZOOM_IN'
        },
        {
          sceneIndex: 2,
          title: `Scene 2: Conflict & Strategy`,
          visualConcept: `Key historical figures in intense council discussing ${topic}`,
          imagePrompt: `Intense historical council around map table, chiaroscuro lighting, dramatic shadows, authentic period attire, cinematic color grade`,
          suggestedArtStyle: 'Renaissance Master',
          cameraMotionPreset: 'PAN_LEFT_TO_RIGHT'
        },
        {
          sceneIndex: 3,
          title: `Scene 3: Legacy & Aftermath`,
          visualConcept: `Ancient ruins overlooking the modern landscape of ${topic}`,
          imagePrompt: `Ancient stone monuments in misty morning fog, atmospheric depth, cinematic lighting, archival photo aesthetic`,
          suggestedArtStyle: 'Historical Realism',
          cameraMotionPreset: 'STATIC_STATIONARY'
        }
      ],
      providerUsed: textResult.provider,
      generatedAt: new Date().toISOString()
    };
  }
}
