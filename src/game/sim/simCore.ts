import { getSecondsPerSecond } from '@/src/game/economy/formulas';
import { GameState } from '@/src/game/sim/messages';

const convert = (state: GameState): void => {
  if (state.unlockedMinutes && state.autoConvertSecondsToMinutes) {
    const gainedMinutes = Math.floor(state.seconds / 60);
    if (gainedMinutes > 0) {
      state.seconds -= gainedMinutes * 60;
      state.minutes += gainedMinutes;
    }
  }

  if (state.unlockedHours && state.autoConvertMinutesToHours) {
    const gainedHours = Math.floor(state.minutes / 60);
    if (gainedHours > 0) {
      state.minutes -= gainedHours * 60;
      state.hours += gainedHours;
      state.totalHours += gainedHours;
    }
  }
};

export const applyTick = (state: GameState, dtSeconds: number): GameState => {
  if (dtSeconds <= 0) return state;
  const sps = getSecondsPerSecond(state);
  state.seconds += sps * dtSeconds;
  convert(state);
  return state;
};
