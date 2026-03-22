'use client';

import { BlockMath, InlineMath } from 'react-katex';
import { motion } from 'motion/react';
import { useTheme } from './ThemeProvider';

export default function MathBlock({ math, inline = false, delay = 0 }: { math: string, inline?: boolean, delay?: number }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const spring = {
    type: "spring" as const,
    stiffness: 260,
    damping: 15
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ ...spring, delay }}
      className={`relative ${inline ? 'inline-block mx-2' : 'my-6 flex justify-center'}`}
    >
      <div className={`absolute inset-0 blur-xl rounded-full ${
        isDark ? 'bg-cyan-500/20' : 'bg-purple-400/20'
      }`} />
      <div className={`relative px-6 py-4 rounded-2xl backdrop-blur-xl border shadow-lg ${
        isDark
          ? 'bg-black/40 border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.2)] text-cyan-50'
          : 'bg-white/60 border-purple-300/40 shadow-[0_0_15px_rgba(168,85,247,0.15)] text-slate-800'
      }`}>
        {inline ? <InlineMath math={math} /> : <BlockMath math={math} />}
      </div>
    </motion.div>
  );
}
