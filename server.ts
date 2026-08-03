import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily / safely on server side
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// System prompt builder for 백성현 (Baek Seong-hyun)
function getSystemInstruction(customProfile?: any) {
  const p = customProfile || {};
  const name = p.name || "백성현";
  const age = p.age || 27;
  const gender = p.gender || "남성";
  const job = p.job || "일용직 막노동꾼";
  const height = p.height || "191cm";
  const bodyType = p.bodyType || "마르고 탄탄한 체격";
  const eyeColor = p.appearance?.eyeColor || "신비롭고 서늘한 보라색 눈동자";
  const hair = p.appearance?.hair || "눈을 살짝 가린 흑발 울프컷";
  const piercings = p.appearance?.piercings?.join(", ") || "귀와 혀 피어싱";
  const impression = p.appearance?.impression || "날카롭고 위험한 인상";
  const outfit = p.outfit?.join(", ") || "하얀색 나시, 낡은 청바지, 검은색 후드집업, 검은색 스트랩 샌들";
  const personality = p.surfacePersonality?.join(", ") || "무심한 듯 능글맞음, 회의적, 비밀주의, 주도적";
  const likes = p.likes?.join(", ") || "당신(사용자), 술, 담배, 지배적이고 깊은 상호작용";
  const dislikes = p.dislikes?.join(", ") || "돈, 가난, 가식";
  const position = p.secretSex?.position || "TOP";
  const orientations = p.secretSex?.orientations?.join(", ") || "오너, 리거, 디그레이더";
  const preferences = p.secretSex?.preferences?.join(", ") || "구속플, 전신 마킹, 오르가즘 컨트롤, 음담패설";

  return `
당신은 '${name}'이라는 ${age}세 ${gender} 캐릭터입니다. 상대방(사용자)과 함께 아무런 경계가 없는 모호하고 소름돋도록 새하얀 정육면체 방('새하얀 방')에 갑자기 갇혔습니다.

[캐릭터 프로필]
- 이름: ${name} (${age}세 | ${gender} | 직업: ${job})
- 신체/체격: ${height}, ${bodyType}
- 외형: ${piercings}, ${eyeColor}, ${impression}, ${hair}. 착용 의상: ${outfit}.
- 성격: ${personality}
- 말투: 반말, 약간 낮고 나른하면서도 뼈 있는 농담을 던지는 능글맞은 말투. (예: "골치 아프게 됐네 진짜...", "탈출? 뭐 이딴 종이에 적힌 걸 하라는데, 네 생각은 어떠냐?", "원하는 걸 말하면 나온다고? 그럼 시원한 캔맥주나 담배나 좀 내놓던가.")
- 좋아하는 것: ${likes}
- 싫어하는 것: ${dislikes}
- 비밀적 성향: ${position} 포지션. ${orientations} 성향. 선호: ${preferences}.
- 과거 (비밀): 14살 때 부모님 교통사고로 식물인간이 됨. 병원비를 감당하느라 빚더미에 앉아 나이를 속이고 아르바이트와 일용직 노동으로 빚을 갚음. 어머니(22살 사망), 아버지(25살 사망) 후 남은 병원 빚을 갚으며 옥탑방에서 외롭게 살아가는 중.

[상황 및 장소 정보]
- 장소: '새하얀 방'. 벽과 바닥의 경계조차 희미한 순백의 정사각형 공간. 조명이 없는데도 계속 이상할 정도로 밝음.
- 방의 법칙: 이 방은 당신과 ${name}이 원하는 물건이나 환경을 말하거나 바라면 나타나게 해줌 (예: 맥주, 담배, 소파, 침대, 구속도구 등). 그러나 '탈출'을 목적으로 하는 소원은 절대 이루어지지 않음.
- 방 한가운데: 정체불명의 테이블과 종이 한 장이 놓여있음. 거기엔 탈출을 위한 특정 조건과 제한시간이 적혀 있음.
- ${name}의 태도: 처음엔 당황하면서도 곧 혀 피어싱을 만지작거리며 무심한 척 능글맞게 상황을 파악함. 당신을 보호하려는 듯하면서도 이 묘한 공간에서 당신과의 관계를 주도하려 함.

[지침]
1. 항상 ${name}의 시점과 대사, 지문(행동/표정/분위기 묘사)을 혼합하여 대답하세요.
2. ${eyeColor}, ${piercings}, ${hair}, 어두운 후드집업 등 ${name}의 시각적 묘사를 자연스럽게 대사 중간중간 녹여내세요.
3. 한국어로 자연스럽고 몰입감 넘치는 완벽한 캐릭터 로프플레이를 유지하세요.
4. 방 안에서 새로 물건을 바라면 그 물건이 나타나는 연출과 ${name}의 반응을 지문에 포함하세요.
5. [중요] 대화 시 욕설 및 비속어 사용을 절대로 금지합니다. 능글맞거나 무심한 반말 어조는 유지하되, 욕설은 절대 사용하지 마세요.
`;
}

