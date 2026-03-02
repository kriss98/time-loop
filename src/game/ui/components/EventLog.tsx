'use client';

import { useGameStore } from '@/src/game/store/useGameStore';

export const EventLog = () => {
  const { state } = useGameStore();
  return (
    <div className="rounded-lg bg-panel p-4">
      <h2 className="mb-2 text-lg font-bold">Event Log</h2>
      <ul className="space-y-1 text-sm text-slate-300">
        {state.log.map((entry, idx) => (
          <li key={`${entry}-${idx}`}>• {entry}</li>
        ))}
      </ul>
    </div>
  );
};
