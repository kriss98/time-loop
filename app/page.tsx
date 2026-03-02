'use client';

import { CurrencyPanel } from '@/src/game/ui/components/CurrencyPanel';
import { EventLog } from '@/src/game/ui/components/EventLog';
import { GeneratorList } from '@/src/game/ui/components/GeneratorList';
import { PrestigePanel } from '@/src/game/ui/components/PrestigePanel';
import { TopBar } from '@/src/game/ui/components/TopBar';
import { UpgradeTabs } from '@/src/game/ui/components/UpgradeTabs';
import { useWorkerBridge } from '@/src/game/ui/hooks/useWorkerBridge';

export default function HomePage() {
  const { dispatch } = useWorkerBridge();

  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-slate-950 p-4 text-slate-100">
      <TopBar dispatch={dispatch} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <CurrencyPanel dispatch={dispatch} />
        <GeneratorList dispatch={dispatch} />
        <UpgradeTabs dispatch={dispatch} />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PrestigePanel dispatch={dispatch} />
        <EventLog />
      </div>
      <div className="mt-4">
        <button className="rounded bg-emerald-700 px-4 py-2" onClick={() => dispatch({ type: 'CLICK' })}>
          Stabilize Loop
        </button>
      </div>
    </main>
  );
}
