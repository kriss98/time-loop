'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/src/game/store/useGameStore';

const cosmicMessages = [
  'A tiny loop collapses into static.',
  'Chrono-noise whispers from beyond this cycle.',
  'A paradox moth circles the core and vanishes.',
  'Future echoes are unusually synchronized.',
  'The timeline resists, then yields.',
];

export const WorldPanel = () => {
  const { state } = useGameStore();
  const [ambient, setAmbient] = useState(cosmicMessages[0]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAmbient(cosmicMessages[Math.floor(Math.random() * cosmicMessages.length)]);
    }, 7000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="game-panel p-4">
      <h2 className="panel-title mb-2">World</h2>
      <p className="text-sm text-slate-200">
        You are threading stable time through a hostile cosmos. Keep the core fed, shape the economy, then collapse
        the timeline for paradox.
      </p>
      <p className="mt-3 rounded-md border border-cyan-300/20 bg-slate-900/40 px-3 py-2 text-xs tracking-wide text-cyan-100">
        {ambient}
      </p>

      <div className="mt-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Event Log</h3>
        <ul className="mt-2 max-h-80 space-y-1 overflow-y-auto pr-1 text-sm text-slate-200">
          {state.log.map((entry, idx) => (
            <li key={`${entry}-${idx}`} className="rounded bg-slate-900/40 px-2 py-1">
              • {entry}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
