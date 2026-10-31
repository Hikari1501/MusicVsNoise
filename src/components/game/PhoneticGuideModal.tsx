/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Volume2, Sparkles, BookOpen } from 'lucide-react';
import { LevelConfig } from '../../types/game';

interface PhoneticGuideModalProps {
  level: LevelConfig;
  isOpen: boolean;
  onClose: () => void;
  onPlayAudio: (text: string) => void;
}

export const PhoneticGuideModal: React.FC<PhoneticGuideModalProps> = ({
  level,
  isOpen,
  onClose,
  onPlayAudio,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              {level.title} — Pronunciation Guide
            </h2>
            <span className="text-xs text-cyan-400 font-semibold tracking-wide">
              Target Sound: {level.targetFeature}
            </span>
          </div>
        </div>

        {/* Mouth Positioning Advice */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-amber-300">
              Mouth & Tongue Positioning Tip
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {level.guide.mouthTip}
          </p>
        </div>

        {/* Examples Practice Audio List */}
        <div>
          <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2.5">
            Key Practice Targets (Click to Listen & Model)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {level.items.map((item) => (
              <div
                key={item.id}
                onClick={() => onPlayAudio(item.text)}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700 hover:border-cyan-500/60 hover:bg-cyan-950/20 cursor-pointer transition-all group"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-100 group-hover:text-cyan-300">
                    {item.text}
                  </span>
                  {item.ipa && (
                    <span className="text-[11px] font-mono text-cyan-400/80">
                      {item.ipa}
                    </span>
                  )}
                  {item.stressGuide && (
                    <span className="text-[10px] text-amber-400 font-semibold">
                      {item.stressGuide}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="p-1.5 rounded-md bg-slate-700 group-hover:bg-cyan-500/30 text-slate-300 group-hover:text-cyan-300 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Close CTA */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-colors shadow-lg"
          >
            Ready to Rock the Stage
          </button>
        </div>
      </div>
    </div>
  );
};