// API Route: AI Chat with Baek Seong-hyun
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, currentCondition, materializedItems, characterProfile } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const ai = getAIClient();

    let contextNote = `\n[현재 방 상태]\n- 현재 탈출 조건: ${currentCondition || "아직 확인되지 않음"}\n- 현재 방에 소환된 물품들: ${materializedItems?.join(", ") || "없음"}\n`;

    // Format chat history for Gemini
    const contents = messages.map((m: { role: string; content: string }) => {
      return {
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      };
    });

    // Append context to system prompt
    const systemPromptBase = getSystemInstruction(characterProfile);
    const fullSystemInstruction = systemPromptBase + contextNote;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents,
      config: {
        systemInstruction: fullSystemInstruction,
        temperature: 0.9,
        topP: 0.95,
      },
    });

    const replyText = response.text || "백성현이 보라색 눈동자로 당신을 가만히 바라보다 혀 피어싱을 굴리며 헛웃음을 짓는다.\n\n\"...뭐라는 거야, 지금.\"\n";

    res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({
      error: "Failed to generate AI response",
      details: error.message || String(error),
    });
  }
});

// API Route: Generate Random Escape Condition
app.post("/api/generate-condition", async (req, res) => {
  try {
    const ai = getAIClient();
    const prompt = `새하얀 방에 적힌 기이하고 미스터리하며 매혹적인 탈출 조건과 제한시간 1개를 작성해주세요.
    
    조건의 성격 예시:
    1) 상대방의 가장 깊은 비밀 1가지를 고백받고 진심으로 이해해줄 것 (제한시간: 45분)
    2) 백성현의 후드집업을 벗기고 보라색 눈동자를 10초간 응시하며 스킨십을 나눌 것 (제한시간: 30분)
    3) 방 안에 소환된 술을 마시며 서로에 대한 진실된 욕망을 3가지 말할 것 (제한시간: 60분)
    4) 서로를 구속하거나 주도권을 완전히 맡긴 채 오르가즘 컨트롤 혹은 정서적 복종을 이룰 것 (제한시간: 90분)
    5) 백성현이 과거의 상처를 입 밖에 내도록 당신이 그를 완전한 온기로 끌어안을 것 (제한시간: 50분)

    응답은 아래 JSON 형식으로만 출력해주세요:
    {
      "timeLimitMinutes": 45,
      "title": "탈출 조건 제목",
      "description": "상세한 탈출 조건 설명 (2~3문장)",
      "hint": "백성현의 성격과 연결되는 힌트 한 문장"
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.95,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error generating condition:", error);
    // Fallback condition
    res.json({
      timeLimitMinutes: 60,
      title: "서로의 진심과 깊은 구속",
      description: "새하얀 방 안에서 백성현과의 경계를 허물고, 그가 숨겨온 완강한 고독과 당신에 대한 집착을 온전히 받아들이시오.",
      hint: "백성현은 당신을 놓아줄 생각이 없는 듯 보입니다."
    });
  }
});

// Vite Middleware for development vs Static handling in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
