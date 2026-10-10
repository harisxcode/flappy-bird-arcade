import React from 'react';
import { BirdSkin } from '../types/game';
import { BIRD_PALETTES } from '../utils/constants';
import { sounds } from '../utils/audio';
import { X } from 'lucide-react';

interface SkinsModalProps {
  currentSkin: BirdSkin;
  onSelectSkin: (skin: BirdSkin) => void;
  onClose: () => void;
}

const SKIN_DESCRIPTIONS: Record<BirdSkin, { title: string; subtitle: string }> = {
  sunny: { title: 'Sunny', subtitle: 'The original golden classic' },
  ruby: { title: 'Ruby', subtitle: 'Fiery cardinal of speed' },
  azure: { title: 'Azure', subtitle: 'Smooth sky-glider' },
  volt: { title: 'Volt', subtitle: 'Cyber emerald speedster' },
  phoenix: { title: 'Phoenix', subtitle: 'Legendary golden firebird' },
};

export const SkinsModal: React.FC<SkinsModalProps> = ({
  currentSkin,
  onSelectSkin,
  onClose,
}) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-[340px] bg-slate-900 border-2 border-slate-700 rounded-xl p-5 shadow-2xl flex flex-col text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="font-arcade text-sm text-amber-400">SELECT BIRD</h3>
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

        <div className="flex flex-col gap-2.5 max-h-[340px] overflow-y-auto pr-1">
          {(Object.keys(BIRD_PALETTES) as BirdSkin[]).map((skinKey) => {
            const palette = BIRD_PALETTES[skinKey];
            const info = SKIN_DESCRIPTIONS[skinKey];
            const isSelected = currentSkin === skinKey;

            return (
              <button
                key={skinKey}
                onClick={() => {
                  sounds.playClick();
                  onSelectSkin(skinKey);
                }}
                className={`w-full flex items-center gap-3.5 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                    : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                {/* Bird Preview Icon */}
                <div
                  className="w-12 h-12 rounded-lg border-2 flex items-center justify-center relative shrink-0 shadow-inner"
                  style={{
                    backgroundColor: palette.body,
                    borderColor: palette.outline,
                  }}
                >
                  {/* Miniature bird face */}
                  <div
                    className="w-4 h-4 rounded-full bg-white border border-slate-900 absolute top-2 right-2 flex items-center justify-center"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-950 ml-0.5" />
                  </div>
                  <div
                    className="w-3.5 h-2.5 rounded-r-md absolute top-4 -right-1"
                    style={{ backgroundColor: palette.beak }}
                  />
                  <div
                    className="w-5 h-3.5 rounded-full absolute bottom-1.5 left-1.5 opacity-80"
                    style={{ backgroundColor: palette.wing }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-arcade text-xs text-white">
                      {info.title}
                    </span>
                    {isSelected && (
                      <span className="text-[9px] font-arcade text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                        EQUIPPED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-ui truncate mt-0.5">
                    {info.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="mt-4 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-arcade text-xs rounded-lg border border-slate-600 transition cursor-pointer"
        >
          CONFIRM
        </button>
      </div>
    </div>
  );
};
