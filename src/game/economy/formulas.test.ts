import { describe, expect, it } from 'vitest';

import {
  calculateAffordableAmount,
  getProjectedParadoxGain,
  getSecondsPerSecond,
  getTotalCost,
} from '@/src/game/economy/formulas';
import { createInitialState } from '@/src/game/sim/reducer';

describe('economy formulas', () => {
  it('computes geometric purchase cost', () => {
    const total = getTotalCost(10, 1.15, 0, 3);
    expect(total).toBeCloseTo(34.725);
  });

  it('finds max affordable amount', () => {
    const amount = calculateAffordableAmount(1000, 15, 1.15, 0);
    expect(amount).toBeGreaterThan(10);
  });

  it('applies production multipliers', () => {
    const state = createInitialState();
    state.generators.chronoShard = 10;
    state.purchasedUpgrades.push('temporal-efficiency');
    const rate = getSecondsPerSecond(state);
    expect(rate).toBeGreaterThan(1);
  });

  it('calculates paradox gain curve', () => {
    expect(getProjectedParadoxGain(3)).toBe(2);
    expect(getProjectedParadoxGain(100)).toBe(25);
  });
});
