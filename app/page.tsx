'use client';

import { GeneratorList } from '@/src/game/ui/components/GeneratorList';
import { PrestigePanel } from '@/src/game/ui/components/PrestigePanel';
import { TimeCore } from '@/src/game/ui/components/TimeCore';
import { TopBar } from '@/src/game/ui/components/TopBar';
import { UpgradeTabs } from '@/src/game/ui/components/UpgradeTabs';
import { WorldPanel } from '@/src/game/ui/components/WorldPanel';
import { useWorkerBridge } from '@/src/game/ui/hooks/useWorkerBridge';

export default function HomePage() {
  const { dispatch } = useWorkerBridge();

  return (
    <main className="cosmic-bg min-h-screen p-4 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <TopBar dispatch={dispatch} />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_1fr_1.15fr]">
          <div>
            <TimeCore dispatch={dispatch} />
          </div>
          <div>
            <WorldPanel />
            <PrestigePanel dispatch={dispatch} />
          </div>
          <div>
            <GeneratorList dispatch={dispatch} />
            <UpgradeTabs dispatch={dispatch} />
          </div>
        </div>
      </div>
    </main>
  );
}
