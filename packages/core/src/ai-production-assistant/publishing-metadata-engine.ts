import { TitleOption, ThumbnailConcept, ChapterMarker } from "./assistant-types";

/**
 * Publishing Metadata Engine (Vol 04 Part 12 - Section 7, Section 8, Section 9, Section 10, Section 11, Section 12).
 * Generates SEO-optimized titles, thumbnail concepts, descriptions, chapter markers, and subtitle suggestions.
 */
export class PublishingMetadataEngine {
  public generateTitleOptions(topic: string): ReadonlyArray<TitleOption> {
    return [
      { title: `The Hidden History of ${topic}`, style: "Curiosity", predictedCTRScore: 92 },
      { title: `How ${topic} Changed the World | Complete Documentary`, style: "EducationalClarity", predictedCTRScore: 95 },
      { title: `${topic}: Facts, Timeline & Impact Explained`, style: "SearchIntent", predictedCTRScore: 89 },
    ];
  }

  public generateThumbnailConcepts(topic: string): ReadonlyArray<ThumbnailConcept> {
    return [
      {
        conceptId: "thumb_1",
        visualPrompt: `Dramatic close-up portrait with glowing historical background for ${topic}`,
        textOverlay: "THE UNTOLD TRUTH",
        framingStyle: "Close-Up High Contrast",
        colorEmphasis: "Deep Crimson and Gold",
      },
      {
        conceptId: "thumb_2",
        visualPrompt: `Historical map splitting into archival footage scene for ${topic}`,
        textOverlay: "WHAT REALLY HAPPENED?",
        framingStyle: "Split Screen Contrast",
        colorEmphasis: "Cyan and Dark Navy",
      },
    ];
  }

  public generateChapterMarkers(sceneTitles: ReadonlyArray<string>, sceneDurationsSecs: ReadonlyArray<number>): ReadonlyArray<ChapterMarker> {
    let currentTime = 0;
    return sceneTitles.map((title, idx) => {
      const dur = sceneDurationsSecs[idx] || 60;
      const marker: ChapterMarker = {
        startTimeSecs: currentTime,
        title: `Chapter ${idx + 1}: ${title}`,
        description: `Deep dive into ${title}`,
      };
      currentTime += dur;
      return marker;
    });
  }
}
