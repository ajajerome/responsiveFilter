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
  season: { number: number; xp: number; startIso: string };
  progress: Partial<Record<Level, LevelProgress>>;
  badges: string[];
  actions: {
    setName: (name: string) => void;
    setFavoritePosition: (pos: Position) => void;
    addXp: (level: Level, amount: number) => void;
    markQuestionCompleted: (level: Level, questionId: string) => void;
    unlockLevel: (level: Level) => void;
    incrementScenarioCount: (now?: Date) => void;
    setMaxScenariosPerDay: (max: number) => void;
    setCurfew: (startHour: number, endHour: number) => void;
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
      season: { number: 1, xp: 0, startIso: new Date().toISOString() },
      progress: initialProgress,
      badges: [],
      limits: undefined as any,
      actions: {
        setName: (name) => set((s) => ({ profile: { ...s.profile, name } })),
        setFavoritePosition: (pos) =>
          set((s) => ({ profile: { ...s.profile, favoritePosition: pos } })),
        addXp: (level, amount) =>
          set((s) => {
            const lv = s.progress[level] ?? { unlocked: level === '5-manna', xp: 0, completedQuestionIds: [] };
            // Week-based season rollover
            const now = new Date();
            const start = s.season?.startIso ? new Date(s.season.startIso) : new Date();
            const days = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            const rolled = days >= 7;
            const baseSeason = rolled
              ? { number: (s.season?.number ?? 1) + 1, xp: 0, startIso: now.toISOString() }
              : { number: s.season?.number ?? 1, xp: s.season?.xp ?? 0, startIso: s.season?.startIso ?? now.toISOString() };
            const season = { ...baseSeason, xp: Math.max(0, baseSeason.xp + amount) };
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
        incrementScenarioCount: (now = new Date()) =>
          set((s) => {
            const today = now.toISOString().slice(0, 10);
            const limits = s as any as {
              limits?: { maxScenariosPerDay: number; scenariosToday: number; lastActiveDateIso?: string; curfew: { startHour: number; endHour: number } };
            };
            const cur = limits.limits ?? { maxScenariosPerDay: 10, scenariosToday: 0, lastActiveDateIso: today, curfew: { startHour: 7, endHour: 20 } };
            const last = cur.lastActiveDateIso ?? today;
            const isNewDay = last !== today;
            const scenariosToday = isNewDay ? 0 : cur.scenariosToday ?? 0;
            return {
              ...(s as any),
              limits: {
                maxScenariosPerDay: cur.maxScenariosPerDay,
                scenariosToday: Math.min(cur.maxScenariosPerDay, scenariosToday + 1),
                lastActiveDateIso: today,
                curfew: cur.curfew,
              },
            } as any;
          }),
        setMaxScenariosPerDay: (max) =>
          set((s) => {
            const today = new Date().toISOString().slice(0, 10);
            const cur = (s as any).limits ?? { scenariosToday: 0, lastActiveDateIso: today, curfew: { startHour: 7, endHour: 20 } };
            return {
              ...(s as any),
              limits: { ...cur, maxScenariosPerDay: Math.max(1, Math.floor(max)) },
            } as any;
          }),
        setCurfew: (startHour, endHour) =>
          set((s) => {
            const today = new Date().toISOString().slice(0, 10);
            const cur = (s as any).limits ?? { scenariosToday: 0, lastActiveDateIso: today, maxScenariosPerDay: 10 };
            return {
              ...(s as any),
              limits: { ...cur, curfew: { startHour, endHour } },
            } as any;
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

