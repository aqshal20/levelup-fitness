import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HunterStats {
  strength: number;
  agility: number;
  vitality: number;
  intelligence: number;
}

interface HunterState {
  name: string;
  level: number;
  rank: string;
  xp: number;
  statPoints: number;
  stats: HunterStats;
  weight: number;
  height: number;
  targetWeight: number;
  equipment: string[];
  isPenaltyActive: boolean;
  goalType: 'Weight Loss' | 'Muscle Building' | 'Endurance' | 'None';
  goalDuration: number; // in months
  targetDate: string | null;
  trainingDays: number[]; // 0-6 (Sunday-Saturday)
  streak: number;
  lastWorkoutDate: string | null;
  quests: { id: number; title: string; goal: number; unit?: string; xp: number; completed: boolean }[];
  
  // Actions
  setName: (name: string) => void;
  setProfile: (profile: Partial<HunterState>) => void;
  addXp: (amount: number) => void;
  allocateStat: (stat: keyof HunterStats) => void;
  setPenalty: (active: boolean) => void;
  updateStreak: () => void;
  toggleQuest: (id: number) => void;
  resetQuests: () => void;
  resetSystem: () => void;
}

const initialQuests = [
  { id: 1, title: 'Push-ups', goal: 100, xp: 20, completed: false },
  { id: 2, title: 'Sit-ups', goal: 100, xp: 20, completed: false },
  { id: 3, title: 'Squats', goal: 100, xp: 20, completed: false },
  { id: 4, title: 'Running', goal: 10, unit: 'km', xp: 40, completed: false },
];

export const useHunterStore = create<HunterState>()(
  persist(
    (set) => ({
      name: '',
      level: 1,
      rank: 'E',
      xp: 0,
      statPoints: 0,
      stats: {
        strength: 10,
        agility: 10,
        vitality: 10,
        intelligence: 10,
      },
      weight: 0,
      height: 0,
      targetWeight: 0,
      equipment: [],
      isPenaltyActive: false,
      goalType: 'None',
      goalDuration: 0,
      targetDate: null,
      trainingDays: [1, 2, 3, 4, 5],
      streak: 0,
      lastWorkoutDate: null,
      quests: initialQuests,

      setName: (name) => set({ name }),
      setProfile: (profile) => set((state) => ({ ...state, ...profile })),
      addXp: (amount) => set((state) => {
        let newXp = state.xp + amount;
        let newLevel = state.level;
        let newStatPoints = state.statPoints;
        let newRank = state.rank;

        while (newXp >= 100) {
          newXp -= 100;
          newLevel += 1;
          newStatPoints += 3;
          
          if (newLevel === 10) newRank = 'D';
          if (newLevel === 25) newRank = 'C';
          if (newLevel === 50) newRank = 'B';
          if (newLevel === 80) newRank = 'A';
          if (newLevel === 100) newRank = 'S';
        }

        return { xp: newXp, level: newLevel, statPoints: newStatPoints, rank: newRank };
      }),
      allocateStat: (stat) => set((state) => {
        if (state.statPoints <= 0) return state;
        return {
          statPoints: state.statPoints - 1,
          stats: {
            ...state.stats,
            [stat]: state.stats[stat] + 1,
          },
        };
      }),
      setPenalty: (active) => set({ isPenaltyActive: active }),
      updateStreak: () => set((state) => {
        const today = new Date().toDateString();
        if (state.lastWorkoutDate === today) return state;
        
        const lastDate = state.lastWorkoutDate ? new Date(state.lastWorkoutDate) : null;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        let newStreak = state.streak;
        if (!lastDate || lastDate.toDateString() === yesterday.toDateString()) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
        
        return { streak: newStreak, lastWorkoutDate: today };
      }),
      toggleQuest: (id) => set((state) => ({
        quests: state.quests.map(q => {
          if (q.id === id && !q.completed) {
            state.addXp(q.xp);
            return { ...q, completed: true };
          }
          return q;
        })
      })),
      resetQuests: () => set({ quests: initialQuests }),
      resetSystem: () => {
        localStorage.removeItem('hunter-storage');
        window.location.reload();
      },
    }),
    {
      name: 'hunter-storage',
    }
  )
);
