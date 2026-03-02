import { describe, expect, it } from 'vitest';

import {
  PRESTIGE_REQUIREMENT,
  calculateAffordableAmount,
  getChrononsPerSecond,
  getProjectedParadoxGain,
  getTotalCost,
} from './formulas';
import { createInitialState } from '../sim/reducer';

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
    const rate = getChrononsPerSecond(state);
    expect(rate).toBeGreaterThan(1);
  });

  it('calculates paradox gain curve', () => {
    expect(getProjectedParadoxGain(PRESTIGE_REQUIREMENT - 1)).toBe(0);
    expect(getProjectedParadoxGain(PRESTIGE_REQUIREMENT)).toBe(1);
  });
});
