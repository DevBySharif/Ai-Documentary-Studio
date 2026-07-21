import type { WMTemplate, WMTemplateType } from "./types.js";

export class WMProjectTemplates {
  private readonly templates: Record<WMTemplateType, WMTemplate> = {
    documentary: { type: "documentary", name: "Documentary", channelDNA: "documentary_base", promptRules: {}, motionProfile: "cinematic", exportProfile: "youtube_long" },
    motivation: { type: "motivation", name: "Motivation", channelDNA: "motivation_base", promptRules: {}, motionProfile: "dynamic", exportProfile: "youtube_shorts" },
    history: { type: "history", name: "History", channelDNA: "history_base", promptRules: {}, motionProfile: "cinematic", exportProfile: "youtube_long" },
    finance: { type: "finance", name: "Finance", channelDNA: "finance_base", promptRules: {}, motionProfile: "professional", exportProfile: "youtube_long" },
    science: { type: "science", name: "Science", channelDNA: "science_base", promptRules: {}, motionProfile: "educational", exportProfile: "youtube_long" },
    education: { type: "education", name: "Education", channelDNA: "education_base", promptRules: {}, motionProfile: "educational", exportProfile: "youtube_long" },
    storytelling: { type: "storytelling", name: "Storytelling", channelDNA: "storytelling_base", promptRules: {}, motionProfile: "narrative", exportProfile: "youtube_long" }
  };

  getTemplate(type: WMTemplateType): WMTemplate {
    return { ...this.templates[type] };
  }

  getAllTemplates(): WMTemplate[] {
    return Object.values(this.templates).map((t) => ({ ...t }));
  }

  getTemplateTypes(): WMTemplateType[] {
    return Object.keys(this.templates) as WMTemplateType[];
  }
}
