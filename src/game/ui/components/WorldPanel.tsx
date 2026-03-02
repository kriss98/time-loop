'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/src/game/store/useGameStore';

const cosmicMessages = [
  'Microfractures stabilize around your orb lattice.',
  'A remote timeline sends faint harmonics.',
  'Paradox dust accumulates at event horizon epsilon.',
  'The loop breathes in sync with your click rhythm.',
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
      <h2 className="panel-title mb-2">Timeline Feed</h2>
      <p className="text-sm text-slate-200">Engineer stable loops, scale Chronon output, then collapse the branch for paradox meta-growth.</p>
      <p className="mt-3 rounded-md border border-cyan-300/20 bg-slate-900/40 px-3 py-2 text-xs tracking-wide text-cyan-100">{ambient}</p>

      <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-300">Event Log</h3>
      <ul className="mt-2 max-h-80 space-y-1 overflow-y-auto pr-1 text-sm text-slate-200">
        {state.log.map((entry, idx) => (
          <li key={`${entry}-${idx}`} className="rounded bg-slate-900/40 px-2 py-1">
            • {entry}
          </li>
        ))}
      </ul>
    </section>
  );
};
