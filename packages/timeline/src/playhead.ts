import pino from 'pino';

const logger = pino({ name: 'playhead-engine' });

type PlayheadListener = (frame: number) => void;

export class PlayheadEngine {
  private currentFrame: number = 0;
  private isPlaying: boolean = false;
  private timerId: NodeJS.Timeout | null = null;
  private listeners: Set<PlayheadListener> = new Set();

  constructor(private frameRate: number) {}

  getCurrentFrame(): number {
    return this.currentFrame;
  }

  seek(frame: number): void {
    this.currentFrame = Math.max(0, frame);
    this.notifyListeners();
  }

  play(): void {
    if (this.isPlaying) return;
    this.isPlaying = true;
    
    const intervalMs = 1000 / this.frameRate;
    
    // In a real application, using setInterval for frame-accurate playback is unreliable.
    // It would be tied to RequestAnimationFrame in the browser, or a high-res timer in node.
    // This is a naive headless implementation for structural completeness.
    this.timerId = setInterval(() => {
      this.currentFrame++;
      this.notifyListeners();
    }, intervalMs);
    
    logger.debug('Playback started');
  }

  pause(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    
    logger.debug('Playback paused');
  }

  subscribe(listener: PlayheadListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.currentFrame);
    }
  }
}
