export interface ASImpactReport {
  impact: 'none' | 'low' | 'medium' | 'high' | 'critical';
  warnings: string[];
}

export class ASLiveConfigurationPreview {
  previewUITheme(theme: string): string {
    switch (theme) {
      case 'dark':
        return 'Dark mode — reduced eye strain, lower power consumption on OLED screens, suits professional editing';
      case 'light':
        return 'Light mode — better readability in bright environments, traditional IDE appearance';
      case 'system':
        return 'System mode — follows OS preference, adapts automatically between light and dark';
      default:
        return `${theme} — custom theme applied`;
    }
  }

  estimateRenderTime(settings: Record<string, unknown>): number {
    const resolution = (settings['resolution'] as string) || '1920x1080';
    const fps = (settings['fps'] as number) || 30;
    const codec = (settings['codec'] as string) || 'h264';
    const bitrate = (settings['bitrate'] as number) || 8000;

    const [width, height] = resolution.split('x').map(Number);
    const pixelCount = (width || 1920) * (height || 1080);
    const resolutionFactor = pixelCount / (1920 * 1080);

    const codecFactors: Record<string, number> = {
      h264: 1.0,
      h265: 1.8,
      vp9: 2.2,
      av1: 3.0,
    };
    const codecFactor = codecFactors[codec] || 1.0;

    const bitrateFactor = bitrate / 8000;
    const fpsFactor = fps / 30;

    const baseTimeMinutes = 10;
    const estimatedMinutes =
      baseTimeMinutes * resolutionFactor * codecFactor * bitrateFactor * fpsFactor;

    return Math.round(estimatedMinutes * 100) / 100;
  }

  projectStorageUsage(settings: Record<string, unknown>): number {
    const resolution = (settings['resolution'] as string) || '1920x1080';
    const fps = (settings['fps'] as number) || 30;
    const bitrate = (settings['bitrate'] as number) || 8000;
    const durationMinutes = (settings['durationMinutes'] as number) || 10;
    const qualityProfile = (settings['qualityProfile'] as string) || 'standard';

    const [width, height] = resolution.split('x').map(Number);
    const pixelCount = (width || 1920) * (height || 1080);
    const resolutionFactor = pixelCount / (1920 * 1080);

    const qualityMultiplier: Record<string, number> = {
      draft: 0.5,
      standard: 1.0,
      high: 1.8,
      ultra: 3.0,
    };
    const qualityFactor = qualityMultiplier[qualityProfile] || 1.0;

    const bitsPerFrame = bitrate * 1000 / fps;
    const totalFrames = fps * durationMinutes * 60;
    const bytesPerFrame = bitsPerFrame / 8;

    const estimatedBytes =
      bytesPerFrame * totalFrames * resolutionFactor * qualityFactor;
    const estimatedMB = estimatedBytes / (1024 * 1024);

    return Math.round(estimatedMB * 100) / 100;
  }

  indicateQualityChange(settings: Record<string, unknown>): string {
    const resolution = (settings['resolution'] as string) || '1920x1080';
    const fps = (settings['fps'] as number) || 30;
    const codec = (settings['codec'] as string) || 'h264';
    const bitrate = (settings['bitrate'] as number) || 8000;
    const qualityProfile = (settings['qualityProfile'] as string) || 'standard';

    const points =
      this.scoreResolution(resolution) +
      this.scoreFps(fps) +
      this.scoreCodec(codec) +
      this.scoreBitrate(bitrate, resolution) +
      this.scoreQualityProfile(qualityProfile);

    const maxScore = 50;
    const percentage = Math.round((points / maxScore) * 100);

    if (percentage >= 90) return 'Exceptional — near-lossless production quality';
    if (percentage >= 75) return 'High — broadcast-ready with excellent fidelity';
    if (percentage >= 55) return 'Good — standard quality suitable for most use cases';
    if (percentage >= 35) return 'Fair — acceptable for drafts and internal review';
    return 'Low — minimal quality, suitable for preview only';
  }

  previewChanges(proposedChanges: Record<string, unknown>): ASImpactReport {
    const warnings: string[] = [];
    let impact: 'none' | 'low' | 'medium' | 'high' | 'critical' = 'none';
    let severityScore = 0;

    if ('resolution' in proposedChanges) {
      warnings.push(`Resolution change to ${proposedChanges['resolution']} will affect render quality and file size`);
      severityScore += 3;
    }

    if ('fps' in proposedChanges) {
      warnings.push(`FPS change to ${proposedChanges['fps']} will affect motion smoothness and render time`);
      severityScore += 2;
    }

    if ('codec' in proposedChanges) {
      warnings.push(`Codec change to ${proposedChanges['codec']} may affect compatibility and compression efficiency`);
      severityScore += 2;
    }

    if ('bitrate' in proposedChanges) {
      const bitrateVal = proposedChanges['bitrate'] as number;
      if (bitrateVal < 1000) {
        warnings.push(`Low bitrate (${bitrateVal} kbps) may result in visible compression artifacts`);
        severityScore += 2;
      } else {
        warnings.push(`Bitrate change to ${bitrateVal} kbps will affect file size and quality`);
        severityScore += 1;
      }
    }

    if ('hardwareAcceleration' in proposedChanges) {
      warnings.push(`Hardware acceleration ${proposedChanges['hardwareAcceleration'] ? 'enabled' : 'disabled'} — affects render speed and power usage`);
      severityScore += 1;
    }

    if ('concurrentJobs' in proposedChanges) {
      const jobs = proposedChanges['concurrentJobs'] as number;
      if (jobs > 4) {
        warnings.push(`High concurrent job count (${jobs}) may cause system instability`);
        severityScore += 2;
      }
    }

    if ('workspaceEncryption' in proposedChanges) {
      warnings.push('Enabling workspace encryption may affect save/load performance');
      severityScore += 1;
    }

    if (severityScore >= 8) impact = 'critical';
    else if (severityScore >= 5) impact = 'high';
    else if (severityScore >= 3) impact = 'medium';
    else if (severityScore >= 1) impact = 'low';
    else impact = 'none';

    return { impact, warnings };
  }

  private scoreResolution(resolution: string): number {
    const scores: Record<string, number> = {
      '3840x2160': 10,
      '2560x1440': 8,
      '1920x1080': 6,
      '1280x720': 4,
      '854x480': 2,
      '640x360': 1,
    };
    return scores[resolution] || 3;
  }

  private scoreFps(fps: number): number {
    if (fps >= 60) return 10;
    if (fps >= 48) return 8;
    if (fps >= 30) return 6;
    if (fps >= 24) return 4;
    return 2;
  }

  private scoreCodec(codec: string): number {
    const scores: Record<string, number> = {
      av1: 10,
      h265: 8,
      vp9: 7,
      h264: 5,
    };
    return scores[codec] || 5;
  }

  private scoreBitrate(bitrate: number, resolution: string): number {
    const [w, h] = resolution.split('x').map(Number);
    const pixels = (w || 1920) * (h || 1080);
    const bitratePerPixel = bitrate / (pixels / 1000);
    if (bitratePerPixel >= 20) return 10;
    if (bitratePerPixel >= 10) return 7;
    if (bitratePerPixel >= 5) return 4;
    return 2;
  }

  private scoreQualityProfile(profile: string): number {
    const scores: Record<string, number> = {
      ultra: 10,
      high: 8,
      standard: 5,
      draft: 2,
    };
    return scores[profile] || 5;
  }
}
