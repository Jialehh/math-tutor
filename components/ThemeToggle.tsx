'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className="relative w-12 h-12 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          mass: 0.8,
        }}
        className="relative"
      >
        <AnimatePresence mode="wait">
          {theme === 'dark' ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
              transition={{ type: 'spring', stiffness: 260, damping: 15 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-cyan-400/30 blur-lg rounded-full" />
              <Moon className="w-5 h-5 text-cyan-300 relative z-10" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
              transition={{ type: 'spring', stiffness: 260, damping: 15 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-purple-400/40 blur-lg rounded-full" />
              <Sun className="w-5 h-5 text-purple-400 relative z-10" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="absolute inset-0 rounded-full border border-cyan-500/30 dark:border-cyan-500/30 light:border-purple-500/30" />
      <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(0,255,255,0.2)] dark:shadow-[0_0_15px_rgba(0,255,255,0.2)] light:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-shadow duration-500" />
    </motion.button>
  );
}
