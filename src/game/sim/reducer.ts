import { GENERATORS } from '@/src/game/content/generators';
import { PARADOX_UPGRADES } from '@/src/game/content/paradoxUpgrades';
import { UPGRADES } from '@/src/game/content/upgrades';
import {
  PRESTIGE_REQUIREMENT_BASELINE,
  getClickPower,
  getCostCompression,
  getProjectedParadoxGain,
  getTotalCost,
  isUpgradeUnlocked,
  resolveBuyAmount,
} from '@/src/game/economy/formulas';
import { applyTick } from '@/src/game/sim/simCore';
import { runPrestige } from '@/src/game/sim/prestige';
import { GameState, WorkerAction } from '@/src/game/sim/messages';

export const STATE_VERSION = 4;

export const createInitialState = (): GameState => ({
  version: STATE_VERSION,
  chronons: 0,
  totalChrononsEarned: 0,
  paradoxPoints: 0,
  clickPower: 1,
  generators: Object.fromEntries(GENERATORS.map((g) => [g.id, 0])),
  purchasedUpgrades: [],
  purchasedParadoxUpgrades: [],
  compactNumbers: false,
  buyMode: 1,
  audio: { sfxEnabled: true, musicEnabled: false, sfxVolume: 0.7, musicVolume: 0.4 },
  lastTickAt: Date.now(),
  lastSavedAt: Date.now(),
  log: ['Initialized loop architecture'],
});

const pushLog = (state: GameState, msg: string): void => {
  state.log = [msg, ...state.log].slice(0, 20);
};

export const reduceAction = (state: GameState, action: WorkerAction): GameState => {
  if (action.type === 'CLICK') {
    const clickValue = getClickPower(state);
    state.chronons += clickValue;
    state.totalChrononsEarned += clickValue;
    return state;
  }

  if (action.type === 'SET_BUY_MODE') {
    state.buyMode = action.payload.mode;
    return state;
  }

  if (action.type === 'TOGGLE_COMPACT_NUMBERS') {
    state.compactNumbers = action.payload.enabled;
    return state;
  }

  if (action.type === 'SET_AUDIO_SETTINGS') {
    state.audio = action.payload;
    return state;
  }

  if (action.type === 'BUY_GENERATOR') {
    const generator = GENERATORS.find((g) => g.id === action.payload.id);
    if (!generator) return state;
    const owned = state.generators[generator.id] ?? 0;
    const growth = Math.max(1.05, generator.growth - getCostCompression(state));
    const amount = resolveBuyAmount(action.payload.amountMode, state.chronons, generator.baseCost, growth, owned);
    if (amount <= 0) return state;

    const totalCost = getTotalCost(generator.baseCost, growth, owned, amount);
    if (state.chronons < totalCost) return state;

    state.chronons -= totalCost;
    state.generators[generator.id] = owned + amount;
    pushLog(state, `Bought ${generator.name} x${amount}`);
    return state;
  }

  if (action.type === 'BUY_UPGRADE') {
    const upgrade = UPGRADES.find((u) => u.id === action.payload.id);
    if (!upgrade || state.purchasedUpgrades.includes(upgrade.id)) return state;
    if (!isUpgradeUnlocked(state, upgrade)) return state;
    if (state.chronons < upgrade.cost) return state;
    state.chronons -= upgrade.cost;
    state.purchasedUpgrades.push(upgrade.id);
    pushLog(state, `Purchased upgrade: ${upgrade.name}`);
    return state;
  }

  if (action.type === 'BUY_PARADOX_UPGRADE') {
    const upgrade = PARADOX_UPGRADES.find((u) => u.id === action.payload.id);
    if (!upgrade || state.purchasedParadoxUpgrades.includes(upgrade.id)) return state;
    if (state.paradoxPoints < upgrade.cost) return state;
    state.paradoxPoints -= upgrade.cost;
    state.purchasedParadoxUpgrades.push(upgrade.id);
    pushLog(state, `Folded paradox upgrade: ${upgrade.name}`);
    return state;
  }

  if (action.type === 'PRESTIGE') {
    if (state.totalChrononsEarned < PRESTIGE_REQUIREMENT_BASELINE) return state;
    return runPrestige(state, getProjectedParadoxGain(state.totalChrononsEarned));
  }

  if (action.type === 'IMPORT_STATE') {
    return action.payload.state;
  }

  if (action.type === 'HARD_RESET') {
    return createInitialState();
  }

  if (action.type === 'REQUEST_SNAPSHOT') {
    return applyTick(state, 0);
  }

  return state;
};
