'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHunterStore } from '@/store/useHunterStore';
import { Play, Pause, RotateCcw, ChevronLeft, Volume2, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Workout() {
  const { addXp, isPenaltyActive, setPenalty } = useHunterStore();
  
  const [phase, setPhase] = useState<'prepare' | 'work' | 'rest' | 'finished'>('prepare');
  const [timeLeft, setTimeLeft] = useState(10);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(8);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized System Voice
  const speak = (text: string) => {
    if (isMuted || typeof window === 'undefined') return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a more 'Robotic/System' sounding voice if available
    const voices = window.speechSynthesis.getVoices();
    const systemVoice = voices.find(v => v.name.includes('Google UK English Male') || v.name.includes('Male')) || voices[0];
    
    if (systemVoice) utterance.voice = systemVoice;
    
    utterance.rate = 0.95; // Slightly slower for authority
    utterance.pitch = 0.7; // Deeper pitch for that 'System' feel
    utterance.volume = 1;
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // Required for voices to load in some browsers
    window.speechSynthesis.getVoices();
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
        if (timeLeft <= 3 && timeLeft > 0) {
           // Countdown beep-like sound via speech or keep it silent for cleaner feel
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
      setTimeLeft(20);
      speak("Commencing exercise. Eliminate your weakness.");
    } else if (phase === 'work') {
      setPhase('rest');
      setTimeLeft(10);
      speak("Recovery phase initiated. Breathe.");
    } else if (phase === 'rest') {
      if (round < totalRounds) {
        setRound(r => r + 1);
        setPhase('work');
        setTimeLeft(20);
        speak(`Round ${round + 1}. Engagement started.`);
      } else {
        setPhase('finished');
        setIsActive(false);
        if (isPenaltyActive) {
            setPenalty(false);
            speak("Penalty Quest cleared. Access to regular system restored.");
        } else {
            addXp(50);
            useHunterStore.getState().updateStreak(); // Call updateStreak here
            speak("Mission accomplished. Hunter performance: Satisfactory.");
        }
      }
    }
  };

  const toggleStart = () => {
    if (!isActive) {
      if (phase === 'prepare' && timeLeft === 10) {
        speak(isPenaltyActive ? "Entering Penalty Zone. Survival is the only objective." : "Synchronization complete. Initiating dungeon sequence.");
      } else {
        speak("Resuming.");
      }
    } else {
      speak("Paused.");
    }
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setPhase('prepare');
    setTimeLeft(10);
    setRound(1);
    speak("System reset.");
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

  return (
    <div className={`min-h-screen transition-colors duration-1000 flex flex-col items-center justify-center p-6 text-center ${isPenaltyActive ? 'bg-red-950/20' : 'bg-black'}`}>
      <Link href="/dashboard" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest">
        <ChevronLeft size={14} /> Exit {isPenaltyActive ? 'Penalty Zone' : 'Dungeon'}
      </Link>

      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
      >
        <Volume2 className={isMuted ? 'opacity-30' : 'opacity-100'} />
      </button>

      <AnimatePresence mode="wait">
        {phase !== 'finished' ? (
          <motion.div 
            key="active"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
            <div>
              <h2 className={`font-mono text-sm tracking-[0.5em] uppercase mb-2 ${isPenaltyActive ? 'text-red-500' : 'text-gray-500'}`}>
                {isPenaltyActive ? 'SURVIVAL ROUND' : 'ROUND'} {round} / {totalRounds}
              </h2>
              <h1 className={`text-6xl md:text-8xl font-black system-font tracking-widest uppercase transition-colors duration-500 ${getThemeColor().split(' ')[0]}`}>
                {phase}
              </h1>
            </div>

            <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full border-8 flex items-center justify-center relative transition-all duration-500 ${getThemeColor()}`}>
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

            <div className="flex gap-8 justify-center">
              <button 
                onClick={toggleStart}
                className={`w-20 h-20 rounded-full bg-white/5 border flex items-center justify-center hover:bg-white/10 transition-all ${isPenaltyActive ? 'border-red-600 text-red-600' : 'border-white/10 text-white'}`}
              >
                {isActive ? <Pause size={32} /> : <Play size={32} className="ml-2" />}
              </button>
              <button 
                onClick={reset}
                className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-gray-400"
              >
                <RotateCcw size={28} />
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
              <p className="text-gray-400">{isPenaltyActive ? 'You have escaped the penalty zone.' : 'You have survived the training.'}</p>
              {!isPenaltyActive && <p className="text-2xl font-bold text-white tracking-widest system-font">+50 XP REWARDED</p>}
            </div>
            <Link href="/dashboard">
              <button className={`px-12 py-4 text-black font-bold system-font tracking-widest mt-8 ${isPenaltyActive ? 'bg-red-600' : 'bg-system-blue'}`}>
                RETURN TO STATUS
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`mt-12 text-[10px] font-mono tracking-[0.2em] uppercase max-w-xs mx-auto ${isPenaltyActive ? 'text-red-900' : 'text-gray-700'}`}>
        [ Current Status: {isActive ? 'Combat Mode Active' : 'Waiting for User Input'} ]
      </div>
    </div>
  );
}
