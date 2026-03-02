import { applyTick } from '@/src/game/sim/simCore';
import { GameState } from '@/src/game/sim/messages';

const MAX_OFFLINE_SECONDS = 8 * 3600;

export const applyOfflineProgress = (state: GameState, now = Date.now()): GameState => {
  const elapsed = Math.max(0, (now - state.lastSavedAt) / 1000);
  const capped = Math.min(elapsed, MAX_OFFLINE_SECONDS);
  if (capped <= 0) return state;

  return applyTick(state, capped);
};
