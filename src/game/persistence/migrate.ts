import { createInitialState, STATE_VERSION } from '@/src/game/sim/reducer';
import { PersistedSave } from '@/src/game/sim/messages';

type LegacyState = {
  version?: number;
  seconds?: number;
  minutes?: number;
  hours?: number;
  totalHours?: number;
  totalChrononsEarned?: number;
  chronons?: number;
  audio?: { sfxEnabled?: boolean; sfxVolume?: number };
} & Record<string, unknown>;

const toChronons = (state: LegacyState): number => {
  if (typeof state.chronons === 'number') return state.chronons;
  const seconds = typeof state.seconds === 'number' ? state.seconds : 0;
  const minutes = typeof state.minutes === 'number' ? state.minutes : 0;
  const hours = typeof state.hours === 'number' ? state.hours : 0;
  return seconds + minutes * 60 + hours * 3600;
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

  return {
    version: STATE_VERSION,
    savedAt: save.savedAt,
    state: {
      ...base,
      ...(save.state as object),
      version: STATE_VERSION,
      chronons,
      totalChrononsEarned,
      audio: {
        sfxEnabled: legacy.audio?.sfxEnabled ?? base.audio.sfxEnabled,
        sfxVolume: legacy.audio?.sfxVolume ?? base.audio.sfxVolume,
      },
    },
  };
};
