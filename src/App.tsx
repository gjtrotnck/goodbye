/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MainDoorEntrance } from "./components/MainDoorEntrance";
import { CharacterProfileModal } from "./components/CharacterProfileModal";
import { LocationInfoModal } from "./components/LocationInfoModal";
import { EscapeConditionPaper } from "./components/EscapeConditionPaper";
import { RoomMaterializer } from "./components/RoomMaterializer";
import { ChatSimulator } from "./components/ChatSimulator";
import { DEFAULT_ESCAPE_CONDITIONS, BAEK_SEONG_HYUN, WHITE_ROOM_LOCATION } from "./data/characterData";
import { CharacterInfo, ChatMessage, EscapeCondition, MaterializedItem, LocationInfo } from "./types";
import { audioSynth } from "./utils/audioSynth";
import { DoorClosed, User, MapPin, Volume2, VolumeX, Sparkles, RefreshCw } from "lucide-react";

export default function App() {
  const [isInWhiteRoom, setIsInWhiteRoom] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(audioSynth.getIsMuted());

  // Character Profile State (Editable & Saved to localStorage)
  const [characterProfile, setCharacterProfile] = useState<CharacterInfo>(() => {
    try {
      localStorage.setItem("white_room_baek_seong_hyun_profile", JSON.stringify(BAEK_SEONG_HYUN));
    } catch (e) {
      console.error(e);
    }
    return BAEK_SEONG_HYUN;
  });

  const handleSaveProfile = (updated: CharacterInfo) => {
    const withLatestSecrets = {
      ...updated,
      secretPast: BAEK_SEONG_HYUN.secretPast,
      secretSex: BAEK_SEONG_HYUN.secretSex,
    };
    setCharacterProfile(withLatestSecrets);
    try {
      localStorage.setItem("white_room_baek_seong_hyun_profile", JSON.stringify(withLatestSecrets));
    } catch (e) {
      console.error(e);
    }
  };

  // Location Info State (Editable & Saved to localStorage)
  const [locationInfo, setLocationInfo] = useState<LocationInfo>(() => {
    try {
      const saved = localStorage.getItem("white_room_location_info");
      if (saved) {
        const parsed = JSON.parse(saved);
        const updated = {
          ...parsed,
          description: WHITE_ROOM_LOCATION.description,
          rules: WHITE_ROOM_LOCATION.rules,
          features: WHITE_ROOM_LOCATION.features,
        };
        localStorage.setItem("white_room_location_info", JSON.stringify(updated));
        return updated;
      }
    } catch (e) {
      console.error(e);
    }
    return WHITE_ROOM_LOCATION;
  });

  const handleSaveLocation = (updated: LocationInfo) => {
    setLocationInfo(updated);
    try {
      localStorage.setItem("white_room_location_info", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Escape conditions state
  const [conditions, setConditions] = useState<EscapeCondition[]>(() => {
    try {
      const saved = localStorage.getItem("white_room_escape_conditions");
      if (saved) {
        const parsed: EscapeCondition[] = JSON.parse(saved);
        const updatedConditions = DEFAULT_ESCAPE_CONDITIONS.map((defCond) => {
          const matched = parsed.find((p) => p.id === defCond.id);
          if (!matched) return defCond;
          return {
            ...matched,
            ruleTitle: defCond.ruleTitle,
            timeLimitDisplay: defCond.timeLimitDisplay,
            timeLimitMinutes: defCond.timeLimitMinutes,
            detailRule: defCond.detailRule,
            extraNote: defCond.extraNote,
            title: defCond.title,
            description: defCond.description,
          };
        });
        localStorage.setItem("white_room_escape_conditions", JSON.stringify(updatedConditions));
        return updatedConditions;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ESCAPE_CONDITIONS;
  });
  const [currentConditionIndex, setCurrentConditionIndex] = useState(0);

  const currentCondition = conditions[currentConditionIndex] || conditions[0];

  const handleGenerateRandomCondition = () => {
    // Pick randomly among all available escape conditions (0 to conditions.length - 1)
    const randomIndex = Math.floor(Math.random() * conditions.length);
    setCurrentConditionIndex(randomIndex);
  };

  const handleUpdateCondition = (updated: EscapeCondition) => {
    setConditions((prev) => {
      const newConditions = prev.map((c, idx) =>
        idx === currentConditionIndex ? updated : c
      );
      try {
        localStorage.setItem("white_room_escape_conditions", JSON.stringify(newConditions));
      } catch (e) {
        console.error(e);
      }
      return newConditions;
    });
  };

  // Handler: Toggle Clear Status
  const handleToggleClearCondition = () => {
    setConditions((prev) => {
      const updated = prev.map((c, idx) =>
        idx === currentConditionIndex ? { ...c, isCleared: !c.isCleared } : c
      );
      try {
        localStorage.setItem("white_room_escape_conditions", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };
  const [materializedItems, setMaterializedItems] = useState<MaterializedItem[]>([]);

  // Chat message history
  const INITIAL_MESSAGES: ChatMessage[] = [
    {
      id: "msg-1",
      role: "assistant",
      content:
        "백성현이 혀로 입술을 핥으며 느릿하게 고개를 돌렸다. 눈을 살짝 가린 앞머리 사이로 서늘한 기색의 보라색 눈동자가 당신을 바라봤다.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isSending, setIsSending] = useState(false);

  // Handler: Sound Toggle
  const handleToggleSound = () => {
    const active = audioSynth.toggleMute();
    setIsMuted(!active);
  };

  // Handler: Materialize or Toggle/Cancel Item in Room
  // 1st click: Add item (소환)
  // 2nd click: Remove item (취소)
  const handleMaterializeItem = (
    name: string,
    category: "comfort" | "vice" | "restraint" | "mystery"
  ) => {
    const exists = materializedItems.some((i) => i.name === name);

    if (exists) {
      // 2nd click -> Cancel / Remove item
      const filtered = materializedItems.filter((i) => i.name !== name);
      setMaterializedItems(filtered);
    } else {
      // 1st click -> Materialize item
      const newItem: MaterializedItem = {
        id: `item-${Date.now()}`,
        name,
        iconName: "package",
        category,
        description: `${name} 이(가) 새하얀 방 안에 정갈하게 소환되었습니다.`,
        materializedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const updated = [...materializedItems, newItem];
      setMaterializedItems(updated);

      // Notify Baek Seong-hyun via AI Chat
      const userNotice = `[방 안에서 물품 소환]: 방 중앙에 '${name}' 이(가) 새로 나타났다.`;
      handleSendMessage(userNotice);
    }
  };

  // Handler: Send Message to Gemini AI 백성현
  const handleSendMessage = async (userText: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsSending(true);

    try {
      const itemNames = materializedItems.map((i) => i.name);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          currentCondition: `${currentCondition.title}: ${currentCondition.description}`,
          materializedItems: itemNames,
          characterProfile,
        }),
      });

      const data = await res.json();
      const replyText =
        data.reply ||
        "백성현이 보라색 눈동자로 당신을 가만히 응시하더니 혀 피어싱을 사각거렸다.\n\n\"...네 맘대로 해봐. 어디 한번 빠져나가 보던가.\"";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Error:", err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: "assistant",
        content:
          "백성현이 후드집업 주머니에 손을 깊숙이 찔러넣으며 무심하게 지켜본다.\n\n\"...지랄맞은 방이네 진짜. 조금 천천히 말해봐.\"",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  // Handler: Reset Chat
  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* Landing Main Door Entrance Screen */}
      {!isInWhiteRoom ? (
        <MainDoorEntrance
          onOpenDoor={() => {
            setIsInWhiteRoom(true);
            audioSynth.startAmbientDrone();
          }}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenLocation={() => setIsLocationOpen(true)}
        />
      ) : (
        /* White Room Interactive Chamber View */
        <div className="relative min-h-screen flex flex-col bg-slate-50">
          {/* Header Bar */}
          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping" />
              <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight font-serif">
                새하얀 방
              </h1>
            </div>

            {/* Top Action Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden sm:inline">인물 프로필</span>
              </button>

              <button
                onClick={() => setIsLocationOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">장소 설명</span>
              </button>
            </div>
          </header>

          {/* Main Dashboard Grid */}
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (Condition Paper & Room Materializer) */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-start">
              {/* Escape Condition Paper */}
              <EscapeConditionPaper
                condition={currentCondition}
                onGenerateRandomCondition={handleGenerateRandomCondition}
                onToggleClearCondition={handleToggleClearCondition}
                onUpdateCondition={handleUpdateCondition}
              />

              {/* Room Materializer */}
              <RoomMaterializer
                items={materializedItems}
                onMaterializeItem={handleMaterializeItem}
              />
            </div>

            {/* Right Column (AI Baek Seong-hyun Roleplay Simulator) */}
            <div className="lg:col-span-7 flex flex-col">
              <ChatSimulator
                currentCondition={currentCondition}
                materializedItems={materializedItems.map((i) => i.name)}
                initialMessages={INITIAL_MESSAGES}
                onSendMessage={handleSendMessage}
                isSending={isSending}
                messages={messages}
                onResetChat={handleResetChat}
              />
            </div>
          </main>
        </div>
      )}

      {/* Modals */}
      <CharacterProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={characterProfile}
        onSaveProfile={handleSaveProfile}
      />

      <LocationInfoModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        locationInfo={locationInfo}
        onSaveLocation={handleSaveLocation}
      />
    </div>
  );
}
