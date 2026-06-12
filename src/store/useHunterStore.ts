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
  bmi: number;
  bmiStatus: string;
  weightHistory: { date: string; weight: number }[];
  
  // Actions
  setName: (name: string) => void;
  setProfile: (profile: Partial<HunterState>) => void;
  addXp: (amount: number) => void;
  allocateStat: (stat: keyof HunterStats) => void;
  setPenalty: (active: boolean) => void;
  updateStreak: () => void;
  toggleQuest: (id: number) => void;
  resetQuests: () => void;
  completeAllQuests: () => void;
  resetSystem: () => void;
  generateQuests: () => void;
  updateWeight: (weight: number) => void;
}

const questPool = {
  bodyweight: [
    { title: 'Push-ups', goal: 50, xp: 20 },
    { title: 'Squats', goal: 50, xp: 20 },
    { title: 'Sit-ups', goal: 50, xp: 20 },
    { title: 'Lunges', goal: 40, xp: 20 },
    { title: 'Plank', goal: 60, unit: 'sec', xp: 15 },
    { title: 'Burpees', goal: 20, xp: 25 },
    { title: 'Jumping Jacks', goal: 100, xp: 15 },
  ],
  dumbbells: [
    { title: 'Dumbbell Press', goal: 30, xp: 25 },
    { title: 'Bicep Curls', goal: 40, xp: 20 },
    { title: 'Lateral Raises', goal: 30, xp: 20 },
    { title: 'Goblet Squats', goal: 30, xp: 25 },
  ],
  pullup_bar: [
    { title: 'Pull-ups', goal: 10, xp: 30 },
    { title: 'Chin-ups', goal: 12, xp: 25 },
    { title: 'Hanging Leg Raises', goal: 20, xp: 25 },
  ],
  resistance_bands: [
    { title: 'Band Rows', goal: 40, xp: 20 },
    { title: 'Band Bicep Curls', goal: 40, xp: 20 },
    { title: 'Band Face Pulls', goal: 30, xp: 20 },
  ],
  gym: [
    { title: 'Bench Press', goal: 30, xp: 30 },
    { title: 'Deadlift', goal: 20, xp: 35 },
    { title: 'Lat Pulldown', goal: 30, xp: 25 },
  ],
  cardio: [
    { title: 'Running', goal: 5, unit: 'km', xp: 40 },
    { title: 'Shadow Boxing', goal: 10, unit: 'min', xp: 25 },
  ]
};

export const useHunterStore = create<HunterState>()(
  persist(
    (set, get) => ({
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
      quests: [],
      bmi: 0,
      bmiStatus: '',
      weightHistory: [],

      setName: (name) => set({ name }),
      setProfile: (profile) => {
        const h = profile.height || get().height;
        const w = profile.weight || get().weight;
        let bmi = 0;
        let status = '';
        
        if (h > 0 && w > 0) {
          bmi = Number((w / ((h / 100) * (h / 100))).toFixed(1));
          if (bmi < 18.5) status = 'UNDERWEIGHT';
          else if (bmi < 25) status = 'IDEAL';
          else if (bmi < 30) status = 'OVERWEIGHT';
          else status = 'OBESE';
        }
        
        const today = new Date().toISOString().split('T')[0];
        
        set((state) => {
          const newHistory = [...state.weightHistory];
          if (w > 0) {
            const existingIdx = newHistory.findIndex(e => e.date === today);
            if (existingIdx >= 0) {
              newHistory[existingIdx].weight = w;
            } else {
              newHistory.push({ date: today, weight: w });
            }
          }
          
          return { 
            ...state, 
            ...profile, 
            bmi, 
            bmiStatus: status, 
            weightHistory: newHistory.sort((a, b) => a.date.localeCompare(b.date)) 
          };
        });
        get().generateQuests();
      },
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
            get().addXp(q.xp);
            return { ...q, completed: true };
          }
          return q;
        })
      })),
      resetQuests: () => get().generateQuests(),
      completeAllQuests: () => set((state) => {
        const totalXp = state.quests.reduce((acc, q) => acc + (q.completed ? 0 : q.xp), 0);
        const updatedQuests = state.quests.map(q => ({ ...q, completed: true }));
        get().addXp(totalXp);
        return { quests: updatedQuests };
      }),
      resetSystem: () => {
        localStorage.removeItem('hunter-storage');
        window.location.reload();
      },
      updateWeight: (w) => {
        const today = new Date().toISOString().split('T')[0];
        const h = get().height;
        let bmi = 0;
        let status = '';
        
        if (h > 0 && w > 0) {
          bmi = Number((w / ((h / 100) * (h / 100))).toFixed(1));
          if (bmi < 18.5) status = 'UNDERWEIGHT';
          else if (bmi < 25) status = 'IDEAL';
          else if (bmi < 30) status = 'OVERWEIGHT';
          else status = 'OBESE';
        }

        set((state) => {
          const newHistory = [...state.weightHistory];
          const existingIdx = newHistory.findIndex(e => e.date === today);
          if (existingIdx >= 0) {
            newHistory[existingIdx].weight = w;
          } else {
            newHistory.push({ date: today, weight: w });
          }
          
          return {
            ...state,
            weight: w,
            bmi,
            bmiStatus: status,
            weightHistory: newHistory.sort((a, b) => a.date.localeCompare(b.date))
          };
        });
      },
      generateQuests: () => {
        const state = get();
        let pool: any[] = [...questPool.bodyweight, ...questPool.cardio];
        
        if (state.equipment.includes('Dumbbells')) pool = [...pool, ...questPool.dumbbells];
        if (state.equipment.includes('Pull-up Bar')) pool = [...pool, ...questPool.pullup_bar];
        if (state.equipment.includes('Resistance Bands')) pool = [...pool, ...questPool.resistance_bands];
        if (state.equipment.includes('Full Gym Access')) pool = [...pool, ...questPool.gym];
        
        // Randomly pick 5 quests
        const shuffled = pool.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5).map((q, idx) => {
          let goalMultiplier = 1;
          
          // Goal Multiplier
          if (state.goalType === 'Weight Loss') goalMultiplier *= 1.2;
          if (state.goalType === 'Muscle Building') goalMultiplier *= 1.1;

          // Rank Multiplier (Difficulty Scaling)
          const rankMultipliers: Record<string, number> = {
            'E': 1,
            'D': 1.5,
            'C': 2.5,
            'B': 4,
            'A': 6,
            'S': 10
          };
          
          const rankMult = rankMultipliers[state.rank] || 1;
          
          return {
            id: idx + 1,
            ...q,
            goal: Math.round(q.goal * goalMultiplier * rankMult),
            completed: false
          };
        });
        
        set({ quests: selected });
      }
    }),
    {
      name: 'hunter-storage',
    }
  )
);
