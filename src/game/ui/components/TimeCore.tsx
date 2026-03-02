'use client';

import Image from 'next/image';
import { MouseEvent, useMemo, useState } from 'react';
import { formatNumber } from '@/src/game/economy/format';
import { WorkerAction } from '@/src/game/sim/messages';
import { useGameStore } from '@/src/game/store/useGameStore';

type Floater = { id: number; x: number; y: number; text: string };

export const TimeCore = ({ dispatch }: { dispatch: (action: WorkerAction) => void }) => {
  const { state, rates } = useGameStore();
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const [clickFrame, setClickFrame] = useState(0);

  const hasPositiveRates = rates.seconds + rates.minutes + rates.hours > 0;

  const onCoreClick = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const floater: Floater = {
      id: Date.now() + Math.random(),
      x,
      y,
      text: `+${formatNumber(1, state.compactNumbers)} seconds`,
    };

    dispatch({ type: 'CLICK' });
    setClickFrame((f) => f + 1);
    setFloaters((existing) => [...existing, floater]);
    window.setTimeout(() => {
      setFloaters((existing) => existing.filter((item) => item.id !== floater.id));
    }, 820);
  };

  const totals = useMemo(
    () => [
      { label: 'Seconds', value: state.seconds, rate: rates.seconds },
      { label: 'Minutes', value: state.minutes, rate: rates.minutes },
      { label: 'Hours', value: state.hours, rate: rates.hours },
      { label: 'Paradox', value: state.paradoxPoints, rate: 0 },
    ],
    [rates.hours, rates.minutes, rates.seconds, state.hours, state.minutes, state.paradoxPoints, state.seconds],
  );

  return (
    <section className="game-panel p-4">
      <h2 className="panel-title mb-2">Temporal Core</h2>
      <div className="relative mx-auto w-full max-w-[360px]">
        <button
          type="button"
          aria-label="Stabilize loop"
          className={`time-core-button ${clickFrame ? 'is-clicked' : ''}`}
          onClick={onCoreClick}
          onAnimationEnd={() => setClickFrame(0)}
        >
          <Image src="/assets/time-loop/core_time_orb.png" alt="Time orb core" width={480} height={480} className="h-full w-full object-contain" priority />
        </button>
        {floaters.map((floater) => (
          <span key={floater.id} className="floater" style={{ left: floater.x, top: floater.y }}>
            {floater.text}
          </span>
        ))}
      </div>

      <div className="mt-4 space-y-1 text-sm">
        {totals.map((row) => (
          <div key={row.label} className={`currency-row ${row.rate > 0 ? 'is-active' : ''}`}>
            <span className="font-semibold uppercase tracking-wide text-slate-300">{row.label}</span>
            <span className={hasPositiveRates ? 'currency-pulse' : ''}>
              {formatNumber(row.value, state.compactNumbers)}
              {row.rate > 0 ? ` (${formatNumber(row.rate, state.compactNumbers)}/s)` : ''}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
