'use client';

type SfxKey = 'click' | 'buy' | 'prestige';

type AudioListener = () => void;

/** SFX files live at public/assets/time-loop/sfx */
const SFX_BASE = '/assets/time-loop/sfx';

const SFX_PATHS: Record<SfxKey, string> = {
  click: `${SFX_BASE}/click.ogg`,
  buy: `${SFX_BASE}/buy.ogg`,
  prestige: `${SFX_BASE}/prestige.ogg`,
};

const MUSIC_PATH = `${SFX_BASE}/background.mp3`;
const MAX_SIMULTANEOUS_SFX = 6;
const CLICK_THROTTLE_MS = 40;

class AudioManager {
  private sfxEnabled = true;
  private musicEnabled = false;
  private sfxVolume = 0.7;
  private musicVolume = 0.4;
  private audioUnlocked = false;
  private prepared = false;
  private lastClickAt = 0;
  private listeners = new Set<AudioListener>();

  private sfxBase: Partial<Record<SfxKey, HTMLAudioElement>> = {};
  private sfxPool: Partial<Record<SfxKey, HTMLAudioElement[]>> = {};
  private musicEl: HTMLAudioElement | null = null;

  subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  isUnlocked(): boolean {
    return this.audioUnlocked;
  }

  setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
  }

  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopMusic();
      return;
    }
    this.startMusic();
  }

  setSfxVolume(volume: number): void {
    this.sfxVolume = this.clamp(volume);
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = this.clamp(volume);
    if (this.musicEl) this.musicEl.volume = this.musicVolume;
  }

  unlockAudio(): void {
    if (this.audioUnlocked) return;
    this.prepareAudio();
    this.audioUnlocked = true;
    this.emit();
    if (this.musicEnabled) this.startMusic();
  }

  playClick(): void {
    const now = performance.now();
    if (now - this.lastClickAt < CLICK_THROTTLE_MS) return;
    this.lastClickAt = now;
    this.playSfx('click');
  }

  playBuy(): void {
    this.playSfx('buy');
  }

  playPrestige(): void {
    this.playSfx('prestige');
  }

  startMusic(): void {
    this.prepareAudio();
    if (!this.musicEnabled || !this.audioUnlocked || !this.musicEl) return;
    this.musicEl.volume = this.musicVolume;
    void this.musicEl.play().catch((error) => this.warn('Music playback failed', error));
  }

  stopMusic(): void {
    if (!this.musicEl) return;
    this.musicEl.pause();
    this.musicEl.currentTime = 0;
  }

  private playSfx(key: SfxKey): void {
    this.prepareAudio();
    if (!this.sfxEnabled || !this.audioUnlocked) return;
    const base = this.sfxBase[key];
    if (!base) return;

    const pool = this.sfxPool[key] ?? [];
    let candidate = pool.find((audio) => audio.paused || audio.ended);

    if (!candidate && pool.length < MAX_SIMULTANEOUS_SFX) {
      candidate = base.cloneNode(true) as HTMLAudioElement;
      candidate.preload = 'auto';
      pool.push(candidate);
      this.sfxPool[key] = pool;
    }

    if (!candidate) return;

    candidate.volume = this.sfxVolume;
    candidate.currentTime = 0;
    void candidate.play().catch((error) => this.warn(`SFX playback failed: ${key}`, error));
  }

  private prepareAudio(): void {
    if (this.prepared) return;
    this.prepared = true;

    (Object.keys(SFX_PATHS) as SfxKey[]).forEach((key) => {
      try {
        const audio = new Audio(SFX_PATHS[key]);
        audio.preload = 'auto';
        audio.volume = this.sfxVolume;
        this.sfxBase[key] = audio;
        this.sfxPool[key] = [audio];
      } catch (error) {
        this.warn(`Failed to initialize SFX: ${key}`, error);
      }
    });

    try {
      const music = new Audio(MUSIC_PATH);
      music.preload = 'auto';
      music.loop = true;
      music.volume = this.musicVolume;
      this.musicEl = music;
    } catch (error) {
      this.warn('Failed to initialize background music', error);
    }
  }

  private emit(): void {
    this.listeners.forEach((listener) => listener());
  }

  private clamp(value: number): number {
    if (!Number.isFinite(value)) return 0;
    return Math.min(1, Math.max(0, value));
  }

  private warn(message: string, error: unknown): void {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[audio] ${message}`, error);
    }
  }
}

export const audioManager = new AudioManager();
