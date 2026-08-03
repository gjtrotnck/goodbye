import React from "react";
import { WHITE_ROOM_LOCATION } from "../data/characterData";
import { LocationInfo } from "../types";
import { X, MapPin, Sparkles, AlertTriangle, ShieldCheck, Sofa } from "lucide-react";

interface LocationInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationInfo?: LocationInfo;
}

export const LocationInfoModal: React.FC<LocationInfoModalProps> = ({
  isOpen,
  onClose,
  locationInfo = WHITE_ROOM_LOCATION,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="relative bg-slate-900 text-white p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 pr-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-slate-200 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">{locationInfo.name}</h2>
              {locationInfo.subtitle && locationInfo.subtitle !== locationInfo.name && (
                <p className="text-xs text-slate-300 mt-0.5">{locationInfo.subtitle}</p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6 bg-slate-50">
          {/* Spatial Overview */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-slate-600" />
              <span>공간적 특징</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {locationInfo.description.map((desc, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-600 mt-1 flex-shrink-0" />
                  <span className="text-justify break-keep whitespace-pre-wrap">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Absolute Laws of the White Room */}
          <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200">
            <h3 className="text-xs font-black text-amber-900 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>절대 규칙</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {locationInfo.rules.map((rule, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-100/70 border border-amber-200 text-xs font-semibold text-amber-950 flex items-start">
                  <span className="text-justify break-keep whitespace-pre-wrap">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Environment Elements */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Sofa className="w-4 h-4 text-slate-600" />
              <span>구조</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {locationInfo.features.map((feat, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-600 mt-1 flex-shrink-0" />
                  <span className="text-justify break-keep whitespace-pre-wrap">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
