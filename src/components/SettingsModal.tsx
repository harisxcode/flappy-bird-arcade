import React from 'react';
import { GameDifficulty, GameTheme } from '../types/game';
import { DIFFICULTY_SETTINGS } from '../utils/constants';
import { sounds } from '../utils/audio';
import { Volume2, VolumeX, X, Sliders, Sun, Sunset, Moon } from 'lucide-react';

interface SettingsModalProps {
  isMuted: boolean;
  onToggleMute: () => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  difficulty: GameDifficulty;
  onChangeDifficulty: (diff: GameDifficulty) => void;
  theme: GameTheme;
  onChangeTheme: (theme: GameTheme) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isMuted,
  onToggleMute,
  volume,
  onChangeVolume,
  difficulty,
  onChangeDifficulty,
  theme,
  onChangeTheme,
  onClose,
}) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-[340px] bg-slate-900 border-2 border-slate-700 rounded-xl p-5 shadow-2xl flex flex-col text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-amber-400" />
            <h3 className="font-arcade text-sm text-amber-400">SETTINGS</h3>
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

        <div className="flex flex-col gap-4">
          {/* Audio Controls */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-ui text-slate-300 font-medium">Sound Effects</span>
              <button
                onClick={() => {
                  onToggleMute();
                  sounds.playClick();
                }}
                className={`p-1.5 rounded flex items-center gap-1.5 text-xs font-ui transition cursor-pointer ${
                  isMuted ? 'bg-rose-950/60 text-rose-300 border border-rose-800' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                }`}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span>{isMuted ? 'Muted' : 'Sound ON'}</span>
              </button>
            </div>
            {!isMuted && (
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChangeVolume(val);
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />
            )}
          </div>

          {/* Difficulty Segmented Control */}
          <div>
            <span className="text-xs font-ui text-slate-300 font-medium block mb-2">
              Difficulty Mode
            </span>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
              {(['casual', 'classic', 'hardcore'] as GameDifficulty[]).map((mode) => {
                const active = difficulty === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => {
                      sounds.playClick();
                      onChangeDifficulty(mode);
                    }}
                    className={`py-1.5 px-2 text-[10px] font-arcade rounded transition cursor-pointer ${
                      active
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode === 'casual' ? 'CASUAL' : mode === 'classic' ? 'CLASSIC' : 'STORM'}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 font-ui mt-1.5 leading-tight">
              {DIFFICULTY_SETTINGS[difficulty].description}
            </p>
          </div>

          {/* Environment Theme Control */}
          <div>
            <span className="text-xs font-ui text-slate-300 font-medium block mb-2">
              Sky Environment
            </span>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
              <button
                onClick={() => {
                  sounds.playClick();
                  onChangeTheme('day');
                }}
                className={`py-1.5 px-2 flex items-center justify-center gap-1.5 text-xs font-ui rounded transition cursor-pointer ${
                  theme === 'day'
                    ? 'bg-sky-500 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sun size={13} /> Day
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  onChangeTheme('sunset');
                }}
                className={`py-1.5 px-2 flex items-center justify-center gap-1.5 text-xs font-ui rounded transition cursor-pointer ${
                  theme === 'sunset'
                    ? 'bg-amber-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sunset size={13} /> Sunset
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  onChangeTheme('night');
                }}
                className={`py-1.5 px-2 flex items-center justify-center gap-1.5 text-xs font-ui rounded transition cursor-pointer ${
                  theme === 'night'
                    ? 'bg-indigo-900 text-indigo-100 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Moon size={13} /> Night
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-arcade text-xs rounded-lg border border-slate-600 transition cursor-pointer"
        >
          DONE
        </button>
      </div>
    </div>
  );
};
