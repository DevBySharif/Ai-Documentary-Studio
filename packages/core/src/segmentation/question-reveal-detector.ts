const QUESTION_PATTERNS = [
  /\b(why|how|what|when|where|who|which)\b/i,
  /\b(does|do|did|is|are|was|were|will|would|can|could|should)\b.*\?/i,
  /\?$/,
];

const REVEAL_PATTERNS = [
  /\b(scientists?|researchers?|experts?)\s+(discovered|found|revealed|announced|confirmed|uncovered)\b/i,
  /\b(studies?\s+show|research\s+indicates|studies?\s+suggest|studies?\s+reveal)\b/i,
  /\b(the\s+truth\s+is|what\s+they\s+found|here's\s+the\s+truth|the\s+answer\s+is)\b/i,
  /\b(new\s+(study|research|finding|discovery|evidence))\b/i,
  /\b(turns\s+out|it\s+turns\s+out|as\s+it\s+turns\s+out)\b/i,
];

export class QuestionRevealDetector {
  detectQuestion(text: string): boolean {
    return QUESTION_PATTERNS.some((p) => p.test(text));
  }

  detectReveal(text: string): boolean {
    return REVEAL_PATTERNS.some((p) => p.test(text));
  }
}
