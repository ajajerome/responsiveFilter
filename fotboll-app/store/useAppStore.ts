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
  avatar: {
    gender?: 'kille' | 'tjej' | 'annat';
    hair?: string;
    shirtColor?: string;
  };
  favoritePosition?: Position;
};

type AppState = {
  profile: Profile;
  progress: Partial<Record<Level, LevelProgress>>;
  badges: string[];
  actions: {
    setFavoritePosition: (pos: Position) => void;
    addXp: (level: Level, amount: number) => void;
    markQuestionCompleted: (level: Level, questionId: string) => void;
    unlockLevel: (level: Level) => void;
    // Admin
    resetAll: () => void;
    unlockAll: () => void;
    clearProgress: () => void;
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
      progress: initialProgress,
      badges: [],
      actions: {
        setFavoritePosition: (pos) =>
          set((s) => ({ profile: { ...s.profile, favoritePosition: pos } })),
        addXp: (level, amount) =>
          set((s) => {
            const lv = s.progress[level] ?? { unlocked: level === '5-manna', xp: 0, completedQuestionIds: [] };
            return {
              progress: {
                ...s.progress,
                [level]: { ...lv, xp: Math.max(0, lv.xp + amount) },
              },
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
        resetAll: () =>
          set(() => ({ profile: { avatar: {} }, progress: initialProgress, badges: [] })),
        unlockAll: () =>
          set((s) => ({
            progress: {
              ...s.progress,
              '5-manna': { unlocked: true, xp: 0, completedQuestionIds: [] },
              '7-manna': { unlocked: true, xp: 0, completedQuestionIds: [] },
              '9-manna': { unlocked: true, xp: 0, completedQuestionIds: [] },
            },
          })),
        clearProgress: () =>
          set((s) => ({
            progress: {
              ...s.progress,
              '5-manna': { unlocked: true, xp: 0, completedQuestionIds: [] },
              '7-manna': { unlocked: false, xp: 0, completedQuestionIds: [] },
              '9-manna': { unlocked: false, xp: 0, completedQuestionIds: [] },
            },
          })),
      },
    }),
    {
      name: 'fotboll-app-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);

