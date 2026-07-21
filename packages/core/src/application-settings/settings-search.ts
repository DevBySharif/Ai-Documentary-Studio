export interface ASIndexedSetting {
  key: string;
  label: string;
  description: string;
  category: string;
  tokens: string[];
}

export class ASSettingsSearch {
  private index: ASIndexedSetting[] = [];

  indexSetting(key: string, label: string, description: string, category: string): void {
    const tokens = this.tokenize(`${key} ${label} ${description} ${category}`);
    const existing = this.index.findIndex((s) => s.key === key);
    const entry: ASIndexedSetting = { key, label, description, category, tokens };

    if (existing >= 0) {
      this.index[existing] = entry;
    } else {
      this.index.push(entry);
    }
  }

  removeFromIndex(key: string): void {
    this.index = this.index.filter((s) => s.key !== key);
  }

  search(query: string): { key: string; label: string; category: string; description: string }[] {
    if (!query || query.trim().length === 0) {
      return this.index.map(({ key, label, category, description }) => ({
        key,
        label,
        category,
        description,
      }));
    }

    const queryTokens = this.tokenize(query);
    const scored = this.index
      .map((entry) => {
        let score = 0;

        for (const queryToken of queryTokens) {
          const tokenScore = this.computeTokenScore(entry, queryToken);
          score += tokenScore;

          if (entry.key.toLowerCase() === queryToken) {
            score += 10;
          }
          if (entry.label.toLowerCase().includes(queryToken)) {
            score += 5;
          }
          if (entry.category.toLowerCase() === queryToken) {
            score += 8;
          }
        }

        return { entry, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.map(({ entry: { key, label, category, description } }) => ({
      key,
      label,
      category,
      description,
    }));
  }

  rebuildIndex(): void {
    this.index = [];
  }

  getIndexedCount(): number {
    return this.index.length;
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/[\s-_]+/)
      .filter((t) => t.length > 0);
  }

  private computeTokenScore(entry: ASIndexedSetting, queryToken: string): number {
    let score = 0;
    for (const token of entry.tokens) {
      if (token === queryToken) {
        score += 3;
      } else if (token.startsWith(queryToken)) {
        score += 2;
      } else if (token.includes(queryToken)) {
        score += 1;
      }
    }
    return score;
  }
}
