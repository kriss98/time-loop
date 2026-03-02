import { db } from '@/src/game/persistence/db';
import { migrateSave } from '@/src/game/persistence/migrate';
import { SaveSlot } from '@/src/game/persistence/schema';
import { GameState, PersistedSave } from '@/src/game/sim/messages';

const KEY = 'time-loop-architect-fallback';

export const saveState = async (state: GameState): Promise<void> => {
  const payload: SaveSlot = { id: 'slot-1', version: state.version, state, savedAt: Date.now() };
  try {
    await db.saves.put(payload);
  } catch {
    localStorage.setItem(KEY, JSON.stringify(payload));
  }
};

export const loadState = async (): Promise<PersistedSave | null> => {
  try {
    const data = await db.saves.get('slot-1');
    return data ? migrateSave(data) : null;
  } catch {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return migrateSave(JSON.parse(raw) as PersistedSave);
  }
};

export const exportState = (state: GameState): string => {
  const payload: PersistedSave = { version: state.version, state, savedAt: Date.now() };
  return btoa(JSON.stringify(payload));
};

export const importState = (encoded: string): PersistedSave => {
  const decoded = atob(encoded.trim());
  const parsed = JSON.parse(decoded) as PersistedSave;
  if (!parsed?.state || typeof parsed.version !== 'number') {
    throw new Error('Invalid save string.');
  }
  return migrateSave(parsed);
};
