import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Level, Position, Question } from '@/types/content';

type LevelProgress = {
  unlocked: boolean;
  xp: number;
  completedQuestionIds: string[];
  categoryProgress?: Record<string, { completed: number; total: number }>;
};

type Profile = {
  avatar: {
    gender?: 'kille' | 'tjej' | 'annat';
    hair?: string;
    shirtColor?: string;
    name?: string;
    jerseyNumber?: string;
    skinTone?: string;
  };
  favoritePosition?: Position;
  age?: number;
};

type CategoryStat = { attempts: number; correct: number };

type AppState = {
  profile: Profile;
  progress: Partial<Record<Level, LevelProgress>>;
  badges: string[];
  stats: { correctAnswerTimestamps: number[]; byCategory: Record<string, CategoryStat> };
  actions: {
    setFavoritePosition: (pos: Position) => void;
    setTeamColor: (hex: string) => void;
    setAvatarName: (name: string) => void;
    setJerseyNumber: (num: string) => void;
    setSkinTone: (hex: string) => void;
    setAge: (age: number) => void;
    recordCorrectAnswer: () => void;
    addXp: (level: Level, amount: number) => void;
    markQuestionCompleted: (level: Level, questionId: string) => void;
    unlockLevel: (level: Level) => void;
    incrementCategory: (level: Level, category: string, delta?: number, totalHint?: number) => void;
    recordAnswerResult: (question: Question, isCorrect: boolean) => void;
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
      stats: { correctAnswerTimestamps: [], byCategory: {} },
      actions: {
        setFavoritePosition: (pos) =>
          set((s) => ({ profile: { ...s.profile, favoritePosition: pos } })),
        setTeamColor: (hex) =>
          set((s) => ({ profile: { ...s.profile, avatar: { ...(s.profile.avatar || {}), shirtColor: hex } } })),
        setAvatarName: (name) =>
          set((s) => ({ profile: { ...s.profile, avatar: { ...(s.profile.avatar || {}), name } } })),
        setJerseyNumber: (num) =>
          set((s) => ({ profile: { ...s.profile, avatar: { ...(s.profile.avatar || {}), jerseyNumber: num } } })),
        setSkinTone: (hex) =>
          set((s) => ({ profile: { ...s.profile, avatar: { ...(s.profile.avatar || {}), skinTone: hex } } })),
        setAge: (age) => set((s) => ({ profile: { ...s.profile, age } })),
        recordCorrectAnswer: () =>
          set((s) => {
            const now = Date.now();
            const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
            const kept = (s.stats.correctAnswerTimestamps || []).filter((t) => t >= weekAgo);
            return { stats: { ...s.stats, correctAnswerTimestamps: [...kept, now] } } as any;
          }),
        addXp: (level, amount) =>
          set((s) => {
            const lv = s.progress[level] ?? { unlocked: level === '5-manna', xp: 0, completedQuestionIds: [] };
            const nextXp = Math.max(0, lv.xp + amount);
            const next = {
              ...s.progress,
              [level]: { ...lv, xp: nextXp },
            } as Partial<Record<Level, LevelProgress>>;
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
        incrementCategory: (level, category, delta = 1, totalHint) =>
          set((s) => {
            const lv = s.progress[level] ?? { unlocked: level === '5-manna', xp: 0, completedQuestionIds: [], categoryProgress: {} };
            const cp = lv.categoryProgress ?? {};
            const entry = cp[category] ?? { completed: 0, total: totalHint ?? 50 } as any;
            const total = totalHint ?? entry.total ?? 50;
            const completed = Math.max(0, Math.min(total, (entry.completed ?? 0) + delta));
            return {
              progress: {
                ...s.progress,
                [level]: { ...lv, categoryProgress: { ...cp, [category]: { completed, total } } },
              },
            };
          }),
        recordAnswerResult: (question, isCorrect) =>
          set((s) => {
            const cat = question.category || 'okänd';
            const prev = s.stats.byCategory[cat] || { attempts: 0, correct: 0 };
            const next: CategoryStat = { attempts: prev.attempts + 1, correct: prev.correct + (isCorrect ? 1 : 0) };
            return { stats: { ...s.stats, byCategory: { ...s.stats.byCategory, [cat]: next } } } as any;
          }),
      },
    }),
    {
      name: 'fotboll-app-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persisted: any, fromVersion) => {
        if (!persisted) return persisted;
        if (fromVersion && fromVersion < 2) {
          return { ...persisted, stats: { correctAnswerTimestamps: persisted.stats?.correctAnswerTimestamps || [], byCategory: {} } };
        }
        return persisted;
      }
    }
  )
);