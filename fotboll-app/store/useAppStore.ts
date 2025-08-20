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
            const nextXp = Math.max(0, lv.xp + amount);
            const next = {
              ...s.progress,
              [level]: { ...lv, xp: nextXp },
            } as Partial<Record<Level, LevelProgress>>;
            // auto-unlock thresholds
            if (level === '5-manna' && nextXp >= 100) {
              const l7 = s.progress['7-manna'] ?? { unlocked: false, xp: 0, completedQuestionIds: [] };
              next['7-manna'] = { ...l7, unlocked: true };
            }
            if (level === '7-manna' && nextXp >= 200) {
              const l9 = s.progress['9-manna'] ?? { unlocked: false, xp: 0, completedQuestionIds: [] };
              next['9-manna'] = { ...l9, unlocked: true };
            }
            return { progress: next };
          }),
        // TODO: auto-unlock thresholds: 5->7 at 100 XP, 7->9 at 200 XP
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