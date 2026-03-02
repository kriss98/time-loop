import { getChrononsPerSecond } from '@/src/game/economy/formulas';
import { GameState } from '@/src/game/sim/messages';

export const applyTick = (state: GameState, dtSeconds: number): GameState => {
  if (dtSeconds <= 0) return state;
  const cps = getChrononsPerSecond(state);
  const gained = cps * dtSeconds;
  state.chronons += gained;
  state.totalChrononsEarned += gained;
  return state;
};
