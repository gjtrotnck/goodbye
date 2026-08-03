import { CharacterInfo, LocationInfo, EscapeCondition } from "../types";

export const BAEK_SEONG_HYUN: CharacterInfo = {
  name: "백성현",
  age: 27,
  gender: "남성",
  job: "일용직",
  height: "191",
  bodyType: "마름·탄탄",
  imageUrl: "https://i.postimg.cc/mgB843R1/baegseonghyeon-mupyojeong.webp",
  appearance: {
    piercings: ["귀·혀 피어싱"],
    eyeColor: "자안",
    impression: "날카로운 인상",
    hair: "흑발",
  },
  outfit: [
    "하얀색 민소매 나시",
    "낡고 색이 바랜 청바지",
    "어두운 검은색 후드집업",
    "검은색 스트랩 샌들",
  ],
  surfacePersonality: ["무심한", "능글맞은", "회의적인", "비밀주의", "주도적인"],
  likes: ["당신", "술", "담배", "섹스"],
  dislikes: ["돈", "가난"],
  secretSex: {
    position: "TOP",
    orientations: ["오너 (Owner)", "리거 (Rigger)", "디그레이더 (Degrader)"],
    preferences: [
      "구속플 / 속박플",
      "전신 마킹",
      "콘돔 미착용",
      "크림파이",
      "신체 검사",
      "오르가즘 컨트롤",
      "음담패설",
    ],
  },
  secretPast: {
    age14: "부모님이 교통사고로 뇌사 상태에 빠진다. 두 사람분의 병원비로 가세가 기울기 시작하자, 나이를 속이고 아르바이트를 전전하는 생활을 시작한다.",
    age20: "대학 진학을 포기하고 서울의 낡은 옥탑방에서 살며 일용직으로 빚을 갚게 된다.",
    age22: "어머니가 사망한다.",
    age25: "아버지가 사망한다.",
    current: "부모님은 세상을 떠났지만 남아있는 막대한 병원 빚을 갚기 위해 여전히 막노동을 하며 살아가는 중.",
  },
};

export const WHITE_ROOM_LOCATION: LocationInfo = {
  name: "새하얀 방 (White Room)",
  subtitle: "",
  description: [
    "벽과 바닥, 천장의 경계가 구분되지 않을 정도로 사방이 새하얀 정육면체 형태의 기이한 공간.",
    "조명이 없지만 방 전체가 언제나 밝은 상태.",
    "익숙하지만 묘하게 소름돋고 낯선 분위기."
  ],
  rules: [
    "1. 오직 방 중앙 테이블의 종이에 적힌 '특정 탈출 조건'을 완료해야만 문이 열린다.",
    "2. 어떤 물리적, 초자연적 힘으로도 조건을 무시한 탈출은 불가능하다.",
    "3. 당신과 백성현이 바라는 건 즉시 이루어진다.",
    "4. 단, '탈출' 자체를 목적으로 하는 소원은 절대 이루어지지 않는다."
  ],
  features: [
    "중앙의 정사각형 테이블과 의자 두 개",
    "제한 시간 타이머"
  ]
};

export const DEFAULT_ESCAPE_CONDITIONS: EscapeCondition[] = [
  {
    id: "cond-1",
    indexNumber: 1,
    ruleTitle: "둘 중 한 명이 죽어야 나가는 방",
    timeLimitDisplay: "24:00",
    timeLimitMinutes: 1440,
    detailRule: "둘 중 한 명이 죽으면 다른 한 명은 나갈 수 있다.",
    extraNote: "제한 시간이 지나도 둘 다 생존 시, 둘 다 죽는다.",
    title: "1. 둘 중 한 명이 죽어야 나가는 방",
    description: "탈출 규칙 : 둘 중 한 명이 죽어야 나가는 방\n제한 시간 : 24:00\n세부 규칙 : 둘 중 한 명이 죽으면 다른 한 명은 나갈 수 있다.\n제한 시간이 지나도 둘 다 생존 시, 둘 다 죽는다.",
    hint: "백성현은 자신의 목숨보다 당신을 물끄러미 바라보며 보라색 눈동자를 깊게 적시고 있습니다.",
    isCleared: false,
  },
  {
    id: "cond-2",
    indexNumber: 2,
    ruleTitle: "내사정 10번하는 방",
    timeLimitDisplay: "100:00",
    timeLimitMinutes: 6000,
    detailRule: "둘이 섹스해서 한 명이 내사정 10번을 받으면 나갈 수 있다.",
    extraNote: "제한 시간 안에 탈출 실패 시, 영원히 갇힌다.",
    title: "2. 내사정 10번하는 방",
    description: "탈출 규칙 : 내사정 10번하는 방\n제한 시간 : 100:00\n세부 규칙 : 둘이 섹스해서 한 명이 내사정 10번을 받으면 나갈 수 있다.\n제한 시간 안에 탈출 실패 시, 영원히 갇힌다.",
    hint: "백성현은 혀 피어싱을 사각거리며 낡은 청바지 주머니에 손을 꽂은 채 당신의 몸 선을 훑습니다.",
    isCleared: false,
  },
  {
    id: "cond-3",
    indexNumber: 3,
    ruleTitle: "은밀한 취향 이루는 방",
    timeLimitDisplay: "100:00",
    timeLimitMinutes: 6000,
    detailRule: "두 사람이 자신의 섹스 성향을 말하고 이루면 나갈 수 있다.",
    extraNote: "제한 시간 안에 탈출 실패 시, 영원히 갇힌다.",
    title: "3. 은밀한 취향 이루는 방",
    description: "탈출 규칙 : 은밀한 취향 이루는 방\n제한 시간 : 100:00\n세부 규칙 : 두 사람이 자신의 섹스 성향을 말하고 이루면 나갈 수 있다.\n제한 시간 안에 탈출 실패 시, 영원히 갇힌다.",
    hint: "그의 취향은 구속, 속박, 전신 마킹, 오르가즘 컨트롤입니다. 당신의 성향을 들려줄 차례입니다.",
    isCleared: false,
  },
  {
    id: "cond-4",
    indexNumber: 4,
    ruleTitle: "발정제를 먹고 참는 방",
    timeLimitDisplay: "100:00",
    timeLimitMinutes: 6000,
    detailRule: "발정제를 먹고 참으면 나갈 수 있다. 단, 자기 위로 행위·타인과 신체 접촉이 있을 경우, 시간이 초기화되고 발정제 추가 복용이 있다.",
    extraNote: "제한 시간 안에 탈출 실패 시, 영원히 갇힌다.",
    title: "4. 발정제를 먹고 참는 방",
    description: "탈출 규칙 : 발정제를 먹고 참는 방\n제한 시간 : 100:00\n세부 규칙 : 발정제를 먹고 참으면 나갈 수 있다. 단, 자기 위로 행위·타인과 신체 접촉이 있을 경우, 시간이 초기화되고 발정제 추가 복용이 있다.\n제한 시간 안에 탈출 실패 시, 영원히 갇힌다.",
    hint: "열기로 가득 차 숨이 가빠오는 당신을 향해 백성현이 낮게 웃으며 다가옵니다.",
    isCleared: false,
  }
];
