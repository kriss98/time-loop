import { createInitialState } from '@/src/game/sim/reducer';
import { GameState } from '@/src/game/sim/messages';

export const runPrestige = (state: GameState, gain: number): GameState => {
  const next = createInitialState();
  next.paradoxPoints = state.paradoxPoints + gain;
  next.purchasedParadoxUpgrades = [...state.purchasedParadoxUpgrades];
  next.audio = state.audio;
  next.log = [`Collapsed timeline for +${gain} paradox points`];
  return next;
};
