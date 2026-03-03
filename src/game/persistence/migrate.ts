import { UPGRADES } from '@/src/game/content/upgrades';
import { createInitialState, STATE_VERSION } from '@/src/game/sim/reducer';
import { PersistedSave } from '@/src/game/sim/messages';

type LegacyAudio = {
  sfxEnabled?: boolean;
  musicEnabled?: boolean;
  sfxVolume?: number;
  musicVolume?: number;
};

type LegacyState = {
  version?: number;
  seconds?: number;
  minutes?: number;
  hours?: number;
  totalHours?: number;
  totalChrononsEarned?: number;
  chronons?: number;
  audio?: LegacyAudio;
} & Record<string, unknown>;

const toChronons = (state: LegacyState): number => {
  if (typeof state.chronons === 'number') return state.chronons;
  const seconds = typeof state.seconds === 'number' ? state.seconds : 0;
  const minutes = typeof state.minutes === 'number' ? state.minutes : 0;
  const hours = typeof state.hours === 'number' ? state.hours : 0;
  return seconds + minutes * 60 + hours * 3600;
};

const normalizeVolume = (value: unknown, fallback: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  if (value > 1) return Math.min(1, Math.max(0, value / 100));
  return Math.min(1, Math.max(0, value));
};

export const migrateSave = (save: PersistedSave): PersistedSave => {
  const base = createInitialState();
  const legacy = save.state as unknown as LegacyState;

  const chronons = toChronons(legacy);
  const totalChrononsEarned =
    typeof legacy.totalChrononsEarned === 'number'
      ? legacy.totalChrononsEarned
      : typeof legacy.totalHours === 'number'
        ? legacy.totalHours * 3600
        : chronons;

  const knownUpgradeIds = new Set(UPGRADES.map((upgrade) => upgrade.id));

  return {
    version: STATE_VERSION,
    savedAt: save.savedAt,
    state: {
      ...base,
      ...(save.state as object),
      version: STATE_VERSION,
      chronons,
      totalChrononsEarned,
      generators: {
        ...base.generators,
        ...((save.state.generators as Record<string, number> | undefined) ?? {}),
      },
      purchasedUpgrades: ((save.state.purchasedUpgrades as string[] | undefined) ?? []).filter((id) => knownUpgradeIds.has(id)),
      audio: {
        sfxEnabled: legacy.audio?.sfxEnabled ?? base.audio.sfxEnabled,
        musicEnabled: legacy.audio?.musicEnabled ?? base.audio.musicEnabled,
        sfxVolume: normalizeVolume(legacy.audio?.sfxVolume, base.audio.sfxVolume),
        musicVolume: normalizeVolume(legacy.audio?.musicVolume, base.audio.musicVolume),
      },
    },
  };
};
