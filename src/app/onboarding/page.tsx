'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useHunterStore } from '@/store/useHunterStore';
import { Shield, Sword, Activity, ChevronRight, Loader2, Target, Calendar } from 'lucide-react';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setProfile } = useHunterStore();

  const [formData, setFormData] = useState({
    name: '',
    weight: 0,
    height: 0,
    targetWeight: 0,
    equipment: [] as string[],
    rank: 'E',
    goalType: 'None' as any,
    goalDuration: 3,
    trainingDays: [1, 2, 3, 4, 5]
  });

  const nextStep = () => setStep(s => s + 1);

  const handleFinish = async () => {
    setIsLoading(true);
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + formData.goalDuration);
    setProfile({ ...formData, targetDate: targetDate.toISOString() });
    
    // Simulate synchronization
    await new Promise(resolve => setTimeout(resolve, 3000));
    router.push('/dashboard');
  };

  const equipmentOptions = [
    "No Equipment (Bodyweight)",
    "Dumbbells",
    "Pull-up Bar",
    "Resistance Bands",
    "Full Gym Access"
  ];

  const goalOptions = [
    { type: 'Weight Loss', label: 'Lose Fat', desc: 'Focus on cardio & HIIT' },
    { type: 'Muscle Building', label: 'Gain Muscle', desc: 'Focus on strength & volume' },
    { type: 'Endurance', label: 'Improve Stamina', desc: 'Focus on high reps & cardio' }
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3, 4, 5].map((s) => (
            <div 
              key={s} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                step >= s ? 'bg-system-blue' : 'bg-gray-800'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold system-font text-system-blue uppercase tracking-tighter">THE AWAKENING</h2>
              <p className="text-gray-400 italic">Enter your physical parameters for system synchronization.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 text-gray-500">Hunter Name</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Sung Jin-Woo"
                    className="w-full bg-system-gray border border-white/10 p-4 rounded focus:border-system-blue outline-none transition-all"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2 text-gray-500">Current Weight (kg)</label>
                    <input 
                      type="number" 
                      className="w-full bg-system-gray border border-white/10 p-4 rounded focus:border-system-blue outline-none transition-all"
                      onChange={(e) => setFormData({...formData, weight: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2 text-gray-500">Target Weight (kg)</label>
                    <input 
                      type="number" 
                      className="w-full bg-system-gray border border-white/10 p-4 rounded focus:border-system-blue outline-none transition-all"
                      onChange={(e) => setFormData({...formData, targetWeight: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={nextStep}
                disabled={!formData.name || !formData.weight}
                className="w-full py-4 bg-system-blue text-black font-bold system-font tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
              >
                PROCEED <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold system-font text-system-blue uppercase tracking-tighter">THE GREAT QUEST</h2>
              <p className="text-gray-400 italic">Define your ultimate objective and time limit.</p>
              
              <div className="grid grid-cols-1 gap-3">
                {goalOptions.map((goal) => (
                  <button
                    key={goal.type}
                    onClick={() => setFormData({...formData, goalType: goal.type as any})}
                    className={`p-4 rounded border text-left transition-all flex items-center justify-between ${
                      formData.goalType === goal.type 
                        ? 'border-system-blue bg-system-blue/10' 
                        : 'border-white/10 bg-system-gray hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className={`font-bold ${formData.goalType === goal.type ? 'text-system-blue' : 'text-white'}`}>{goal.label}</div>
                      <div className="text-xs text-gray-500">{goal.desc}</div>
                    </div>
                    <Target size={20} className={formData.goalType === goal.type ? 'text-system-blue' : 'text-gray-700'} />
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest mb-2 text-gray-500">Time Limit (Months)</label>
                <div className="flex gap-4">
                  {[1, 3, 6, 12].map((m) => (
                    <button
                      key={m}
                      onClick={() => setFormData({...formData, goalDuration: m})}
                      className={`flex-1 py-3 rounded border font-mono ${
                        formData.goalDuration === m ? 'border-system-blue text-system-blue bg-system-blue/5' : 'border-white/10 text-gray-500'
                      }`}
                    >
                      {m}M
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={nextStep}
                disabled={formData.goalType === 'None'}
                className="w-full py-4 bg-system-blue text-black font-bold system-font tracking-widest flex items-center justify-center gap-2"
              >
                COMMIT TO QUEST <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold system-font text-system-blue uppercase tracking-tighter">TRAINING SCHEDULE</h2>
              <p className="text-gray-400 italic">When shall the system summon you for battle?</p>
              
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => (
                  <button
                    key={day}
                    onClick={() => {
                      const newDays = formData.trainingDays.includes(idx)
                        ? formData.trainingDays.filter(d => d !== idx)
                        : [...formData.trainingDays, idx];
                      setFormData({...formData, trainingDays: newDays});
                    }}
                    className={`aspect-square rounded border flex flex-col items-center justify-center transition-all ${
                      formData.trainingDays.includes(idx)
                        ? 'border-system-blue bg-system-blue/10 text-system-blue'
                        : 'border-white/10 bg-system-gray text-gray-600'
                    }`}
                  >
                    <span className="text-[10px] font-mono uppercase">{day}</span>
                  </button>
                ))}
              </div>

              <div className="bg-system-gray/50 p-4 rounded border border-white/5 text-xs text-gray-500 italic">
                The System will expect activity on these days. Failure may trigger consequences.
              </div>

              <button 
                onClick={nextStep}
                className="w-full py-4 bg-system-blue text-black font-bold system-font tracking-widest flex items-center justify-center gap-2"
              >
                SET SCHEDULE <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold system-font text-system-blue uppercase tracking-tighter">THE ARMORY</h2>
              <p className="text-gray-400 italic">Select the artifacts available in your arsenal.</p>
              
              <div className="grid grid-cols-1 gap-3">
                {equipmentOptions.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      const newEq = formData.equipment.includes(item)
                        ? formData.equipment.filter(e => e !== item)
                        : [...formData.equipment, item];
                      setFormData({...formData, equipment: newEq});
                    }}
                    className={`p-4 rounded border text-left transition-all flex items-center justify-between ${
                      formData.equipment.includes(item) 
                        ? 'border-system-blue bg-system-blue/10 text-system-blue' 
                        : 'border-white/10 bg-system-gray hover:border-white/20'
                    }`}
                  >
                    <span>{item}</span>
                    <Sword size={16} className={formData.equipment.includes(item) ? 'opacity-100' : 'opacity-20'} />
                  </button>
                ))}
              </div>

              <button 
                onClick={nextStep}
                className="w-full py-4 bg-system-blue text-black font-bold system-font tracking-widest flex items-center justify-center gap-2"
              >
                EQUIP ARTIFACTS <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold system-font text-system-blue uppercase tracking-tighter">INITIAL RANK</h2>
              <p className="text-gray-400 italic">Determining your current power level...</p>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-500 uppercase tracking-widest">How many push-ups can you do in one set?</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "0 - 10", rank: "E" },
                    { label: "11 - 30", rank: "D" },
                    { label: "31 - 50", rank: "C" },
                    { label: "50+", rank: "B" }
                  ].map((opt) => (
                    <button
                      key={opt.rank}
                      onClick={() => setFormData({...formData, rank: opt.rank})}
                      className={`p-4 rounded border transition-all text-center ${
                        formData.rank === opt.rank
                          ? 'border-system-blue bg-system-blue/10 text-system-blue'
                          : 'border-white/10 bg-system-gray hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs text-gray-500 mb-1">{opt.label}</div>
                      <div className="font-bold text-xl">{opt.rank}-RANK</div>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleFinish}
                disabled={isLoading}
                className="w-full py-4 bg-system-blue text-black font-bold system-font tracking-widest flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    SYNCHRONIZING...
                  </>
                ) : (
                  <>COMPLETE AWAKENING</>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* System Message */}
        <div className="mt-12 text-center">
          <p className="text-[10px] font-mono text-gray-700 tracking-[0.2em] uppercase">
            [ System Notification: Path chosen cannot be easily abandoned ]
          </p>
        </div>
      </div>
    </div>
  );
}
