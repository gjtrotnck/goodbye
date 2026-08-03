import React, { useState, useEffect } from "react";
import { EscapeCondition } from "../types";
import { FileText, Clock, RefreshCw, CheckCircle2, Edit3, Save, X, Check } from "lucide-react";

interface EscapeConditionPaperProps {
  condition: EscapeCondition;
  onGenerateRandomCondition: () => void;
  onToggleClearCondition: () => void;
  onUpdateCondition?: (updated: EscapeCondition) => void;
}

export const EscapeConditionPaper: React.FC<EscapeConditionPaperProps> = ({
  condition,
  onGenerateRandomCondition,
  onToggleClearCondition,
  onUpdateCondition,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  // Edit form state
  const [editRuleTitle, setEditRuleTitle] = useState(condition.ruleTitle);
  const [editDetailRule, setEditDetailRule] = useState(condition.detailRule);
  const [editExtraNote, setEditExtraNote] = useState(condition.extraNote || "");
  const [editMinutes, setEditMinutes] = useState(condition.timeLimitMinutes);

  const parseInitialSeconds = (cond: EscapeCondition): number => {
    if (cond.timeLimitDisplay === "100:00") return 100 * 3600;
    if (cond.timeLimitDisplay === "24:00") return 24 * 3600;
    if (cond.timeLimitMinutes) return cond.timeLimitMinutes * 60;
    return 360000;
  };

  const [secondsLeft, setSecondsLeft] = useState(() => parseInitialSeconds(condition));

  useEffect(() => {
    setEditRuleTitle(condition.ruleTitle);
    setEditDetailRule(condition.detailRule);
    setEditExtraNote(condition.extraNote || "");
    setEditMinutes(condition.timeLimitMinutes);
    setSecondsLeft(parseInitialSeconds(condition));
  }, [condition]);

  useEffect(() => {
    if (condition.isCleared) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [condition.isCleared]);

  const formatTimeLeft = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hStr = hours.toString().padStart(2, "0");
    const mStr = minutes.toString().padStart(2, "0");
    const sStr = seconds.toString().padStart(2, "0");

    if (hours > 0) {
      return `${hStr}:${mStr}:${sStr}`;
    }
    return `${mStr}:${sStr}`;
  };

  const handleSave = () => {
    if (!onUpdateCondition) return;

    const formattedTimeDisplay = editMinutes >= 60 
      ? `${Math.floor(editMinutes / 60)}:${(editMinutes % 60).toString().padStart(2, "0")}`
      : `${editMinutes}:00`;

    const updatedCond: EscapeCondition = {
      ...condition,
      ruleTitle: editRuleTitle,
      detailRule: editDetailRule,
      extraNote: editExtraNote,
      timeLimitMinutes: editMinutes,
      timeLimitDisplay: formattedTimeDisplay,
      title: `${condition.indexNumber || 1}. ${editRuleTitle}`,
      description: `탈출 규칙 : ${editRuleTitle}\n제한 시간 : ${formattedTimeDisplay}\n세부 규칙 : ${editDetailRule}${editExtraNote ? `\n* ${editExtraNote}` : ""}`,
    };

    onUpdateCondition(updatedCond);
    setIsEditing(false);
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 2000);
  };

  const timeDisplayString = formatTimeLeft(secondsLeft);

  return (
    <div className="relative w-full rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xl overflow-hidden flex flex-col justify-between">
      {/* Background Subtle Texture Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/30 blur-2xl rounded-full pointer-events-none" />

      {/* Header with Title & Fixed Time Limit */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-5 h-5 text-purple-600 shrink-0" />
          <span className="text-sm sm:text-base font-black tracking-wider text-slate-800 uppercase whitespace-nowrap">
            탈출 조건
          </span>
          {showSaveAlert && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md animate-fade-in">
              <Check className="w-3 h-3" /> 저장됨
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono font-bold whitespace-nowrap ${
            condition.isCleared
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-slate-100 border-slate-200 text-slate-700"
          }`}>
            <Clock className={`w-3.5 h-3.5 shrink-0 ${condition.isCleared ? "text-emerald-600" : "text-purple-600"}`} />
            <span>{condition.isCleared ? "조건 달성 완수!" : `제한 시간: ${timeDisplayString}`}</span>
          </div>
        </div>
      </div>

      {/* Main Condition Body or Edit Form */}
      <div className="py-4 space-y-3">
        {isEditing ? (
          /* Editable Form */
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">탈출 규칙</label>
              <input
                type="text"
                value={editRuleTitle}
                onChange={(e) => setEditRuleTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl font-bold text-purple-900 focus:outline-none focus:border-purple-600"
                placeholder="탈출 규칙 입력"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">제한 시간 (분 단위)</label>
              <input
                type="number"
                value={editMinutes}
                onChange={(e) => setEditMinutes(Number(e.target.value) || 100)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl font-mono text-purple-900 font-bold focus:outline-none focus:border-purple-600"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">세부 규칙</label>
              <textarea
                value={editDetailRule}
                onChange={(e) => setEditDetailRule(e.target.value)}
                rows={2}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-purple-600"
                placeholder="세부 규칙 내용 입력"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">추가 경고 / 비고 (* 빨간 글씨)</label>
              <textarea
                value={editExtraNote}
                onChange={(e) => setEditExtraNote(e.target.value)}
                rows={2}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-rose-600 font-bold focus:outline-none focus:border-purple-600 leading-relaxed"
                placeholder="제한 시간 안에 탈출 실패 시, 방에 영구적으로 갇힌다."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-600 text-xs font-bold hover:bg-slate-100 transition cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> 취소
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold shadow-md transition cursor-pointer flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" /> 저장하기
              </button>
            </div>
          </div>
        ) : (
          /* Normal Display Mode */
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
            {/* Rule Title - Both Label and Text in Unified Purple and Sans font */}
            <div className="flex items-start gap-2 text-sm sm:text-base font-bold text-purple-900">
              <span className="text-purple-900 shrink-0 whitespace-nowrap">• 탈출 규칙 :</span>
              <span className="text-purple-900 font-extrabold">{condition.ruleTitle}</span>
            </div>

            {/* Time Limit - Fixed, Default text color */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
              <span className="text-slate-500 shrink-0 whitespace-nowrap">• 제한 시간 :</span>
              <span className="font-mono font-bold text-slate-800 whitespace-nowrap">
                {condition.timeLimitDisplay || "100:00"}
              </span>
            </div>

            {/* Detail Rule - Text Justified for clean alignment */}
            <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-800 font-medium">
              <span className="text-slate-500 shrink-0 whitespace-nowrap">• 세부 규칙 :</span>
              <span className="text-justify leading-relaxed flex-1 whitespace-pre-wrap">
                {condition.detailRule}
              </span>
            </div>

            {/* Extra Warning Note - Red text with line breaks */}
            {condition.extraNote && (
              <div className="mt-1 pt-2 border-t border-slate-200/60 text-xs font-bold text-rose-600 text-left leading-relaxed whitespace-pre-wrap break-keep">
                <span>{condition.extraNote}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2 flex-wrap">
        <button
          onClick={onGenerateRandomCondition}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap"
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
          <span>조건 생성</span>
        </button>

        <button
          onClick={onToggleClearCondition}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer whitespace-nowrap ${
            condition.isCleared
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-purple-900 hover:bg-purple-950 text-white"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{condition.isCleared ? "달성 취소하기" : "탈출 조건 완료 처리"}</span>
        </button>
      </div>
    </div>
  );
};

