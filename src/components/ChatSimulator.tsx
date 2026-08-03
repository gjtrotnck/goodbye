import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, EscapeCondition } from "../types";
import { Send, Sparkles, RefreshCw, Copy, Check, MessageSquare, Flame, UserCheck, Eye } from "lucide-react";

interface ChatSimulatorProps {
  currentCondition: EscapeCondition;
  materializedItems: string[];
  initialMessages: ChatMessage[];
  onSendMessage: (userText: string) => Promise<void>;
  isSending: boolean;
  messages: ChatMessage[];
  onResetChat: () => void;
}

export const ChatSimulator: React.FC<ChatSimulatorProps> = ({
  currentCondition,
  materializedItems,
  isSending,
  messages,
  onSendMessage,
  onResetChat,
}) => {
  const [inputText, setInputText] = useState("");
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const presetActions = [
    "테이블 위에 종이가 있어. 탈출 조건이 적혀있는데 함께 보자.",
    "방 안에서 맥주랑 담배를 바라면 진짜 나올지 해볼까?",
    "천천히 백성현에게 접근해 그를 가만히 응시한다.",
    "그의 검은 후드집업 옷자락을 잡아당기며 시선을 맞춘다.",
    "혀 피어싱을 만지작거리는 그에게 밀착하여 대화한다."
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    const text = inputText.trim();
    setInputText("");
    onSendMessage(text);
  };

  const handlePresetClick = (presetText: string) => {
    if (isSending) return;
    onSendMessage(presetText);
  };

  const handleCopyChat = () => {
    const formatted = messages
      .map((m) => `${m.role === "user" ? "당신" : "백성현"}: ${m.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[680px]">
      {/* Header: Baek Seong-hyun Persona Badge */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-4 px-6 flex items-center justify-between border-b border-purple-900/50">
        <div className="flex items-center gap-3">
          {/* Baek Seong-hyun Avatar Image */}
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-purple-900/80 border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-inner overflow-hidden">
              <img
                src="https://i.postimg.cc/mgB843R1/baegseonghyeon-mupyojeong.webp"
                alt="백성현"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>
          <h2 className="text-base font-black tracking-tight text-white">백성현</h2>
        </div>

        {/* Action buttons: Reset & Copy */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyChat}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition text-xs flex items-center gap-1 cursor-pointer"
            title="대화 내용 복사"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={onResetChat}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition text-xs flex items-center gap-1 cursor-pointer"
            title="대화 초기화"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/70">
        {messages.map((msg) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"} animate-in fade-in duration-200`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {isUser ? "당신" : "백성현"}
                </span>
                <span className="text-[9px] text-slate-300">{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-xs ${
                  isUser
                    ? "bg-purple-900 text-white rounded-tr-none font-medium"
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-none font-sans text-justify break-keep"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-2 p-4 rounded-2xl bg-white border border-slate-200 max-w-[200px] text-slate-500 text-xs animate-pulse">
            <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
            <span>백성현이 반응하는 중...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="p-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
        {presetActions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => handlePresetClick(action)}
            disabled={isSending}
            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-purple-50 hover:border-purple-300 border border-slate-200 text-slate-700 hover:text-purple-900 text-xs font-medium transition cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input Box Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="백성현에게 대화나 행동을 입력하세요."
          disabled={isSending}
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-500 transition disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isSending || !inputText.trim()}
          className="px-6 py-3 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs flex items-center gap-2 transition shadow-md cursor-pointer disabled:opacity-50"
        >
          <span>전송</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Disclaimer Caption */}
      <div className="py-2.5 px-4 bg-slate-50 border-t border-slate-200 text-center">
        <p className="text-[11px] text-slate-400 font-medium leading-relaxed text-center">
          캐릭터 챗의 예시입니다.<br />
          실제 챗봇 성격 및 행동에 차이가 있을 수 있습니다.
        </p>
      </div>
    </div>
  );
};
