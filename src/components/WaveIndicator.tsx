import React from 'react';

interface WaveIndicatorProps {
  currentWave: number;
  locality: string;
  district: string;
  timerSeconds?: number;
}

export const WaveIndicator: React.FC<WaveIndicatorProps> = ({
  currentWave,
  locality,
  district,
  timerSeconds = 15
}) => {
  return (
    <div className=w-full space-y-3>
      <div className=text-xs font-bold text-viora-navy uppercase tracking-wider mb-2>
        Matching Network Escalation
      </div>

      <div className={p-3.5 rounded-xl border transition }>
        <div className=flex items-center justify-between>
          <div className=flex items-center gap-3>
            <span className={w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold }>
              {currentWave > 1 ? '?' : '1'}
            </span>
            <div>
              <div className=text-sm font-bold text-viora-navy>Wave 1: Nearby locality ({locality})</div>
              <div className=text-xs text-viora-muted>3-5 km radius around hospital</div>
            </div>
          </div>
          {currentWave === 1 && (
            <span className=font-mono text-xs font-bold text-viora-red>
              00:{timerSeconds < 10 ? '0' : ''}{timerSeconds}
            </span>
          )}
        </div>
      </div>

      <div className={p-3.5 rounded-xl border transition }>
        <div className=flex items-center justify-between>
          <div className=flex items-center gap-3>
            <span className={w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold }>
              {currentWave > 2 ? '?' : '2'}
            </span>
            <div>
              <div className=text-sm font-bold text-viora-navy>Wave 2: District-wide search ({district})</div>
              <div className=text-xs text-viora-muted>Wider district coverage for verified donors</div>
            </div>
          </div>
          {currentWave === 2 && (
            <span className=font-mono text-xs font-bold text-viora-navy>
              00:{timerSeconds < 10 ? '0' : ''}{timerSeconds}
            </span>
          )}
        </div>
      </div>

      <div className={p-3.5 rounded-xl border transition }>
        <div className=flex items-center gap-3>
          <span className={w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold }>
            3
          </span>
          <div>
            <div className=text-sm font-bold text-viora-navy>Wave 3: Extended Kerala search</div>
            <div className=text-xs text-viora-muted>Neighboring Kerala districts</div>
          </div>
        </div>
      </div>
    </div>
  );
};
