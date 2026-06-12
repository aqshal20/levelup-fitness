'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHunterStore } from '@/store/useHunterStore';
import { Shield, Zap, Activity, Brain, Dumbbell, ChevronRight, PlusCircle, Target, Flame, Calendar, RefreshCw, Scale, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function Dashboard() {
  const { name, level, rank, xp, stats, statPoints, allocateStat, goalType, targetDate, streak, trainingDays, resetSystem, bmi, bmiStatus, weight, height, weightHistory, updateWeight } = useHunterStore();
  const [isMounted, setIsMounted] = useState(false);
  const [newWeight, setNewWeight] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    setNewWeight(weight);
  }, [weight]);

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  const statItems = [
    { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-orange-500' },
    { key: 'agility', label: 'AGI', icon: Zap, color: 'text-system-blue' },
    { key: 'vitality', label: 'VIT', icon: Activity, color: 'text-green-500' },
    { key: 'intelligence', label: 'INT', icon: Brain, color: 'text-system-purple' },
  ];

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getDaysRemaining = () => {
    if (!targetDate) return 0;
    const diffTime = new Date(targetDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="min-h-screen bg-black p-6 md:p-12 font-sans pb-24 relative overflow-hidden">
      {/* Background Decorative Lines */}
      <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-0 left-1/2 w-px h-full bg-system-blue" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-system-blue" />
      </div>

      {/* Status Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-12 relative"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-system-blue font-mono text-xs tracking-[0.4em] uppercase mb-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-system-blue rounded-full animate-pulse" />
              Hunter Status Window
            </h2>
            <h1 className="text-4xl md:text-5xl font-bold system-font tracking-tight uppercase">
              {name || 'Unknown Hunter'}
            </h1>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Rank</div>
              <div className="text-3xl font-bold text-system-blue system-font">{rank}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Level</div>
              <div className="text-3xl font-bold text-white system-font">{level}</div>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest mb-2 text-gray-400">
            <span>Progress (XP)</span>
            <span>{xp} / 100</span>
          </div>
          <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-white/5 p-[1px]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${xp}%` }}
              className="h-full bg-gradient-to-r from-system-blue to-system-purple shadow-[0_0_15px_rgba(0,234,255,0.5)] rounded-full"
            />
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Stats Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-panel p-8 space-y-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold system-font text-lg tracking-wider uppercase">ABILITIES</h3>
            {statPoints > 0 && (
              <span className="text-[10px] font-mono bg-system-blue/20 text-system-blue px-3 py-1 rounded-full animate-pulse border border-system-blue/30">
                {statPoints} Stat Points Available
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statItems.map((item) => (
              <div key={item.key} className="flex items-center justify-between bg-white/5 p-4 rounded-sm group hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
                <div className="flex items-center gap-4">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="font-mono text-xs text-gray-400 tracking-widest uppercase">{item.label}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-xl system-font">{(stats as any)[item.key]}</span>
                  {statPoints > 0 && (
                    <button 
                      onClick={() => allocateStat(item.key as any)}
                      className="text-system-blue hover:scale-125 transition-transform"
                    >
                      <PlusCircle size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Motivation Side Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* BMI Card */}
          <div className="glass-panel p-6 border-system-blue/20 flex items-center justify-between group">
            <div>
              <div className="text-[10px] uppercase font-mono text-gray-500 mb-1 tracking-[0.2em]">Body Analysis</div>
              <div className={`text-xl font-bold system-font ${bmiStatus === 'IDEAL' ? 'text-green-500' : 'text-yellow-500'}`}>{bmiStatus}</div>
              <div className="text-[10px] text-gray-600 font-mono mt-1">BMI: {bmi} | {weight}kg / {height}cm</div>
            </div>
            <Scale className="w-8 h-8 text-gray-700 group-hover:text-system-blue transition-colors" />
          </div>

          {/* Streak Card */}
          <div className="glass-panel p-6 border-orange-500/30 flex items-center justify-between relative overflow-hidden group">
            <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
               <Flame size={80} />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-gray-500 mb-1 tracking-[0.2em]">Current Streak</div>
              <div className="text-3xl font-bold system-font text-orange-500">{streak} DAYS</div>
            </div>
            <Flame className="w-10 h-10 text-orange-500 animate-bounce" />
          </div>

          {/* Training Schedule */}
          <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={14} className="text-system-blue" />
              <span className="text-[10px] uppercase font-mono text-gray-400 tracking-widest">Active Schedule</span>
            </div>
            <div className="flex justify-between">
              {days.map((day, idx) => (
                <div 
                  key={idx} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${
                    trainingDays.includes(idx) 
                      ? 'bg-system-blue/20 text-system-blue border border-system-blue/30 shadow-[0_0_10px_rgba(0,234,255,0.2)]' 
                      : 'text-gray-700 border border-white/5'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Weight Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto glass-panel p-8 mb-8 border-system-blue/30 relative"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="text-system-blue" size={18} />
              <h3 className="font-bold system-font text-lg tracking-wider uppercase">WEIGHT PROGRESSION</h3>
            </div>
            <p className="text-gray-400 text-sm">Tracking your physical transformation journey.</p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-2 rounded border border-white/10 w-full md:w-auto">
            <input 
              type="number" 
              value={newWeight || ''}
              onChange={(e) => setNewWeight(Number(e.target.value))}
              className="bg-transparent w-full md:w-20 text-center font-bold text-xl outline-none text-system-blue"
              placeholder="0"
            />
            <button 
              onClick={() => updateWeight(newWeight)}
              className="bg-system-blue text-black px-6 py-2 font-bold system-font text-xs tracking-widest hover:bg-white transition-all w-full md:w-auto"
            >
              UPDATE
            </button>
          </div>
        </div>

        <div className="h-64 w-full">
          {weightHistory && weightHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#444" 
                  fontSize={10}
                  tickFormatter={(str) => {
                    try {
                      const date = new Date(str);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    } catch {
                      return str;
                    }
                  }}
                  tickMargin={10}
                />
                <YAxis 
                  stroke="#444" 
                  fontSize={10} 
                  domain={['dataMin - 2', 'dataMax + 2']}
                  tickMargin={10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(0,234,255,0.2)', borderRadius: '4px' }}
                  itemStyle={{ color: '#00EAFF', fontSize: '12px' }}
                  labelStyle={{ color: '#666', fontSize: '10px', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#00EAFF" 
                  strokeWidth={3} 
                  dot={{ fill: '#00EAFF', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, stroke: '#FFF', strokeWidth: 2 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-700 font-mono text-xs uppercase tracking-widest italic">
              [ No historical data available for synchronization ]
            </div>
          )}
        </div>
      </motion.div>

      {/* The Great Quest (Long term Goal) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto glass-panel p-8 mb-8 border-system-blue/30 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Target size={120} />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-system-blue" size={18} />
              <h3 className="font-bold system-font text-lg tracking-wider uppercase">THE GREAT QUEST: {goalType}</h3>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              Synchronizing with long-term objective. Total commitment required.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold system-font text-white">{getDaysRemaining()} DAYS</div>
            <div className="text-[10px] uppercase font-mono text-system-blue tracking-[0.2em]">Remaining Time</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions / Quests */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <motion.div 
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
          className="glass-panel p-8 relative overflow-hidden group cursor-pointer transition-all"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Shield size={80} />
          </div>
          <h3 className="font-bold system-font text-lg tracking-wider mb-2 uppercase">DAILY QUESTS</h3>
          <p className="text-gray-400 text-sm mb-6">Access your active assignments.</p>
          <Link href="/quests">
            <button className="flex items-center gap-2 text-system-blue font-mono text-xs uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
              Launch Interface <ChevronRight size={14} />
            </button>
          </Link>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(188,19,254,0.08)' }}
          className="glass-panel p-8 relative overflow-hidden group cursor-pointer border-system-purple/30 transition-all"
        >
          <h3 className="font-bold system-font text-lg tracking-wider mb-2 text-system-purple uppercase">DUNGEON (WORKOUT)</h3>
          <p className="text-gray-400 text-sm mb-6">Execute your daily quest sequence with the System Timer.</p>
          <Link href="/workout">
            <button className="flex items-center gap-2 text-system-purple font-mono text-xs uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
              Initialize Sequence <ChevronRight size={14} />
            </button>
          </Link>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto flex justify-center mb-12">
        <button 
          onClick={() => {
            if(confirm("DANGER: System Reset will erase all data. Proceed?")) resetSystem();
          }}
          className="text-gray-800 hover:text-red-900 transition-colors flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em]"
        >
          <RefreshCw size={10} /> Emergency System Reset
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 p-4 flex justify-around md:hidden z-50">
        <Link href="/dashboard" className="text-system-blue"><Shield /></Link>
        <Link href="/quests" className="text-gray-500 hover:text-white"><Zap /></Link>
        <Link href="/workout" className="text-gray-500 hover:text-white"><Activity /></Link>
      </div>
    </div>
  );
}
