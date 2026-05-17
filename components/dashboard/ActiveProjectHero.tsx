"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, BookOpen } from "lucide-react";

import { motion } from "framer-motion";

type ProjectProps = {
  id?: string;
  title?: string;
  wordCount?: string;
  sessionCount?: string;
};

export function ActiveProjectHero({ project }: { project?: ProjectProps }) {
  const title = project?.title || "The Echoes of Eternity";
  const wordCount = project?.wordCount || "24,590";
  const sessionCount = project?.sessionCount || "+1,200";
  const targetHref = project?.id ? `/editor/${project.id}` : "/editor/draft-1";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative group"
    >
      {/* GRADIENT BORDER TRICK: A div behind the card that shows through the 1px padding */}
      <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/50 via-transparent to-transparent rounded-[25px] opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

      <Link 
        href={targetHref}
        className="block relative bg-white dark:bg-[#0A0A0B] text-black dark:text-white rounded-[24px] p-6 sm:p-8 shadow-xl dark:shadow-none hover:-translate-y-1 transition-transform duration-300 overflow-hidden"
      >
        {/* THE INDIGO GLOW */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/15 dark:bg-indigo-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none transition-all duration-500 group-hover:bg-indigo-500/25"></div>

        <div className="relative z-10 flex items-center justify-between mb-8 sm:mb-12">
          <div className="flex items-center gap-2 px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/5">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-black/70 dark:text-white/70 font-bold tracking-widest text-[9px] uppercase">
              Active Project
            </span>
          </div>
          
          {/* THE NEW CTA */}
          <div className="flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            Continue writing <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold italic tracking-tight mb-8">
            {title}
          </h2>

          <div className="flex items-center gap-8">
            <div>
              <div className="flex items-center gap-1.5 text-black/50 dark:text-white/50 text-xs font-medium mb-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Total Words</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold tracking-tight">{wordCount}</p>
            </div>
            
            <div className="w-px h-10 bg-black/10 dark:bg-white/10"></div>

            <div>
              <div className="flex items-center gap-1.5 text-black/50 dark:text-white/50 text-xs font-medium mb-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                <span>Today's Session</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">{sessionCount}</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}