import { ASSettingsCategory } from './types';

export class ASSettingsCategories {
  private categories = new Map<string, ASSettingsCategory>();
  private settingCategoryMap = new Map<string, string>();

  registerCategory(category: string, description: string): void {
    if (!this.categories.has(category)) {
      this.categories.set(category, {
        id: category,
        label: category.charAt(0).toUpperCase() + category.slice(1),
        description,
        order: this.categories.size,
      });
    }
  }

  getCategories(): ASSettingsCategory[] {
    return Array.from(this.categories.values()).sort((a, b) => a.order - b.order);
  }

  getSettingsInCategory(category: string): string[] {
    const result: string[] = [];
    for (const [key, cat] of this.settingCategoryMap) {
      if (cat === category) {
        result.push(key);
      }
    }
    return result;
  }

  assignSettingToCategory(settingKey: string, category: string): void {
    this.settingCategoryMap.set(settingKey, category);
    if (!this.categories.has(category)) {
      this.categories.set(category, {
        id: category,
        label: category.charAt(0).toUpperCase() + category.slice(1),
        description: '',
        order: this.categories.size,
      });
    }
  }

  removeSettingFromCategory(settingKey: string): void {
    this.settingCategoryMap.delete(settingKey);
  }

  getCategoryForSetting(settingKey: string): string | undefined {
    return this.settingCategoryMap.get(settingKey);
  }
}
