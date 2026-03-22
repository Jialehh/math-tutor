'use client';

import { motion } from 'motion/react';

export default function KineticText({ text, onComplete }: { text: string, onComplete?: () => void }) {
  const chars = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      textShadow: '0px 0px 8px rgba(0, 255, 255, 0.6)',
      transition: {
        type: 'spring' as const,
        damping: 15,
        stiffness: 260,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
      scale: 0.9,
      filter: 'blur(4px)',
      textShadow: '0px 0px 0px rgba(0, 255, 255, 0)',
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      onAnimationComplete={onComplete}
      className="inline-block"
    >
      {chars.map((char, index) => (
        <motion.span variants={child} key={index} className="inline-block text-gray-100 tracking-wide">
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
}
