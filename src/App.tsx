/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FlappyGame } from './components/FlappyGame';
import { Gamepad2, Sparkles, Trophy, GitBranch, Keyboard, Smartphone } from 'lucide-react';

export default function App() {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-3 md:p-6 selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <header className="w-full max-w-4xl flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3 md:mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-sm">
            <Gamepad2 size={20} />
          </div>
          <div>
            <h1 className="font-arcade text-sm md:text-base text-amber-400 tracking-wide flex items-center gap-2">
              FLAPPY BIRD
              <span className="font-ui text-xs text-slate-400 font-normal">ARCADE EDITION</span>
            </h1>
            <p className="text-xs text-slate-400 font-ui hidden sm:block">
              Faithful retro physics, procedural audio synthesis & customizable birds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHowToPlay(!showHowToPlay)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-ui text-slate-300 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Keyboard size={14} className="text-amber-400" />
            <span>Controls</span>
          </button>
        </div>
      </header>

      {/* Main Game Showcase Center */}
      <main className="w-full flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 max-w-5xl">
        {/* The Flappy Bird Game Arcade Unit */}
        <div className="flex justify-center items-center w-full max-w-[420px]">
          <FlappyGame />
        </div>

        {/* Side Panel: Arcade Info & Quick Guide */}
        <aside className="w-full max-w-[420px] lg:max-w-[340px] flex flex-col gap-4 font-ui">
          {/* Controls Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <span className="font-arcade text-xs text-amber-400 flex items-center gap-1.5">
                <Keyboard size={14} /> HOW TO PLAY
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Smartphone size={13} /> Mobile & Desktop
              </span>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center justify-between">
                <span>Flap / Jump Wings</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-amber-300 text-[11px] border border-slate-700">
                  Space / ↑ / Tap
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Pause / Resume</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300 text-[11px] border border-slate-700">
                  P
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Restart Game</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300 text-[11px] border border-slate-700">
                  R
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Toggle Sound</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300 text-[11px] border border-slate-700">
                  M
                </span>
              </li>
            </ul>
          </div>

          {/* Medals & Achievements */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <span className="font-arcade text-xs text-amber-400 flex items-center gap-1.5">
                <Trophy size={14} /> MEDAL TIERS
              </span>
              <span className="text-[11px] text-slate-400">Target Score</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                <span className="text-base">🥉</span>
                <div>
                  <div className="font-arcade text-[9px] text-amber-500">BRONZE</div>
                  <div className="text-[11px] text-slate-400">10+ Pipes</div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                <span className="text-base">🥈</span>
                <div>
                  <div className="font-arcade text-[9px] text-slate-300">SILVER</div>
                  <div className="text-[11px] text-slate-400">20+ Pipes</div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                <span className="text-base">🥇</span>
                <div>
                  <div className="font-arcade text-[9px] text-yellow-400">GOLD</div>
                  <div className="text-[11px] text-slate-400">30+ Pipes</div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                <span className="text-base">💎</span>
                <div>
                  <div className="font-arcade text-[9px] text-cyan-300">PLATINUM</div>
                  <div className="text-[11px] text-slate-400">40+ Pipes</div>
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Ready Notice */}
          <div className="bg-emerald-950/30 border border-emerald-800/60 rounded-xl p-3.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-medium mb-1">
              <GitBranch size={15} />
              <span>Git Repository Ready</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Codebase is fully built and tested. When you provide your GitHub username, repository name, or access token, we can push all commits directly!
            </p>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl pt-4 mt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-ui gap-2">
        <div className="flex items-center gap-2">
          <span>Flappy Bird Clone</span>
          <span>·</span>
          <span>HTML5 Canvas & Web Audio API</span>
          <span>·</span>
          <span>Zero External Assets</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Sparkles size={13} className="text-amber-400" />
          <span>Smooth 60 FPS Delta Physics</span>
        </div>
      </footer>
    </div>
  );
}
