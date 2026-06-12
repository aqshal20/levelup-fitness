'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHunterStore } from '@/store/useHunterStore';
import { Play, Pause, RotateCcw, ChevronLeft, Volume2, Shield, Zap, FastForward } from 'lucide-react';
import Link from 'next/link';

export default function Workout() {
  const { quests, completeAllQuests, isPenaltyActive, setPenalty, updateStreak } = useHunterStore();
  
  const [phase, setPhase] = useState<'prepare' | 'work' | 'rest' | 'finished'>('prepare');
  const [timeLeft, setTimeLeft] = useState(10);
  const [currentQuestIndex, setCurrentQuestIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Optimized System Voice
  const speak = (text: string) => {
    if (isMuted || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const systemVoice = voices.find(v => v.name.includes('Google UK English Male') || v.name.includes('Male')) || voices[0];
    if (systemVoice) utterance.voice = systemVoice;
    utterance.rate = 1.0;
    utterance.pitch = 0.7;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
        // Beep in last 3 seconds
        if (timeLeft <= 3 && timeLeft > 0) {
           // speak(timeLeft.toString()); // Optional: might be too much
        }
      }, 1000);
    } else if (timeLeft === 0) {
      handlePhaseChange();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handlePhaseChange = () => {
    if (phase === 'prepare') {
      setPhase('work');
      setTimeLeft(30); // Default 30s work
      speak(`Start! ${quests[currentQuestIndex]?.title || 'Exercise'}.`);
    } else if (phase === 'work') {
      if (currentQuestIndex < quests.length - 1) {
        setPhase('rest');
        setTimeLeft(15); // Default 15s rest
        const nextQuest = quests[currentQuestIndex + 1]?.title;
        speak(`Rest. Next up: ${nextQuest}.`);
      } else {
        finishDungeon();
      }
    } else if (phase === 'rest') {
      setCurrentQuestIndex(prev => prev + 1);
      setPhase('work');
      setTimeLeft(30);
      speak(`Start! ${quests[currentQuestIndex + 1]?.title || 'Next exercise'}.`);
    }
  };

  const finishDungeon = () => {
    setPhase('finished');
    setIsActive(false);
    if (isPenaltyActive) {
      setPenalty(false);
      speak("Penalty Quest cleared. You have survived.");
    } else {
      completeAllQuests();
      updateStreak();
      speak("Dungeon Cleared. All daily quests successfully completed. Well done, Hunter.");
    }
  };

  const toggleStart = () => {
    if (!isActive) {
      if (phase === 'prepare' && timeLeft === 10) {
        speak(isPenaltyActive ? "Entering Penalty Zone. Survival is your only command." : "Dungeon gate opening. Initiating quest sequence.");
      } else {
        speak("Resuming.");
      }
    } else {
      speak("Paused.");
    }
    setIsActive(!isActive);
  };

  const skipPhase = () => {
    handlePhaseChange();
  };

  const getThemeColor = () => {
    if (isPenaltyActive) return 'text-red-600 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.4)]';
    switch(phase) {
      case 'work': return 'text-system-blue border-system-blue shadow-[0_0_30px_rgba(0,234,255,0.4)]';
      case 'rest': return 'text-system-purple border-system-purple shadow-[0_0_30px_rgba(188,19,254,0.4)]';
      case 'prepare': return 'text-yellow-500 border-yellow-500';
      default: return 'text-white border-white';
    }
  };

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  if (quests.length === 0 && !isPenaltyActive) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
         <Shield className="w-20 h-20 text-gray-800 mb-6" />
         <h1 className="text-2xl system-font text-white mb-4 uppercase">No Quests Detected</h1>
         <p className="text-gray-500 mb-8 max-w-xs">The system has no assignments for you. Access the Quest Window to synchronize.</p>
         <Link href="/quests" className="px-8 py-3 bg-system-blue text-black font-bold system-font tracking-widest text-sm">
           SYNC QUESTS
         </Link>
      </div>
    );
  }

  const currentQuest = quests[currentQuestIndex];
  const nextQuest = quests[currentQuestIndex + 1];

  return (
    <div className={`min-h-screen transition-colors duration-1000 flex flex-col items-center justify-center p-6 text-center ${isPenaltyActive ? 'bg-red-950/20' : 'bg-black'}`}>
      <Link href="/dashboard" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest">
        <ChevronLeft size={14} /> Abandon Dungeon
      </Link>

      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
      >
        <Volume2 className={isMuted ? 'opacity-30' : 'opacity-100'} />
      </button>

      {/* Progress Header */}
      {phase !== 'finished' && (
        <div className="absolute top-24 left-0 right-0 px-8 max-w-xl mx-auto">
          <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.2em] mb-2 text-gray-500">
            <span>Exercise {currentQuestIndex + 1} / {quests.length}</span>
            <span>{currentQuest?.title}</span>
          </div>
          <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: `${((currentQuestIndex + (phase === 'rest' ? 1 : 0)) / quests.length) * 100}%` }}
              className={`h-full ${isPenaltyActive ? 'bg-red-600' : 'bg-system-blue'}`}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {phase !== 'finished' ? (
          <motion.div 
            key="active"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10 w-full max-w-lg mt-12"
          >
            <div>
              <h1 className={`text-4xl md:text-6xl font-black system-font tracking-widest uppercase transition-colors duration-500 ${getThemeColor().split(' ')[0]}`}>
                {phase === 'work' ? currentQuest?.title : phase}
              </h1>
              {phase === 'rest' && nextQuest && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <p className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Next Up</p>
                  <p className="text-xl font-bold system-font text-white uppercase">{nextQuest.title}</p>
                </motion.div>
              )}
            </div>

            <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full border-8 mx-auto flex items-center justify-center relative transition-all duration-500 ${getThemeColor()}`}>
              <div className="text-7xl md:text-9xl font-bold system-font tracking-tighter">
                {timeLeft}
              </div>
              
              {isActive && (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-12px] rounded-full border-t-8 border-transparent border-l-8 border-current opacity-30"
                />
              )}
            </div>

            <div className="flex gap-6 justify-center">
              <button 
                onClick={toggleStart}
                className={`w-16 h-16 rounded-full bg-white/5 border flex items-center justify-center hover:bg-white/10 transition-all ${isPenaltyActive ? 'border-red-600 text-red-600' : 'border-white/10 text-white'}`}
              >
                {isActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </button>
              
              <button 
                onClick={skipPhase}
                disabled={!isActive}
                className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-gray-500 disabled:opacity-20"
                title="Skip Phase"
              >
                <FastForward size={24} />
              </button>

              <button 
                onClick={() => { if(confirm("Restart Session?")) window.location.reload() }}
                className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-gray-500"
              >
                <RotateCcw size={24} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="finished"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {isPenaltyActive ? <Zap className="w-24 h-24 text-red-600 mx-auto mb-4" /> : <Shield className="w-24 h-24 text-system-blue mx-auto mb-4" />}
            <h1 className={`text-5xl font-bold system-font tracking-widest ${isPenaltyActive ? 'text-red-600' : 'text-system-blue'}`}>
              {isPenaltyActive ? 'PENALTY CLEARED' : 'DUNGEON CLEARED'}
            </h1>
            <div className="space-y-2">
              <p className="text-gray-400">{isPenaltyActive ? 'You have survived the trial. Your limits have been pushed.' : 'The system is satisfied. Your daily quests are complete.'}</p>
              {!isPenaltyActive && (
                 <div className="bg-system-blue/10 border border-system-blue/30 p-4 rounded mt-6">
                    <p className="text-[10px] uppercase font-mono text-system-blue mb-1">Rewards Acquired</p>
                    <p className="text-2xl font-bold text-white tracking-widest system-font">QUEST XP CLAMED</p>
                 </div>
              )}
            </div>
            <Link href="/dashboard">
              <button className={`px-12 py-4 text-black font-bold system-font tracking-widest mt-8 w-full md:w-auto ${isPenaltyActive ? 'bg-red-600' : 'bg-system-blue'}`}>
                RETURN TO STATUS
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`mt-12 text-[10px] font-mono tracking-[0.2em] uppercase max-w-xs mx-auto ${isPenaltyActive ? 'text-red-900' : 'text-gray-700'}`}>
        [ Current Status: {isActive ? 'Combat Mode Active' : 'Waiting for Hunter'} ]
      </div>
    </div>
  );
}
