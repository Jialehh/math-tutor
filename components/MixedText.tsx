'use client';

import { motion } from 'motion/react';
import { InlineMath } from 'react-katex';
import { useTheme } from './ThemeProvider';

export default function MixedText({
  text,
  onComplete,
  className = '',
}: {
  text: string;
  onComplete?: () => void;
  className?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const segments = parseMixedText(text);

  return (
    <motion.span
      className={`inline ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 15, duration: 0.6 }}
      onAnimationComplete={onComplete}
    >
      {segments.map((seg, i) =>
        seg.type === 'math' ? (
          <span key={i} className="mx-0.5 inline-block align-middle">
            <InlineMath math={seg.content} />
          </span>
        ) : (
          <span key={i} className={`tracking-wide ${isDark ? 'text-gray-100' : 'text-slate-800'}`} style={{
            textShadow: isDark ? '0px 0px 8px rgba(0, 255, 255, 0.4)' : '0px 0px 8px rgba(168, 85, 247, 0.2)'
          }}>
            {seg.content}
          </span>
        )
      )}
    </motion.span>
  );
}

interface Segment {
  type: 'text' | 'math';
  content: string;
}

function parseMixedText(text: string): Segment[] {
  const segments: Segment[] = [];
  const regex = /\$([^$\n]+)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'math', content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return segments;
}
