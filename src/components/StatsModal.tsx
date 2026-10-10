import React from 'react';
import { GameStats } from '../types/game';
import { sounds } from '../utils/audio';
import { X, Award, RotateCcw } from 'lucide-react';

interface StatsModalProps {
  stats: GameStats;
  onClose: () => void;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  stats,
  onClose,
  onResetStats,
}) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-[340px] bg-slate-900 border-2 border-slate-700 rounded-xl p-5 shadow-2xl flex flex-col text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-amber-400" />
            <h3 className="font-arcade text-sm text-amber-400">STATISTICS</h3>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Unboxed clean metric list */}
        <div className="flex flex-col divide-y divide-slate-800/80 mb-5">
          <div className="flex items-center justify-between py-2.5">
            <span className="text-xs text-slate-400 font-ui">High Score</span>
            <span className="font-arcade text-sm text-amber-400 font-bold">
              {stats.highScore}
            </span>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <span className="text-xs text-slate-400 font-ui">Games Played</span>
            <span className="font-arcade text-sm text-white">
              {stats.totalGames}
            </span>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <span className="text-xs text-slate-400 font-ui">Pipes Cleared</span>
            <span className="font-arcade text-sm text-emerald-400">
              {stats.totalPipesPassed}
            </span>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <span className="text-xs text-slate-400 font-ui">Total Wing Flaps</span>
            <span className="font-arcade text-sm text-sky-400">
              {stats.totalFlaps}
            </span>
          </div>
        </div>

        {/* Medals Trophies Row */}
        <div className="mb-5 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <span className="font-arcade text-[9px] text-slate-400 block mb-2 tracking-wide uppercase">
            Medals Ranks
          </span>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className={`p-2 rounded border flex flex-col items-center gap-1 ${
              stats.medals.bronze ? 'bg-amber-950/30 border-amber-700/60 text-amber-500' : 'bg-slate-900 border-slate-800 text-slate-600'
            }`}>
              <span className="text-base">🥉</span>
              <span className="font-arcade text-[8px]">10+</span>
            </div>

            <div className={`p-2 rounded border flex flex-col items-center gap-1 ${
              stats.medals.silver ? 'bg-slate-800/60 border-slate-500 text-slate-200' : 'bg-slate-900 border-slate-800 text-slate-600'
            }`}>
              <span className="text-base">🥈</span>
              <span className="font-arcade text-[8px]">20+</span>
            </div>

            <div className={`p-2 rounded border flex flex-col items-center gap-1 ${
              stats.medals.gold ? 'bg-yellow-950/30 border-yellow-600/70 text-yellow-400' : 'bg-slate-900 border-slate-800 text-slate-600'
            }`}>
              <span className="text-base">🥇</span>
              <span className="font-arcade text-[8px]">30+</span>
            </div>

            <div className={`p-2 rounded border flex flex-col items-center gap-1 ${
              stats.medals.platinum ? 'bg-cyan-950/40 border-cyan-500/70 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-600'
            }`}>
              <span className="text-base">💎</span>
              <span className="font-arcade text-[8px]">40+</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              if (confirm('Reset high score and player statistics?')) {
                sounds.playClick();
                onResetStats();
              }
            }}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-ui rounded-lg border border-rose-800/60 transition cursor-pointer"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-arcade text-xs rounded-lg border border-slate-600 transition cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
