import { PublishingPlatform, RepurposedFormat } from "./assistant-types";

export interface RepurposedSnippetSuggestion {
  readonly snippetId: string;
  readonly targetPlatform: PublishingPlatform;
  readonly format: RepurposedFormat;
  readonly recommendedDurationSecs: number;
  readonly aspectRatio: "16:9" | "9:16" | "1:1";
  readonly title: string;
}

/**
 * Multi-Platform Repurposer (Vol 04 Part 12 - Section 13, Section 14, Section 15).
 * Generates platform-specific derivative content suggestions (Shorts, Reels, Clips, Trailers).
 */
export class MultiPlatformRepurposer {
  public generateRepurposingPlan(documentaryTitle: string): ReadonlyArray<RepurposedSnippetSuggestion> {
    return [
      {
        snippetId: "rep_1",
        targetPlatform: "YouTube",
        format: "Shorts",
        recommendedDurationSecs: 58,
        aspectRatio: "9:16",
        title: `Did you know this about ${documentaryTitle}? #shorts`,
      },
      {
        snippetId: "rep_2",
        targetPlatform: "TikTok",
        format: "Reels",
        recommendedDurationSecs: 45,
        aspectRatio: "9:16",
        title: `The most shocking moment in ${documentaryTitle}`,
      },
      {
        snippetId: "rep_3",
        targetPlatform: "X",
        format: "PromotionalTrailer",
        recommendedDurationSecs: 90,
        aspectRatio: "16:9",
        title: `Official Trailer: ${documentaryTitle}`,
      },
    ];
  }
}
