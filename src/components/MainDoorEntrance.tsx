import React, { useState } from "react";
import { audioSynth } from "../utils/audioSynth";
import { Sparkles } from "lucide-react";

interface MainDoorEntranceProps {
  onOpenDoor: () => void;
  onOpenProfile: () => void;
  onOpenLocation: () => void;
}

export const MainDoorEntrance: React.FC<MainDoorEntranceProps> = ({
  onOpenDoor,
  onOpenProfile,
  onOpenLocation,
}) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleDoorClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    audioSynth.playDoorOpenSound();
    setTimeout(() => {
      onOpenDoor();
    }, 1000);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50 flex flex-col items-center justify-between p-6 overflow-hidden select-none">
      {/* Subtle Backroom Ambient Light Patterns */}
      <div className="absolute inset-0 bg-radial from-white via-slate-100 to-slate-200 opacity-90 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-200/20 blur-3xl rounded-full pointer-events-none animate-pulse" />

      {/* Top Header Placeholder spacing */}
      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between pt-4 h-6">
      </header>

      {/* Center Door Visual Area */}
      <div className="relative z-10 flex flex-col items-center my-auto py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <span className="inline-block px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold tracking-wider mb-3 shadow-xs">
            백성현 X 당신
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-serif mt-1">
            새하얀 방
          </h1>
        </div>

        {/* The Pure White Door Component */}
        <div className="relative group cursor-pointer" onClick={handleDoorClick}>
          {/* Outer Ambient Glow */}
          <div className={`absolute -inset-4 rounded-3xl bg-purple-300/30 blur-xl transition-all duration-700 ${isOpening ? "scale-150 bg-white opacity-100" : "group-hover:bg-purple-400/40 opacity-70"}`} />

          {/* Door Frame */}
          <div className="relative w-64 h-96 sm:w-72 sm:h-[420px] rounded-2xl bg-gradient-to-b from-white via-slate-50 to-slate-100 border-4 border-slate-200 shadow-2xl flex flex-col justify-between p-4 transition-transform duration-500 group-hover:scale-[1.02] overflow-hidden">
            {/* White Room Door Panel Effect */}
            <div className="absolute inset-2 border-2 border-slate-200/80 rounded-xl pointer-events-none" />
            <div className="absolute inset-x-8 top-12 bottom-12 border border-slate-200/60 rounded-md pointer-events-none" />

            {/* Door Center Area */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            </div>

            {/* Door Handle placed at vertical middle */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-end">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-200 border border-slate-300 shadow-md group-hover:bg-purple-100 group-hover:border-purple-300 transition">
                <div className="w-3.5 h-3.5 rounded-full bg-slate-400 group-hover:bg-purple-600 transition" />
              </div>
            </div>

            {/* Opening Light Overlay */}
            {isOpening && (
              <div className="absolute inset-0 bg-white z-20 animate-ping opacity-90 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-purple-500 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Enter Button Prompt */}
        <button
          onClick={handleDoorClick}
          disabled={isOpening}
          className="mt-8 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-purple-900 text-white font-bold text-sm tracking-wide shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center cursor-pointer"
        >
          <span>{isOpening ? "방 진입 중..." : "방문 열고 입장하기"}</span>
        </button>
      </div>

      {/* Bottom Nav Links for Character Profile & Location Info */}
      <footer className="relative z-10 w-full max-w-xl flex flex-wrap items-center justify-center gap-3 pb-4">
        <button
          onClick={onOpenProfile}
          className="px-4 py-2 rounded-xl bg-white/90 border border-slate-200 text-slate-800 text-xs font-bold hover:bg-purple-50 hover:border-purple-300 hover:text-purple-900 transition shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span>인물 프로필 (백성현)</span>
        </button>
        <button
          onClick={onOpenLocation}
          className="px-4 py-2 rounded-xl bg-white/90 border border-slate-200 text-slate-800 text-xs font-bold hover:bg-purple-50 hover:border-purple-300 hover:text-purple-900 transition shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span>장소 설명 (새하얀 방)</span>
        </button>
      </footer>
    </div>
  );
};
