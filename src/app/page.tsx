'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Zap, Target } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-black overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-system-blue/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-system-purple/20 rounded-full blur-[120px] animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10"
      >
        <h2 className="text-system-blue font-mono mb-2 tracking-[0.3em] uppercase text-sm">
          Warning: Unauthorized Access Detected
        </h2>
        <h1 className="text-5xl md:text-7xl font-bold system-font mb-6 tracking-tighter">
          LEVEL UP <span className="text-system-blue">FITNESS</span>
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto mb-12 text-lg">
          The System has chosen you. Will you accept the quest to become the S-Rank version of yourself?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          {[
            { icon: Zap, label: "Leveling System", desc: "Gain XP through daily workouts" },
            { icon: Target, label: "Daily Quests", desc: "Push your limits every day" },
            { icon: Shield, label: "Rank Up", desc: "From E-Rank to S-Rank" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-panel p-6 flex flex-col items-center"
            >
              <item.icon className="w-10 h-10 text-system-blue mb-4" />
              <h3 className="font-bold mb-2">{item.label}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <Link href="/onboarding">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-4 bg-system-blue text-black font-bold text-xl rounded-sm tracking-widest system-font hover:shadow-[0_0_30px_rgba(0,234,255,0.6)] transition-all duration-300"
          >
            ACCEPT QUEST
          </motion.button>
        </Link>
      </motion.div>

      <footer className="absolute bottom-8 text-gray-600 font-mono text-xs uppercase tracking-widest">
        System Protocol v1.0.4 | All Rights Reserved
      </footer>
    </div>
  );
}
