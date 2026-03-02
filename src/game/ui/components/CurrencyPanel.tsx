'use client';

import { formatNumber } from '@/src/game/economy/format';
import { useGameStore } from '@/src/game/store/useGameStore';
import { WorkerAction } from '@/src/game/sim/messages';

export const CurrencyPanel = ({ dispatch }: { dispatch: (action: WorkerAction) => void }) => {
  const { state, rates } = useGameStore();
  return (
    <div className="rounded-lg bg-panel p-4">
      <h2 className="mb-3 text-lg font-bold">Currencies</h2>
      {(['seconds', 'minutes', 'hours'] as const).map((key) => (
        <div key={key} className="flex justify-between py-1">
          <span className="capitalize">{key}</span>
          <span>
            {formatNumber(state[key], state.compactNumbers)} ({formatNumber(rates[key], state.compactNumbers)}/s)
          </span>
        </div>
      ))}
      <div className="mt-4 flex flex-col gap-2 text-sm">
        <button
          className="rounded bg-sky-600 px-2 py-1"
          onClick={() =>
            dispatch({ type: 'TOGGLE_COMPACT_NUMBERS', payload: { enabled: !state.compactNumbers } })
          }
        >
          Compact Numbers: {state.compactNumbers ? 'On' : 'Off'}
        </button>
        <button
          className="rounded bg-slate-700 px-2 py-1"
          onClick={() =>
            dispatch({
              type: 'TOGGLE_AUTOCONVERT',
              payload: { currency: 'minutes', enabled: !state.autoConvertSecondsToMinutes },
            })
          }
        >
          Auto seconds→minutes: {state.autoConvertSecondsToMinutes ? 'On' : 'Off'}
        </button>
        <button
          className="rounded bg-slate-700 px-2 py-1"
          onClick={() =>
            dispatch({
              type: 'TOGGLE_AUTOCONVERT',
              payload: { currency: 'hours', enabled: !state.autoConvertMinutesToHours },
            })
          }
        >
          Auto minutes→hours: {state.autoConvertMinutesToHours ? 'On' : 'Off'}
        </button>
      </div>
    </div>
  );
};
