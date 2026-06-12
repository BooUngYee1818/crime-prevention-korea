"use client";
import { Character, ChatRoom, UserState, Message } from "./types";

const KEYS = {
  characters: "ai_chat_characters",
  rooms: "ai_chat_rooms",
  user: "ai_chat_user",
};

const defaultUser: UserState = {
  trialStartedAt: null,
  isPremium: false,
  premiumExpiresAt: null,
  coins: 100,
  ownedEmojis: [],
};

export function getCharacters(): Character[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEYS.characters) || "[]");
  } catch {
    return [];
  }
}

export function saveCharacter(char: Character) {
  const list = getCharacters();
  const idx = list.findIndex((c) => c.id === char.id);
  if (idx >= 0) list[idx] = char;
  else list.unshift(char);
  localStorage.setItem(KEYS.characters, JSON.stringify(list));
}

export function deleteCharacter(id: string) {
  const list = getCharacters().filter((c) => c.id !== id);
  localStorage.setItem(KEYS.characters, JSON.stringify(list));
}

export function getChatRoom(characterId: string): ChatRoom {
  if (typeof window === "undefined") return { characterId, messages: [], lastUpdated: 0 };
  try {
    const all = JSON.parse(localStorage.getItem(KEYS.rooms) || "{}");
    return all[characterId] || { characterId, messages: [], lastUpdated: 0 };
  } catch {
    return { characterId, messages: [], lastUpdated: 0 };
  }
}

export function saveChatRoom(room: ChatRoom) {
  try {
    const all = JSON.parse(localStorage.getItem(KEYS.rooms) || "{}");
    all[room.characterId] = room;
    localStorage.setItem(KEYS.rooms, JSON.stringify(all));
  } catch {}
}

export function addMessage(characterId: string, msg: Message): ChatRoom {
  const room = getChatRoom(characterId);
  room.messages = [...room.messages, msg];
  room.lastUpdated = Date.now();
  saveChatRoom(room);
  return room;
}

export function getUser(): UserState {
  if (typeof window === "undefined") return defaultUser;
  try {
    return { ...defaultUser, ...JSON.parse(localStorage.getItem(KEYS.user) || "{}") };
  } catch {
    return defaultUser;
  }
}

export function saveUser(user: UserState) {
  localStorage.setItem(KEYS.user, JSON.stringify(user));
}

export function startTrial(): UserState {
  const user = getUser();
  if (!user.trialStartedAt) {
    user.trialStartedAt = Date.now();
    saveUser(user);
  }
  return user;
}

export function getTrialDaysLeft(): number {
  const user = getUser();
  if (!user.trialStartedAt) return 7;
  if (user.isPremium) return Infinity;
  const elapsed = Date.now() - user.trialStartedAt;
  const daysLeft = 7 - Math.floor(elapsed / (1000 * 60 * 60 * 24));
  return Math.max(0, daysLeft);
}

export function isAccessAllowed(): boolean {
  const user = getUser();
  if (user.isPremium) {
    if (!user.premiumExpiresAt) return true;
    return Date.now() < user.premiumExpiresAt;
  }
  return getTrialDaysLeft() > 0;
}
