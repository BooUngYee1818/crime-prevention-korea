export type Style = "drama" | "variety" | "humor" | "adult" | "gangster" | "tsundere";
export type MoodReaction = "match" | "comfort" | "ignore";

export interface Character {
  id: string;
  name: string;
  photo: string | null;
  style: Style[];
  moodReaction: MoodReaction;
  description: string;
  createdAt: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  mood?: string;
  isEmoji?: boolean;
  emojiUrl?: string;
  timestamp: number;
}

export interface ChatRoom {
  characterId: string;
  messages: Message[];
  lastUpdated: number;
}

export interface UserState {
  trialStartedAt: number | null;
  isPremium: boolean;
  premiumExpiresAt: number | null;
  coins: number;
  ownedEmojis: string[];
}

export const STYLE_LABELS: Record<Style, string> = {
  drama: "드라마",
  variety: "예능",
  humor: "유머",
  adult: "19금",
  gangster: "조폭",
  tsundere: "츤데레",
};

export const STYLE_COLORS: Record<Style, { bg: string; text: string }> = {
  drama: { bg: "#3C3489", text: "#EEEDFE" },
  variety: { bg: "#854F0B", text: "#FAEEDA" },
  humor: { bg: "#3B6D11", text: "#EAF3DE" },
  adult: { bg: "#993C1D", text: "#FAECE7" },
  gangster: { bg: "#444441", text: "#F1EFE8" },
  tsundere: { bg: "#993556", text: "#FBEAF0" },
};
