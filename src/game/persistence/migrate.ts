import { createInitialState, STATE_VERSION } from '@/src/game/sim/reducer';
import { PersistedSave } from '@/src/game/sim/messages';

export const migrateSave = (save: PersistedSave): PersistedSave => {
  if (save.version === STATE_VERSION) return save;
  const base = createInitialState();
  return {
    version: STATE_VERSION,
    savedAt: save.savedAt,
    state: {
      ...base,
      ...save.state,
      version: STATE_VERSION,
    },
  };
};
