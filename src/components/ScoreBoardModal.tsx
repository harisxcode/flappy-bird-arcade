import React, { useEffect, useState } from 'react';
import { BirdSkin, GameStats } from '../types/game';
import { sounds } from '../utils/audio';

interface ScoreBoardModalProps {
  score: number;
  stats: GameStats;
  isNewHigh: boolean;
  onRestart: () => void;
  onOpenSkins: () => void;
  onOpenStats: () => void;
  currentSkin: BirdSkin;
}

export const ScoreBoardModal: React.FC<ScoreBoardModalProps> = ({
  score,
  stats,
  isNewHigh,
  onRestart,
  onOpenSkins,
  onOpenStats,
}) => {
  const [displayedScore, setDisplayedScore] = useState(0);

  // Smooth score roll-up animation
  useEffect(() => {
    let current = 0;
    const target = score;
    if (target === 0) {
      setDisplayedScore(0);
      return;
    }
    const step = Math.max(1, Math.ceil(target / 25));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setDisplayedScore(target);
        clearInterval(timer);
      } else {
        setDisplayedScore(current);
      }
    }, 35);
    return () => clearInterval(timer);
  }, [score]);

  // Determine medal
  let medalType: 'none' | 'bronze' | 'silver' | 'gold' | 'platinum' = 'none';
  if (score >= 40) medalType = 'platinum';
  else if (score >= 30) medalType = 'gold';
  else if (score >= 20) medalType = 'silver';
  else if (score >= 10) medalType = 'bronze';

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-[340px] flex flex-col items-center">
        {/* Game Over Title */}
        <h2 className="font-arcade text-2xl tracking-wider text-rose-500 drop-shadow-[0_3px_0_#450a0a] mb-5 text-center animate-bounce">
          GAME OVER
        </h2>

        {/* Score Board Box */}
        <div className="w-full bg-[#ded895] border-4 border-[#543847] rounded-xl p-4 shadow-[0_8px_0_#2b1b24] relative mb-5">
          {/* Bevel internal highlight */}
          <div className="flex items-center justify-between gap-3">
            {/* Medal Slot */}
            <div className="flex flex-col items-center">
              <span className="font-arcade text-[9px] text-[#785b46] mb-1.5 uppercase tracking-wide">
                MEDAL
              </span>
              <div className="w-16 h-16 rounded-full border-3 border-[#785b46] bg-[#cbb86e] flex items-center justify-center shadow-inner relative overflow-hidden">
                {medalType === 'none' ? (
                  <span className="text-xs font-arcade text-[#785b46]/50">--</span>
                ) : (
                  <div className="relative flex items-center justify-center">
                    {/* Medal visual */}
                    <div
                      className={`w-11 h-11 rounded-full border-2 flex items-center justify-center shadow-md font-arcade text-xs font-bold ${
                        medalType === 'platinum'
                          ? 'bg-gradient-to-tr from-cyan-200 via-slate-100 to-cyan-100 border-cyan-400 text-cyan-900 shadow-cyan-300/50'
                          : medalType === 'gold'
                          ? 'bg-gradient-to-tr from-yellow-500 via-amber-300 to-yellow-200 border-amber-600 text-amber-950 shadow-amber-400/50'
                          : medalType === 'silver'
                          ? 'bg-gradient-to-tr from-slate-400 via-slate-200 to-slate-100 border-slate-500 text-slate-800 shadow-slate-300/50'
                          : 'bg-gradient-to-tr from-amber-800 via-amber-600 to-amber-500 border-amber-900 text-amber-950 shadow-amber-700/50'
                      }`}
                    >
                      {medalType === 'platinum' ? '★' : medalType === 'gold' ? 'G' : medalType === 'silver' ? 'S' : 'B'}
                    </div>
                    {/* Sparkle badge */}
                    <span className="absolute -top-1 -right-1 text-xs animate-ping">✨</span>
                  </div>
                )}
              </div>
              {medalType !== 'none' && (
                <span className="font-arcade text-[8px] text-[#543847] mt-1 font-bold uppercase">
                  {medalType}
                </span>
              )}
            </div>

            {/* Score & Best */}
            <div className="flex-1 flex flex-col items-end gap-2.5">
              <div className="w-full flex flex-col items-end bg-[#eee8aa]/50 p-1.5 rounded border border-[#b8a65d]">
                <span className="font-arcade text-[8px] text-[#785b46] tracking-wider uppercase">
                  SCORE
                </span>
                <span className="font-arcade text-2xl text-[#2b1b24] tracking-tight">
                  {displayedScore}
                </span>
              </div>

              <div className="w-full flex flex-col items-end bg-[#eee8aa]/50 p-1.5 rounded border border-[#b8a65d] relative">
                <div className="flex items-center gap-1.5">
                  {isNewHigh && (
                    <span className="font-arcade text-[7px] bg-rose-500 text-white px-1 py-0.5 rounded animate-pulse">
                      NEW!
                    </span>
                  )}
                  <span className="font-arcade text-[8px] text-[#785b46] tracking-wider uppercase">
                    BEST
                  </span>
                </div>
                <span className="font-arcade text-xl text-[#2b1b24] tracking-tight">
                  {stats.highScore}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={() => {
              sounds.playClick();
              onRestart();
            }}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 active:translate-y-1 text-white font-arcade text-sm rounded-lg border-2 border-emerald-700 shadow-[0_4px_0_#065f46] transition-transform flex items-center justify-center gap-2 cursor-pointer"
          >
            PLAY AGAIN
            <span className="text-[10px] text-emerald-100 font-ui opacity-90">(Space)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                onOpenSkins();
              }}
              className="py-2.5 bg-amber-500 hover:bg-amber-400 active:translate-y-0.5 text-white font-arcade text-xs rounded-lg border-2 border-amber-700 shadow-[0_3px_0_#92400e] transition-transform cursor-pointer"
            >
              SKINS
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onOpenStats();
              }}
              className="py-2.5 bg-sky-600 hover:bg-sky-500 active:translate-y-0.5 text-white font-arcade text-xs rounded-lg border-2 border-sky-800 shadow-[0_3px_0_#075985] transition-transform cursor-pointer"
            >
              STATS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
