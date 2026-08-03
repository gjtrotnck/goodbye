export interface CharacterInfo {
  name: string;
  age: number;
  gender: string;
  job: string;
  height: string;
  bodyType: string;
  imageUrl?: string;
  appearance: {
    piercings: string[];
    eyeColor: string;
    impression: string;
    hair: string;
  };
  outfit: string[];
  surfacePersonality: string[];
  likes: string[];
  dislikes: string[];
  secretSex: {
    position: string;
    orientations: string[];
    preferences: string[];
  };
  secretPast: {
    age14: string;
    age20: string;
    age22: string;
    age25: string;
    current: string;
  };
}

export interface LocationInfo {
  name: string;
  subtitle: string;
  description: string[];
  rules: string[];
  features: string[];
}

export interface EscapeCondition {
  id: string;
  indexNumber: number;
  ruleTitle: string;
  timeLimitDisplay: string;
  timeLimitMinutes: number;
  detailRule: string;
  extraNote?: string;
  title: string;
  description: string;
  hint: string;
  isCleared: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  actionTag?: string;
}

export interface MaterializedItem {
  id: string;
  name: string;
  iconName: string;
  category: "comfort" | "vice" | "restraint" | "mystery";
  description: string;
  materializedAt: string;
}
