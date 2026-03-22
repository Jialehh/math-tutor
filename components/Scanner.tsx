'use client';

import { useTheme } from './ThemeProvider';
import { motion } from 'motion/react';
import { ScanLine } from 'lucide-react';

export default function Scanner({ onScan }: { onScan: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.985 }}
      onClick={onScan}
      className="relative w-full max-w-2xl mx-auto cursor-pointer group mt-12"
      transition={{ type: "spring", stiffness: 260, damping: 15 }}
    >
      <div className={`absolute inset-0 blur-2xl rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 ${
        isDark
          ? 'bg-gradient-to-r from-cyan-500/30 via-purple-500/20 to-cyan-500/30'
          : 'bg-gradient-to-r from-purple-400/30 via-cyan-400/20 to-purple-400/30'
      }`} />
      <div className={`absolute inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
        isDark
          ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10'
          : 'bg-gradient-to-r from-cyan-400/10 to-purple-400/10'
      }`} />
      <div className={`relative p-8 rounded-3xl backdrop-blur-2xl border overflow-hidden flex flex-col items-center justify-center gap-4 ${
        isDark
          ? 'bg-black/50 border-cyan-500/20'
          : 'bg-white/60 border-purple-300/40'
      }`}>
        <motion.div
          animate={{ y: [-2, 2, -2], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className={`absolute inset-0 blur-xl rounded-full ${isDark ? 'bg-cyan-400/30' : 'bg-purple-400/30'}`} />
          <ScanLine className={`w-12 h-12 relative z-10 ${isDark ? 'text-cyan-400' : 'text-purple-500'}`} />
        </motion.div>
        <div className={`text-sm tracking-widest uppercase font-mono ${isDark ? 'text-cyan-100/80' : 'text-slate-700/80'}`}>
          初始化量子扫描 / 上传题目
        </div>

        <motion.div
          className={`absolute left-0 right-0 h-[1px] shadow-[0_0_8px_rgba(0,255,255,0.6)] ${
            isDark
              ? 'bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent'
              : 'bg-gradient-to-r from-transparent via-purple-400/60 to-transparent'
          }`}
          animate={{ top: ['0%', '100%', '0%'], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-cyan-400/60' : 'bg-purple-400/60'}`} />
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-cyan-400/40' : 'bg-purple-400/40'}`} style={{ animationDelay: '0.2s' }} />
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-cyan-400/20' : 'bg-purple-400/20'}`} style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </motion.div>
  );
}
