'use client';

import { motion } from 'motion/react';
import { useTheme } from './ThemeProvider';

export default function Waveform({ active }: { active: boolean }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-1 h-6">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-full ${
            isDark
              ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.8)]'
              : 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]'
          }`}
          animate={{
            height: active ? ['20%', '100%', '40%', '80%', '20%'] : '20%',
          }}
          transition={{
            duration: 0.8,
            repeat: active ? Infinity : 0,
            repeatType: 'mirror',
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
