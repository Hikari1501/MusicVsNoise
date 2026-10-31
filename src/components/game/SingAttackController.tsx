/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { NoiseEntity } from '../../types/game';

interface SingAttackControllerProps {
  isListening: boolean;
  activeNoises: NoiseEntity[];
  lastTranscript: string;
  feedbackMessage: string | null;
  onToggleSing: () => void;
  onPreviewTargetAudio: (text: string) => void;
  onSimulatePronounce?: (targetText: string) => void;
}

export const SingAttackController: React.FC<SingAttackControllerProps> = ({
  isListening,
  activeNoises,
  lastTranscript,
  feedbackMessage,
  onToggleSing,
  onPreviewTargetAudio,
  onSimulatePronounce,
}) => {
  // Get unique visible pronunciation targets from the active noises on stage
  const visibleTargets = Array.from(
    new Map(activeNoises.map((n) => [n.promptItem.text, n.promptItem])).values()
  );

  return (
    <div className="w-full bg-slate-900/95 border-t border-slate-800 p-2.5 px-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xl backdrop-blur-md z-40 select-none">
      {/* Left: Active Targets on stage & Listen Audio Preview */}
      <div className="flex items-center gap-2 overflow-x-auto max-w-full md:max-w-[45%] py-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Targets on Stage:
        </span>
        {visibleTargets.length === 0 ? (
          <span className="text-xs text-slate-500 italic">Stage is clear of Noise</span>
        ) : (
          <div className="flex items-center gap-1.5 flex-nowrap overflow-x-auto pb-0.5">
            {visibleTargets.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/90 border border-slate-700 text-xs font-semibold text-slate-200 shrink-0 shadow-sm"
              >
                <span className="text-amber-300 font-bold">{item.text}</span>
                <button
                  onClick={() => onPreviewTargetAudio(item.text)}
                  className="p-1 hover:text-cyan-300 text-slate-400 transition-colors rounded"
                  title={`Listen to how "${item.text}" sounds`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                {/* Fallback instant test speak for testing without mic */}
                {onSimulatePronounce && (
                  <button
                    onClick={() => onSimulatePronounce(item.text)}
                    className="text-[9px] text-cyan-400/80 hover:text-cyan-300 ml-0.5 px-1 bg-cyan-950/60 rounded"
                    title="Practice or trigger with click"
                  >
                    Pronounce
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Center: Live Speech Feedback & Toast Alerts */}
      <div className="flex flex-col items-center justify-center text-center min-w-[200px] flex-1">
        {feedbackMessage ? (
          <div className="text-xs font-extrabold text-amber-300 bg-amber-950/70 border border-amber-500/50 px-3 py-1 rounded-full shadow-lg animate-bounce-subtle">
            {feedbackMessage}
          </div>
        ) : isListening ? (
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </span>
            <span className="text-xs text-rose-300 font-medium">
              Listening for pronunciation... {lastTranscript ? `"${lastTranscript}"` : ''}
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-400 font-medium">
            Press <strong className="text-amber-400">Sing</strong> to attack Noise on your lane!
          </span>
        )}
      </div>

      {/* Right: The Main "Sing" Button (Per user comment: "Keep only the word 'Sing'") */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSing}
          className={`flex items-center justify-center gap-2 px-6 py-2 rounded-xl font-black text-sm tracking-wide transition-all shadow-xl ${
            isListening
              ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.6)] ring-2 ring-rose-400'
              : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
          }`}
          title="Click to activate voice recording and sing to attack"
        >
          {isListening ? (
            <>
              <Mic className="w-5 h-5 animate-bounce" />
              <span>Sing</span>
            </>
          ) : (
            <>
              <MicOff className="w-5 h-5 opacity-70" />
              <span>Sing</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
