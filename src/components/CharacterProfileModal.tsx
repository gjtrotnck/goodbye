import React, { useState, useEffect } from "react";
import { CharacterInfo } from "../types";
import { BAEK_SEONG_HYUN } from "../data/characterData";
import { X, Lock, ShieldAlert, Sparkles, User, Heart, AlertCircle, Eye, Edit3, Save, RotateCcw, Check, Image as ImageIcon, Shirt, Tag, ThumbsUp, ThumbsDown } from "lucide-react";

interface CharacterProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: CharacterInfo;
  onSaveProfile?: (updated: CharacterInfo) => void;
}

export const CharacterProfileModal: React.FC<CharacterProfileModalProps> = ({
  isOpen,
  onClose,
  profile = BAEK_SEONG_HYUN,
  onSaveProfile,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "personality" | "secrets" | "edit">("overview");
  const [unlockedSecrets, setUnlockedSecrets] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Editable form state
  const [draft, setDraft] = useState<CharacterInfo>(profile);

  useEffect(() => {
    setDraft(profile);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleUnlockSecretsClick = () => {
    if (unlockedSecrets) {
      setActiveTab("secrets");
    } else {
      setShowWarningModal(true);
    }
  };

  const confirmUnlockSecrets = () => {
    setUnlockedSecrets(true);
    setShowWarningModal(false);
    setActiveTab("secrets");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveProfile) {
      onSaveProfile(draft);
    }
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
    setActiveTab("overview");
  };

  const handleResetToDefault = () => {
    if (window.confirm("인물 프로필을 원래 기본 설정값으로 복원하시겠습니까?")) {
      setDraft(BAEK_SEONG_HYUN);
      if (onSaveProfile) {
        onSaveProfile(BAEK_SEONG_HYUN);
      }
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in duration-200">
        {/* Header - Solid Purple Header without Gradient */}
        <div className="relative bg-purple-950 text-white p-6 border-b border-purple-900">
          {/* Profile Basic Summary Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 pr-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-900/80 border-2 border-purple-500/50 shadow-lg flex items-center justify-center text-purple-100 font-bold text-xl font-serif shrink-0 overflow-hidden">
                {profile.imageUrl ? (
                  <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover object-top" />
                ) : (
                  profile.name.charAt(0) || "백"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">{profile.name}</h2>
                <p className="text-xs text-purple-200 font-medium mt-0.5">
                  {profile.age}세 · {profile.gender} · {profile.job}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Toast Notification */}
          {showSavedToast && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 animate-bounce">
              <Check className="w-4 h-4" />
              <span>프로필 정보가 저장 및 반영되었습니다!</span>
            </div>
          )}

          {/* Navigation Tabs & Edit Toggle - Single Line Layout */}
          <div className="flex items-center justify-between gap-1.5 mt-5 pt-3 border-t border-white/10 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "overview"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>외형</span>
              </button>
              <button
                onClick={() => setActiveTab("personality")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "personality"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>성격 & 호불호</span>
              </button>
              <button
                onClick={handleUnlockSecretsClick}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "secrets"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "bg-rose-950/70 text-rose-200 border border-rose-800/60 hover:bg-rose-900/70"
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-rose-300" />
                <span>비밀 사항</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto bg-slate-50">
          {/* Tab 1: Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Character Portrait Image Slot Above Appearance */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center">
                <div className="w-full h-52 sm:h-64 rounded-xl bg-slate-900 border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center text-slate-400">
                  {profile.imageUrl ? (
                    <img
                      src={profile.imageUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 space-y-2 text-center">
                      <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shadow-inner">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">캐릭터 프로필 이미지</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">백성현의 외형 이미지를 등록할 수 있는 공간입니다.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Appearance Highlights */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-slate-600" />
                  <span>외형</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 block">키</span>
                    <span className="text-xs font-medium text-slate-800">{profile.height}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 block">눈동자</span>
                    <span className="text-xs font-medium text-slate-800">{profile.appearance.eyeColor}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 block">헤어스타일</span>
                    <span className="text-xs font-medium text-slate-800">{profile.appearance.hair}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 block">특징</span>
                    <span className="text-xs font-medium text-slate-800">{profile.appearance.piercings.join(", ")}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 block">인상</span>
                    <span className="text-xs font-medium text-slate-800">{profile.appearance.impression}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 block">체격</span>
                    <span className="text-xs font-medium text-slate-800">{profile.bodyType}</span>
                  </div>
                </div>
              </div>

              {/* Outfit */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Shirt className="w-4 h-4 text-slate-600" />
                  <span>착용 의상</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.outfit.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Personality & Likes */}
          {activeTab === "personality" && (
            <div className="space-y-6">
              {/* Surface Personality */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-slate-500" />
                  <span>표면적 성격 키워드</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.surfacePersonality.map((trait, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold tracking-wide"
                    >
                      # {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Likes & Dislikes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200">
                  <h4 className="text-xs font-extrabold text-emerald-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <ThumbsUp className="w-4 h-4 text-emerald-600" />
                    <span>호</span>
                  </h4>
                  <ul className="space-y-1.5 text-sm text-emerald-900 font-semibold">
                    {profile.likes.map((like, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{like}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-200">
                  <h4 className="text-xs font-extrabold text-rose-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <ThumbsDown className="w-4 h-4 text-rose-600" />
                    <span>불호</span>
                  </h4>
                  <ul className="space-y-1.5 text-sm text-rose-900 font-semibold">
                    {profile.dislikes.map((dislike, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>{dislike}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Secrets (SEX & Past) */}
          {activeTab === "secrets" && unlockedSecrets && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* SEX Preferences - Monochromatic header icon */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="mb-4">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-slate-500" />
                    <span>SEX 성향 및 선호</span>
                  </h3>
                </div>

                <div className="mb-4">
                  <span className="text-[11px] text-slate-500 block mb-1.5 font-bold">포지션</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700">
                      {profile.secretSex.position}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-[11px] text-slate-500 block mb-1.5 font-bold">성향</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.secretSex.orientations.map((item, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 block mb-1.5 font-bold">선호 요소</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.secretSex.preferences.map((item, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Past Narrative Timeline UI - Monochromatic header icon */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>과거사</span>
                </h3>

                <div className="relative space-y-4">
                  {/* Vertical Timeline Track Line aligned precisely under the icon */}
                  <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-slate-200 -z-0" />

                  {/* 14살 Milestone */}
                  <div className="relative z-10 flex items-start gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-100 font-extrabold text-xs shrink-0 shadow-xs mt-0.5">
                      14살
                    </span>
                    <div className="flex-1 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 hover:bg-white hover:border-purple-200 transition-colors shadow-2xs">
                      <p className="text-xs text-slate-700 font-medium leading-relaxed text-justify break-keep whitespace-pre-wrap">
                        {profile.secretPast?.age14 || BAEK_SEONG_HYUN.secretPast.age14}
                      </p>
                    </div>
                  </div>

                  {/* 20살 Milestone */}
                  <div className="relative z-10 flex items-start gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-100 font-extrabold text-xs shrink-0 shadow-xs mt-0.5">
                      20살
                    </span>
                    <div className="flex-1 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 hover:bg-white hover:border-purple-200 transition-colors shadow-2xs">
                      <p className="text-xs text-slate-700 font-medium leading-relaxed text-justify break-keep whitespace-pre-wrap">
                        {profile.secretPast?.age20 || BAEK_SEONG_HYUN.secretPast.age20}
                      </p>
                    </div>
                  </div>

                  {/* 22살 Milestone */}
                  <div className="relative z-10 flex items-start gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-100 font-extrabold text-xs shrink-0 shadow-xs mt-0.5">
                      22살
                    </span>
                    <div className="flex-1 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 hover:bg-white hover:border-purple-200 transition-colors shadow-2xs">
                      <p className="text-xs text-slate-700 font-medium leading-relaxed text-justify break-keep whitespace-pre-wrap">
                        {profile.secretPast?.age22 || BAEK_SEONG_HYUN.secretPast.age22}
                      </p>
                    </div>
                  </div>

                  {/* 25살 Milestone */}
                  <div className="relative z-10 flex items-start gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-100 font-extrabold text-xs shrink-0 shadow-xs mt-0.5">
                      25살
                    </span>
                    <div className="flex-1 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 hover:bg-white hover:border-purple-200 transition-colors shadow-2xs">
                      <p className="text-xs text-slate-700 font-medium leading-relaxed text-justify break-keep whitespace-pre-wrap">
                        {profile.secretPast?.age25 || BAEK_SEONG_HYUN.secretPast.age25}
                      </p>
                    </div>
                  </div>

                  {/* 현재 Milestone */}
                  <div className="relative z-10 flex items-start gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-rose-900 text-rose-100 font-extrabold text-xs shrink-0 shadow-xs mt-0.5">
                      현재
                    </span>
                    <div className="flex-1 bg-rose-50/50 p-3.5 rounded-xl border border-rose-200/80 hover:bg-white hover:border-rose-300 transition-colors shadow-2xs">
                      <p className="text-xs text-slate-800 font-semibold leading-relaxed text-justify break-keep whitespace-pre-wrap">
                        {profile.secretPast?.current || BAEK_SEONG_HYUN.secretPast.current}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Edit Profile Form */}
          {activeTab === "edit" && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-black text-slate-900">캐릭터 프로필 정보 수정</h3>
                  <p className="text-xs text-slate-500">수정된 내용은 AI 캐릭터 대화 및 전체 시스템에 즉시 반영됩니다.</p>
                </div>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-bold border border-slate-200 transition cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>기본값 복원</span>
                </button>
              </div>

              {/* Profile Image URL Input */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                <label className="text-xs font-extrabold text-slate-800 block">
                  프로필 이미지 URL (선택 사항)
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/image.png"
                  value={draft.imageUrl || ""}
                  onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-500"
                />
              </div>

              {/* Basic Info Inputs */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">기본 신상 정보</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">이름</label>
                    <input
                      type="text"
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">나이</label>
                    <input
                      type="number"
                      value={draft.age}
                      onChange={(e) => setDraft({ ...draft, age: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">성별</label>
                    <input
                      type="text"
                      value={draft.gender}
                      onChange={(e) => setDraft({ ...draft, gender: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">직업</label>
                    <input
                      type="text"
                      value={draft.job}
                      onChange={(e) => setDraft({ ...draft, job: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">키</label>
                    <input
                      type="text"
                      value={draft.height}
                      onChange={(e) => setDraft({ ...draft, height: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">체격</label>
                    <input
                      type="text"
                      value={draft.bodyType}
                      onChange={(e) => setDraft({ ...draft, bodyType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Appearance Inputs */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">외형 & 의상</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">눈동자 색상</label>
                    <input
                      type="text"
                      value={draft.appearance.eyeColor}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          appearance: { ...draft.appearance, eyeColor: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">헤어 스타일</label>
                    <input
                      type="text"
                      value={draft.appearance.hair}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          appearance: { ...draft.appearance, hair: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">피어싱 (쉼표로 구분)</label>
                    <input
                      type="text"
                      value={draft.appearance.piercings.join(", ")}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          appearance: {
                            ...draft.appearance,
                            piercings: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">전체적 인상</label>
                    <input
                      type="text"
                      value={draft.appearance.impression}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          appearance: { ...draft.appearance, impression: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">착용 의상 (쉼표로 구분)</label>
                  <input
                    type="text"
                    value={draft.outfit.join(", ")}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        outfit: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Personality Inputs */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">성격 및 호/불호</h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">성격 키워드 (쉼표로 구분)</label>
                    <input
                      type="text"
                      value={draft.surfacePersonality.join(", ")}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          surfacePersonality: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-emerald-800 block mb-1">호 (쉼표 구분)</label>
                      <input
                        type="text"
                        value={draft.likes.join(", ")}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            likes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-rose-800 block mb-1">불호 (쉼표 구분)</label>
                      <input
                        type="text"
                        value={draft.dislikes.join(", ")}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            dislikes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-rose-50/50 border border-rose-200 text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Secret Past Narrative Edit */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span>과거사 줄바꿈 및 서술 수정</span>
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">14살 과거사</label>
                    <textarea
                      rows={2}
                      value={draft.secretPast.age14}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          secretPast: { ...draft.secretPast, age14: e.target.value },
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium leading-relaxed focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">20살 과거사</label>
                    <textarea
                      rows={2}
                      value={draft.secretPast.age20}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          secretPast: { ...draft.secretPast, age20: e.target.value },
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium leading-relaxed focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">22살 과거사</label>
                    <textarea
                      rows={2}
                      value={draft.secretPast.age22}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          secretPast: { ...draft.secretPast, age22: e.target.value },
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium leading-relaxed focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">25살 과거사</label>
                    <textarea
                      rows={2}
                      value={draft.secretPast.age25}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          secretPast: { ...draft.secretPast, age25: e.target.value },
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium leading-relaxed focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">현재 상태</label>
                    <textarea
                      rows={2}
                      value={draft.secretPast.current}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          secretPast: { ...draft.secretPast, current: e.target.value },
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium leading-relaxed focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className="flex-1 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>수정사항 저장 및 바로 반영</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Warning Confirmation Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">비밀 사항 열람 주의</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              백성현의 SEX 성향 및 과거사를 열람하시겠습니까?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowWarningModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={confirmUnlockSecrets}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition cursor-pointer"
              >
                열람 확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
