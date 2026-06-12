'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHunterStore } from '@/store/useHunterStore';
import { CheckCircle2, Circle, ChevronLeft, Award, AlertTriangle, Skull, RotateCcw, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Quests() {
  const { isPenaltyActive, setPenalty, quests, toggleQuest, resetQuests } = useHunterStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  const allCompleted = quests.every(q => q.completed);

  // Simulation for Demo
  const triggerPenalty = () => setPenalty(true);
  const clearPenalty = () => setPenalty(false);

  return (
    <div className={`min-h-screen transition-colors duration-1000 p-6 md:p-12 font-sans ${isPenaltyActive ? 'bg-red-950/20' : 'bg-black'}`}>
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-system-blue transition-colors mb-8 font-mono text-xs uppercase tracking-widest">
          <ChevronLeft size={14} /> Back to Status
        </Link>

        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className={`${isPenaltyActive ? 'text-red-500' : 'text-system-blue'} font-mono text-sm tracking-[0.3em] uppercase mb-1`}>
              {isPenaltyActive ? 'Unauthorized Zone Detected' : 'Current Assignments'}
            </h2>
            <h1 className={`text-4xl font-bold system-font tracking-tight uppercase ${isPenaltyActive ? 'text-red-600' : 'text-white'}`}>
              {isPenaltyActive ? 'PENALTY QUEST' : 'DAILY QUESTS'}
            </h1>
          </div>
          <button 
            onClick={() => { if(confirm("This will replace current quests with new ones. Proceed?")) resetQuests(); }}
            className="text-[10px] font-mono text-gray-600 hover:text-white flex items-center gap-1 uppercase tracking-widest"
          >
            <RotateCcw size={10} /> Reset Quests
          </button>
        </div>

        {!isPenaltyActive && quests.length > 0 && !allCompleted && (
          <Link href="/workout">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 mb-8 bg-gradient-to-r from-system-blue to-system-purple text-black font-bold system-font tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,234,255,0.3)]"
            >
              <Zap size={20} fill="currentColor" />
              ENTER DUNGEON (START WORKOUT)
            </motion.button>
          </Link>
        )}

        <AnimatePresence>
          {isPenaltyActive && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-600/10 border border-red-600 p-8 rounded-sm mb-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Skull size={120} />
              </div>
              <div className="flex items-center gap-4 mb-4 text-red-600">
                <AlertTriangle />
                <h3 className="font-bold system-font uppercase tracking-widest">Survival Quest: Penalty Zone</h3>
              </div>
              <p className="text-gray-300 text-sm mb-6 max-w-md">
                You have failed to complete the daily quest. You must survive the Penalty Zone to restore system access.
              </p>
              <div className="flex gap-4">
                <Link href="/workout" className="flex-1">
                  <button className="w-full py-3 bg-red-600 text-white font-bold system-font text-xs tracking-widest hover:bg-red-700 transition-all">
                    START SURVIVAL
                  </button>
                </Link>
                <button 
                  onClick={clearPenalty}
                  className="px-4 py-2 border border-red-600/30 text-red-600 text-[10px] font-mono hover:bg-red-600/10"
                >
                  DEBUG: CLEAR
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isPenaltyActive && allCompleted && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-system-blue/10 border border-system-blue p-6 rounded mb-8 flex items-center gap-4"
          >
            <Award className="text-system-blue w-10 h-10" />
            <div>
              <h3 className="font-bold text-system-blue uppercase tracking-wider">Quest Cleared!</h3>
              <p className="text-sm text-gray-400">All daily tasks have been completed. The System is satisfied.</p>
            </div>
          </motion.div>
        )}

        <div className={`space-y-4 ${isPenaltyActive ? 'opacity-20 pointer-events-none grayscale' : ''}`}>
          {quests.map((quest, i) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => toggleQuest(quest.id)}
              className={`p-6 rounded border cursor-pointer transition-all flex items-center justify-between group ${
                quest.completed 
                  ? 'border-system-blue/50 bg-system-blue/5 opacity-60' 
                  : 'border-white/10 bg-system-gray hover:border-system-blue/30'
              }`}
            >
              <div className="flex items-center gap-6">
                <div className={quest.completed ? 'text-system-blue' : 'text-gray-700'}>
                  {quest.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                </div>
                <div>
                  <h3 className={`font-bold system-font tracking-wide ${quest.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                    {quest.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">
                    GOAL: {quest.goal}{quest.unit || ''} | REWARD: +{quest.xp} XP
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!isPenaltyActive && (
          <div className="mt-12 flex flex-col items-center">
            <button 
              onClick={triggerPenalty}
              className="text-[10px] text-gray-800 font-mono hover:text-red-900 transition-colors uppercase tracking-[0.3em]"
            >
              [ Simulate System Failure ]
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
