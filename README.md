# ⚡️ LevelUp Fitness | The System

Become the S-Rank version of yourself. **LevelUp Fitness** is a gamified home workout application inspired by the "Solo Leveling" series, designed to turn your real-world fitness journey into an immersive RPG experience.

![LevelUp Fitness Dashboard](public/window-preview.png) *(Placeholder for your screenshot)*

## ⚔️ Core Features

### 1. The Awakening (Onboarding)
- **Initial Rank Assessment:** Determine your starting power level (E to B Rank).
- **Body Analysis (BMI):** Real-time calculation of your Body Mass Index and health status (Ideal, Overweight, etc.).
- **The Armory:** Select available equipment (Dumbbells, Pull-up bars) to tailor your quest list.
- **The Great Quest:** Set long-term goals (Weight Loss, Muscle Building) with custom deadlines.

### 2. Status Window (Dashboard)
- **Hunter Stats:** Track your Strength (STR), Agility (AGI), Vitality (VIT), and Intelligence (INT).
- **Leveling System:** Gain XP through workouts. Every 100 XP grants +1 Level and 3 Stat Points.
- **Rank Scaling:** Automatically rank up from E-Rank to the legendary S-Rank as you reach level milestones.
- **Streak & Schedule:** Maintain your training streak and follow your personalized weekly schedule.

### 3. Daily Quests & Dungeon Mode
- **Dynamic Quest Generation:** Quests are randomly generated daily based on your equipment, goals, and rank difficulty.
- **Dungeon Clear (Integrated Workout):** A professional-grade workout engine that cycles through your daily quests with a Tabata-style timer.
- **AI System Voice:** A commanding "System" voice (English) that guides you through exercises, rest phases, and mission completion.

### 4. Penalty System
- **Survival Quest:** Failure to complete daily goals triggers the **Penalty Zone**, a high-stakes survival workout mode that locks regular system access until cleared.

## 🛠️ Tech Stack
- **Frontend:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Persistence:** LocalStorage (Offline-first)

## 🚀 Getting Started

### Local Development
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment (Vercel)
1. Push your code to a GitHub repository.
2. Connect your GitHub account to [Vercel](https://vercel.com).
3. Import the project and click **Deploy**.
4. Access your "System" anywhere, anytime from your mobile device.

---

*"The System has chosen you. Do not falter, Hunter."*
