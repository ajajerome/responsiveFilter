import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Level, Position } from '@/types/content';

type LevelProgress = {
  unlocked: boolean;
  xp: number;
  completedQuestionIds: string[];
};

type Profile = {
  name?: string;
  avatar: {
    gender?: 'kille' | 'tjej' | 'annat';
    hair?: string;
    shirtColor?: string;
  };
  favoritePosition?: Position;
};

type AppState = {
  profile: Profile;
  season: { number: number; xp: number };
  progress: Partial<Record<Level, LevelProgress>>;
  badges: string[];
  actions: {
    setName: (name: string) => void;
    setFavoritePosition: (pos: Position) => void;
    addXp: (level: Level, amount: number) => void;
    markQuestionCompleted: (level: Level, questionId: string) => void;
    unlockLevel: (level: Level) => void;
  };
};

const initialProgress: Partial<Record<Level, LevelProgress>> = {
  '5-manna': { unlocked: true, xp: 0, completedQuestionIds: [] },
  '7-manna': { unlocked: false, xp: 0, completedQuestionIds: [] },
  '9-manna': { unlocked: false, xp: 0, completedQuestionIds: [] },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: { avatar: {} },
      season: { number: 1, xp: 0 },
      progress: initialProgress,
      badges: [],
      actions: {
        setName: (name) => set((s) => ({ profile: { ...s.profile, name } })),
        setFavoritePosition: (pos) =>
          set((s) => ({ profile: { ...s.profile, favoritePosition: pos } })),
        addXp: (level, amount) =>
          set((s) => {
            const lv = s.progress[level] ?? { unlocked: level === '5-manna', xp: 0, completedQuestionIds: [] };
            const nextSeasonXp = Math.max(0, (s.season?.xp ?? 0) + amount);
            // Simple season rollover at 1000 XP
            const shouldLevelSeason = nextSeasonXp >= 1000;
            const season = shouldLevelSeason
              ? { number: (s.season?.number ?? 1) + 1, xp: nextSeasonXp - 1000 }
              : { number: s.season?.number ?? 1, xp: nextSeasonXp };
            return {
              progress: {
                ...s.progress,
                [level]: { ...lv, xp: Math.max(0, lv.xp + amount) },
              },
              season,
            };
          }),
        markQuestionCompleted: (level, questionId) =>
          set((s) => {
            const lv = s.progress[level] ?? { unlocked: level === '5-manna', xp: 0, completedQuestionIds: [] };
            if (lv.completedQuestionIds.includes(questionId)) return {} as any;
            return {
              progress: {
                ...s.progress,
                [level]: { ...lv, completedQuestionIds: [...lv.completedQuestionIds, questionId] },
              },
            };
          }),
        unlockLevel: (level) =>
          set((s) => {
            const lv = s.progress[level] ?? { unlocked: false, xp: 0, completedQuestionIds: [] };
            return { progress: { ...s.progress, [level]: { ...lv, unlocked: true } } };
          }),
      },
    }),
    {
      name: 'fotboll-app-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);

