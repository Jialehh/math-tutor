'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Send } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface QuestionInputProps {
  onSubmit: (question: string) => void;
}

export default function QuestionInput({ onSubmit }: QuestionInputProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 15 }}
      className="relative w-full max-w-2xl mx-auto mt-4"
    >
      {/* Glow background */}
      <div className={`absolute inset-0 blur-xl rounded-3xl opacity-80 ${
        isDark
          ? 'bg-gradient-to-r from-cyan-500/25 via-purple-500/15 to-cyan-500/25'
          : 'bg-gradient-to-r from-purple-400/20 via-cyan-400/15 to-purple-400/20'
      }`} />

      <div className={`relative p-6 rounded-3xl backdrop-blur-xl border shadow-lg ${
        isDark
          ? 'bg-black/50 border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.15)]'
          : 'bg-white/60 border-purple-300/40 shadow-[0_0_30px_rgba(168,85,247,0.1)]'
      }`}>
        {/* Header */}
        <div className={`flex items-center gap-2 mb-4 ${isDark ? 'text-cyan-400/80' : 'text-purple-600/80'}`}>
          <Sparkles className="w-4 h-4" />
          <span className="text-xs tracking-widest uppercase font-mono">
            输入题目 / Enter Question
          </span>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="在此输入任意题目，例如：求函数 f(x) = x³ - 3x + 2 的极值点..."
          rows={4}
          className={`w-full bg-transparent text-base leading-relaxed placeholder resize-none outline-none selection font-sans ${
            isDark
              ? 'text-gray-100 placeholder:text-gray-600 selection:bg-cyan-500/30'
              : 'text-slate-800 placeholder:text-slate-400 selection:bg-purple-500/30'
          }`}
        />

        {/* Footer */}
        <div className={`flex items-center justify-between mt-4 pt-4 border-t ${
          isDark ? 'border-white/5 text-gray-600' : 'border-slate-200 text-slate-500'
        }`}>
          <span className="text-xs font-mono">
            Ctrl+Enter 提交
          </span>
          <motion.button
            onClick={handleSubmit}
            disabled={!text.trim()}
            whileHover={text.trim() ? { scale: 1.03, y: -2 } : {}}
            whileTap={text.trim() ? { scale: 0.97 } : {}}
            transition={{ type: 'spring', stiffness: 260, damping: 15 }}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-sm tracking-wide transition-all duration-300 ${
              text.trim()
                ? isDark
                  ? 'bg-black/80 text-cyan-300 cursor-pointer border border-cyan-500/50 hover:border-cyan-400 hover:text-cyan-200'
                  : 'bg-white/90 text-purple-600 cursor-pointer border border-purple-300/60 hover:border-purple-400 hover:text-purple-700'
                : isDark
                  ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            {text.trim() && (
              <div className={`absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/10 to-cyan-500/20'
                  : 'bg-gradient-to-r from-purple-400/15 via-cyan-400/10 to-purple-400/15'
              }`} />
            )}
            <div className={`absolute inset-0 rounded-xl transition-shadow duration-300 ${
              isDark
                ? 'shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]'
                : 'shadow-[0_0_12px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]'
            }`} />
            <Send className={`w-3.5 h-3.5 relative z-10 ${isDark ? '' : 'text-purple-500'}`} />
            <span className="relative z-10">开始分析</span>
          </motion.button>
        </div>

        {/* Animated scan line */}
        <motion.div
          className={`absolute left-0 right-0 h-[1px] shadow-[0_0_6px_rgba(0,255,255,0.5)] ${
            isDark ? 'bg-cyan-400/20' : 'bg-purple-400/30'
          }`}
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}
