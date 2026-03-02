'use client';

import Image from 'next/image';
import { MouseEvent, useState } from 'react';
import { PRIMARY_CURRENCY_LABEL, formatNumber } from '@/src/game/economy/format';
import { WorkerAction } from '@/src/game/sim/messages';
import { useGameStore } from '@/src/game/store/useGameStore';
import { soundManager } from '@/src/game/ui/sfx/sound';

type Floater = { id: number; x: number; y: number; text: string };

export const TimeCore = ({ dispatch }: { dispatch: (action: WorkerAction) => void }) => {
  const { state, chrononsPerSec } = useGameStore();
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const [clickFrame, setClickFrame] = useState(0);

  const onCoreClick = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const floater: Floater = {
      id: Date.now() + Math.random(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      text: `+1 ${PRIMARY_CURRENCY_LABEL}`,
    };

    soundManager.unlock();
    soundManager.play('click');
    dispatch({ type: 'CLICK' });
    setClickFrame((f) => f + 1);
    setFloaters((existing) => [...existing, floater]);
    window.setTimeout(() => {
      setFloaters((existing) => existing.filter((item) => item.id !== floater.id));
    }, 820);
  };

  return (
    <section className="game-panel panel-glow p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Temporal Core</p>
      <div className="mt-4 text-center">
        <div className="text-4xl font-black text-white">{formatNumber(state.chronons, state.compactNumbers)}</div>
        <div className="text-sm text-cyan-100">{PRIMARY_CURRENCY_LABEL}</div>
        <div className="mt-2 text-xs text-slate-300">{formatNumber(chrononsPerSec, state.compactNumbers)} / sec</div>
      </div>

      <div className="relative mx-auto mt-4 w-full max-w-[360px]">
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
    </section>
  );
};
