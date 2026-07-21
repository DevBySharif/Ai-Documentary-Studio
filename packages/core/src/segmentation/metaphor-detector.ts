const METAPHOR_PATTERNS = [
  { pattern: /\b(is|are|was|were)\s+(a|an|the)\s+(\w+)/i, symbolIndex: 3 },
  { pattern: /\b(mind|brain|thought)\s+(is|are)\s+(a|an)\s+(\w+)/i, symbolIndex: 4 },
  { pattern: /\b(life|world|reality)\s+(is|are)\s+(like|as)\s+(a|an)\s+(\w+)/i, symbolIndex: 5 },
];

const SYMBOL_MAP: Record<string, string> = {
  prison: "confinement",
  cage: "confinement",
  mirror: "reflection",
  sunrise: "hope",
  sunset: "ending",
  bird: "freedom",
  chain: "restriction",
  shadow: "fear",
  light: "understanding",
  darkness: "confusion",
  wall: "obstacle",
  bridge: "connection",
  river: "flow",
  mountain: "challenge",
  door: "opportunity",
  key: "solution",
  map: "guidance",
  clock: "time",
  seed: "potential",
  tree: "growth",
};

export class MetaphorDetector {
  detect(text: string): { isMetaphor: boolean; symbol?: string; concept: string } {
    for (const { pattern, symbolIndex } of METAPHOR_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        const rawSymbol = match[symbolIndex]?.toLowerCase() ?? "";
        const symbol = SYMBOL_MAP[rawSymbol] ?? rawSymbol;
        return { isMetaphor: true, symbol, concept: symbol };
      }
    }

    return { isMetaphor: false, concept: text.split(/\s+/).slice(0, 3).join(" ") };
  }
}
