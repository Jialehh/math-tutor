'use client';

import { motion, AnimatePresence } from 'motion/react';
import { InlineMath } from 'react-katex';
import { useTheme } from './ThemeProvider';

export interface Choice {
  id: string;
  text: string;
  math?: string;
}

interface ChoiceTerminalProps {
  choices: Choice[];
  onSelect: (id: string) => void;
  selectedId: string | null;
  isDark?: boolean;
}

export default function ChoiceTerminal({ choices, onSelect, selectedId, isDark: isDarkProp }: ChoiceTerminalProps) {
  const { theme } = useTheme();
  const isDark = isDarkProp ?? theme === 'dark';

  const spring = { type: "spring" as const, stiffness: 260, damping: 15 };

  return (
    <motion.div
      className="flex flex-col gap-4 mt-8 w-full max-w-2xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
      }}
    >
      <AnimatePresence mode="popLayout">
        {choices.map((choice) => {
          if (selectedId && selectedId !== choice.id) return null;

          const isSelected = selectedId === choice.id;

          return (
            <motion.button
              key={choice.id}
              layout
              onClick={() => !selectedId && onSelect(choice.id)}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.8 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
              whileHover={!selectedId ? { scale: 1.03, y: -5 } : {}}
              whileTap={!selectedId ? { scale: 0.97 } : {}}
              transition={spring}
              className={`relative p-5 rounded-2xl text-left border overflow-hidden group ${
                isSelected
                  ? isDark
                    ? 'bg-cyan-900/40 border-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.3)]'
                    : 'bg-purple-100/60 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                  : isDark
                    ? 'bg-[#0a0a0a]/80 backdrop-blur-md border-white/10 hover:border-cyan-500/50'
                    : 'bg-white/80 backdrop-blur-md border-slate-200 hover:border-purple-400/50'
              }`}
            >
              {!isSelected && (
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  isDark
                    ? 'bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-purple-500/0'
                    : 'bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-cyan-400/0'
                }`} />
              )}

              <div className="relative flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                  isSelected
                    ? isDark ? 'border-cyan-400 text-cyan-400' : 'border-purple-400 text-purple-600'
                    : isDark
                      ? 'border-white/20 text-white/50 group-hover:border-cyan-500/50 group-hover:text-cyan-400'
                      : 'border-slate-300 text-slate-400 group-hover:border-purple-400/50 group-hover:text-purple-500'
                }`}>
                  {choice.id}
                </div>
                <div className={`flex-1 text-lg ${
                  isDark ? 'text-gray-200' : 'text-slate-700'
                }`}>
                  {choice.text}
                  {choice.math && <span className="ml-2"><InlineMath math={choice.math} /></span>}
                </div>
              </div>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
