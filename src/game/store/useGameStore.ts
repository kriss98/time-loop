import { create } from 'zustand';
import { CurrencyId, GameState } from '@/src/game/sim/messages';
import { createInitialState } from '@/src/game/sim/reducer';

interface StoreState {
  state: GameState;
  rates: Record<CurrencyId, number>;
  chrononsPerSec: number;
  projectedParadoxGain: number;
  setSnapshot: (snapshot: {
    state: GameState;
    rates: Record<CurrencyId, number>;
    chrononsPerSec: number;
    projectedParadoxGain: number;
  }) => void;
}

export const useGameStore = create<StoreState>((set) => ({
  state: createInitialState(),
  rates: { chronons: 0 },
  chrononsPerSec: 0,
  projectedParadoxGain: 0,
  setSnapshot: (snapshot) => set(snapshot),
}));
