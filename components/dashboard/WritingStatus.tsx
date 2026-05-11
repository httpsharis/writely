"use client";

import { Target, PenTool } from "lucide-react";

export function WritingStats() {
  const days = [
    { letter: 'M', active: true },
    { letter: 'T', active: true },
    { letter: 'W', active: true },
    { letter: 'T', active: false },
    { letter: 'F', active: true },
    { letter: 'S', active: true },
    { letter: 'S', active: false },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Goal Card */}
      <div className="bg-white dark:bg-[#111] border border-black/[0.08] dark:border-white/5 rounded-[20px] p-5 flex items-start gap-4 hover:border-black/20 dark:hover:border-white/10 transition-colors">
        <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Target className="w-5 h-5 text-black dark:text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-black dark:text-white mb-1">Daily Word Goal</h3>
          <p className="text-xs text-black/50 dark:text-white/50 leading-relaxed mb-3">
            80% to your 1,500 word goal.
          </p>
          <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[80%] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* NEW GAMIFIED HABIT CARD */}
      <div className="bg-white dark:bg-[#111] border border-black/[0.08] dark:border-white/5 rounded-[20px] p-5 flex items-start gap-4 hover:border-black/20 dark:hover:border-white/10 transition-colors">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <PenTool className="w-5 h-5 text-orange-500" />
        </div>
        <div className="flex-1 w-full">
          <h3 className="font-semibold text-sm text-black dark:text-white mb-2">Writing Habit</h3>
          
          {/* M T W T F S S Visualizer */}
          <div className="flex items-center justify-between w-full mt-3">
            {days.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div 
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all
                    ${day.active 
                      ? 'bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.3)]' 
                      : 'bg-black/5 dark:bg-white/5 text-black/30 dark:text-white/30'
                    }`}
                >
                  {day.letter}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}