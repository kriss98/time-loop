'use client';

type SoundKey = 'click' | 'buy' | 'prestige';

const PATHS: Record<SoundKey, string> = {
  click: '/assets/sfx/click.mp3',
  buy: '/assets/sfx/buy.mp3',
  prestige: '/assets/sfx/prestige.mp3',
};

class SoundManager {
  private enabled = true;
  private volume = 0.65;
  private unlocked = false;
  private audio: Partial<Record<SoundKey, HTMLAudioElement>> = {};
  private lastClickAt = 0;

  configure(enabled: boolean, volumePercent: number): void {
    this.enabled = enabled;
    this.volume = Math.min(1, Math.max(0, volumePercent / 100));
    Object.values(this.audio).forEach((el) => {
      if (el) el.volume = this.volume;
    });
  }

  unlock(): void {
    if (this.unlocked) return;
    this.unlocked = true;
  }

  private getAudio(key: SoundKey): HTMLAudioElement {
    if (!this.audio[key]) {
      const el = new Audio(PATHS[key]);
      el.preload = 'none';
      el.volume = this.volume;
      this.audio[key] = el;
    }
    return this.audio[key] as HTMLAudioElement;
  }

  play(key: SoundKey): void {
    if (!this.enabled || !this.unlocked) return;
    if (key === 'click') {
      const now = performance.now();
      if (now - this.lastClickAt < 55) return;
      this.lastClickAt = now;
    }

    try {
      const el = this.getAudio(key);
      el.currentTime = 0;
      void el.play().catch(() => undefined);
    } catch {
      // fail silently if file missing / unsupported
    }
  }
}

export const soundManager = new SoundManager();
