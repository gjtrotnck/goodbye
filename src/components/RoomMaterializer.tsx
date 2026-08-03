import React, { useState } from "react";
import { MaterializedItem } from "../types";
import { audioSynth } from "../utils/audioSynth";
import { Sparkles, Plus, Beer, Flame, Bed, Lock, Package, Check, Wine, Sofa } from "lucide-react";

interface RoomMaterializerProps {
  items: MaterializedItem[];
  onMaterializeItem: (itemName: string, category: "comfort" | "vice" | "restraint" | "mystery") => void;
}

export const RoomMaterializer: React.FC<RoomMaterializerProps> = ({
  items,
  onMaterializeItem,
}) => {
  const [customInput, setCustomInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"comfort" | "vice" | "restraint" | "mystery">("vice");

  const presetItems = [
    { name: "캔맥주", category: "vice", icon: Beer },
    { name: "담배와 라이터", category: "vice", icon: Flame },
    { name: "가죽 소파", category: "comfort", icon: Sofa },
    { name: "콘돔", category: "restraint", icon: Lock },
    { name: "위스키 잔", category: "vice", icon: Wine },
    { name: "더블 침대", category: "comfort", icon: Bed },
  ];

  const handlePresetClick = (name: string, category: any) => {
    audioSynth.playMaterializeSound();
    onMaterializeItem(name, category);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    audioSynth.playMaterializeSound();
    onMaterializeItem(customInput.trim(), selectedCategory);
    setCustomInput("");
  };

  return (
    <div className="w-full rounded-3xl bg-white border border-slate-200 p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span className="text-sm sm:text-base font-black tracking-wider text-slate-800 uppercase whitespace-nowrap">
            소환 시스템
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed font-medium">
        새하얀 방은 당신과 백성현이 원하는 것을 뭐든 들어줍니다.<br />
        단, 그것이 탈출과 관련된다면 불가능합니다.
      </p>

      {/* Preset Quick Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {presetItems.map((preset, idx) => {
          const Icon = preset.icon;
          const isAlreadyInRoom = items.some((i) => i.name === preset.name);

          return (
            <button
              key={idx}
              onClick={() => handlePresetClick(preset.name, preset.category)}
              className={`p-3 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer group ${
                isAlreadyInRoom
                  ? "bg-purple-50 border-purple-200 text-purple-900 font-bold"
                  : "bg-slate-50 border-slate-200 hover:bg-purple-50/50 hover:border-purple-300 text-slate-800 font-bold"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Icon className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="text-xs font-bold truncate">{preset.name}</span>
              </div>
              {isAlreadyInRoom && <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 ml-1" />}
            </button>
          );
        })}
      </div>

      {/* Custom Materialization Input */}
      <form onSubmit={handleCustomSubmit} className="pt-2 flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="소환하고 싶은 물품을 입력하세요."
          className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-purple-900 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="whitespace-nowrap">소환하기</span>
        </button>
      </form>

      {/* Active Materialized Items List */}
      {items.length > 0 && (
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block">
              방 안의 소환물 목록 ({items.length})
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              * 한번 더 누르면 취소됩니다.
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onMaterializeItem(item.name, item.category)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-100 hover:bg-rose-100 hover:text-rose-900 text-purple-900 text-xs font-bold border border-purple-200 hover:border-rose-300 transition cursor-pointer group"
                title="클릭하여 소환 취소"
              >
                <Package className="w-3.5 h-3.5 text-purple-600 group-hover:text-rose-600" />
                <span>{item.name}</span>
                <span className="text-[10px] ml-0.5 text-purple-500 group-hover:text-rose-600">✕</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
