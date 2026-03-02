import { GENERATORS } from '@/src/game/content/generators';
import { PARADOX_UPGRADES } from '@/src/game/content/paradoxUpgrades';
import { UPGRADES } from '@/src/game/content/upgrades';
import {
  getCostCompression,
  getProjectedParadoxGain,
  getTotalCost,
  resolveBuyAmount,
} from '@/src/game/economy/formulas';
import { applyTick } from '@/src/game/sim/simCore';
import { runPrestige } from '@/src/game/sim/prestige';
import { GameState, WorkerAction } from '@/src/game/sim/messages';

export const STATE_VERSION = 1;

export const createInitialState = (): GameState => ({
  version: STATE_VERSION,
  seconds: 0,
  minutes: 0,
  hours: 0,
  totalHours: 0,
  paradoxPoints: 0,
  generators: Object.fromEntries(GENERATORS.map((g) => [g.id, 0])),
  purchasedUpgrades: [],
  purchasedParadoxUpgrades: [],
  autoConvertSecondsToMinutes: true,
  autoConvertMinutesToHours: true,
  compactNumbers: false,
  buyMode: 1,
  unlockedMinutes: false,
  unlockedHours: false,
  lastTickAt: Date.now(),
  lastSavedAt: Date.now(),
  log: ['Initialized loop architecture'],
});

const pushLog = (state: GameState, msg: string): void => {
  state.log = [msg, ...state.log].slice(0, 20);
};

export const reduceAction = (state: GameState, action: WorkerAction): GameState => {
  if (action.type === 'CLICK') {
    state.seconds += 1;
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

  if (action.type === 'TOGGLE_AUTOCONVERT') {
    if (action.payload.currency === 'minutes') state.autoConvertSecondsToMinutes = action.payload.enabled;
    if (action.payload.currency === 'hours') state.autoConvertMinutesToHours = action.payload.enabled;
    return state;
  }

  if (action.type === 'BUY_GENERATOR') {
    const generator = GENERATORS.find((g) => g.id === action.payload.id);
    if (!generator) return state;
    const owned = state.generators[generator.id] ?? 0;
    const growth = Math.max(1.05, generator.growth - getCostCompression(state));
    const amount = resolveBuyAmount(action.payload.amountMode, state.seconds, generator.baseCost, growth, owned);
    if (amount <= 0) return state;

    const totalCost = getTotalCost(generator.baseCost, growth, owned, amount);
    if (state.seconds < totalCost) return state;

    state.seconds -= totalCost;
    state.generators[generator.id] = owned + amount;
    pushLog(state, `Bought ${generator.name} x${amount}`);
    return state;
  }

  if (action.type === 'BUY_UPGRADE') {
    const upgrade = UPGRADES.find((u) => u.id === action.payload.id);
    if (!upgrade || state.purchasedUpgrades.includes(upgrade.id)) return state;
    if (state[upgrade.currency] < upgrade.cost) return state;
    state[upgrade.currency] -= upgrade.cost;
    state.purchasedUpgrades.push(upgrade.id);
    if (upgrade.type === 'unlockMinutes') state.unlockedMinutes = true;
    if (upgrade.type === 'unlockHours') state.unlockedHours = true;
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
    if (state.totalHours < 3) return state;
    return runPrestige(state, getProjectedParadoxGain(state.totalHours));
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
