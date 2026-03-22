'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Scanner from '@/components/Scanner';
import Waveform from '@/components/Waveform';
import KineticText from '@/components/KineticText';
import MathBlock from '@/components/MathBlock';
import ChoiceTerminal, { Choice } from '@/components/ChoiceTerminal';
import QuestionInput from '@/components/QuestionInput';
import MixedText from '@/components/MixedText';
import ThemeProvider from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeProvider';
import SettingsModal from '@/components/SettingsModal';
import { Settings } from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────

type MainStep = 'idle' | 'inputting' | 'scanning' | 'loading' | 'intro' | 'quiz' | 'conclusion';
type RoundPhase = 'guidance' | 'question' | 'choices' | 'feedback';

interface Round {
  roundId: number;
  guidance: string;
  formula?: string;
  question: string;
  choices: Choice[];
  correctId: string;
  feedback_correct: string;
  feedback_wrong: string;
}

interface LessonPlan {
  complexity: number;
  totalRounds: number;
  intro: string;
  formula: string;
  rounds: Round[];
  conclusion: string;
}

// ─── Theme-aware Main Page ─────────────────────────────────────────────────

function PageContent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [mainStep, setMainStep] = useState<MainStep>('idle');
  const [lesson, setLesson] = useState<LessonPlan | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [roundPhase, setRoundPhase] = useState<RoundPhase>('guidance');
  const [roundAnswers, setRoundAnswers] = useState<Record<number, string>>({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [error, setError] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mainStep, currentRound, roundPhase, isSpeaking]);

  const handleScan = () => setMainStep('inputting');

  const handleQuestionSubmit = async (question: string) => {
    setUserQuestion(question);
    setError('');
    setMainStep('scanning');

    setTimeout(async () => {
      setMainStep('loading');
      try {
        const selectedProvider = localStorage.getItem('ai-tutor-provider') || 'openai';
        const customBaseUrl = localStorage.getItem('ai-tutor-base-url') || '';
        const customApiKey = localStorage.getItem('ai-tutor-api-key') || '';
        const modelName = localStorage.getItem('ai-tutor-model-name') || '';

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            question,
            selectedProvider,
            customBaseUrl,
            customApiKey,
            modelName
          }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setError(data.error || 'AI 分析失败，请重试');
          setMainStep('inputting');
          return;
        }
        setLesson(data);
        setCurrentRound(0);
        setRoundAnswers({});
        setRoundPhase('guidance');
        setMainStep('intro');
        setIsSpeaking(true);
      } catch {
        setError('网络错误，请检查连接后重试');
        setMainStep('inputting');
      }
    }, 1800);
  };

  const handleIntroComplete = () => {
    setIsSpeaking(false);
    setTimeout(() => {
      setMainStep('quiz');
      setIsSpeaking(true);
    }, 500);
  };

  const handleGuidanceComplete = () => {
    setIsSpeaking(false);
    setTimeout(() => setRoundPhase('question'), 400);
  };

  const handleQuestionComplete = () => {
    setIsSpeaking(false);
    setTimeout(() => setRoundPhase('choices'), 400);
  };

  const handleSelect = (selectedId: string) => {
    setRoundAnswers((prev) => ({ ...prev, [currentRound]: selectedId }));
    setRoundPhase('feedback');
    setIsSpeaking(true);
  };

  const handleFeedbackComplete = () => {
    setIsSpeaking(false);
  };

  const handleNextRound = () => {
    if (!lesson) return;
    const next = currentRound + 1;
    if (next >= lesson.rounds.length) {
      setMainStep('conclusion');
      setIsSpeaking(true);
    } else {
      setCurrentRound(next);
      setRoundPhase('guidance');
      setIsSpeaking(true);
    }
  };

  const handleConclusionComplete = () => setIsSpeaking(false);

  const handleReset = () => {
    setMainStep('idle');
    setLesson(null);
    setCurrentRound(0);
    setRoundPhase('guidance');
    setRoundAnswers({});
    setIsSpeaking(false);
    setUserQuestion('');
    setError('');
  };

  const currentRoundData = lesson?.rounds[currentRound];
  const isQuizOrConclusion = mainStep === 'quiz' || mainStep === 'conclusion';
  const showPanel = mainStep === 'intro' || isQuizOrConclusion;

  return (
    <main className={`min-h-screen transition-colors duration-500 ${
      isDark
        ? 'bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black text-white'
        : 'bg-gradient-to-b from-slate-50 via-purple-50/20 to-slate-100 text-slate-800'
    } overflow-hidden font-sans selection:bg-cyan-500/30`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-4xl mx-auto px-6 py-12 flex flex-col min-h-screen"
        >
          {/* Top Right Controls - Fixed Position */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 15 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-4"
          >
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 ${
                isDark 
                  ? 'bg-black/30 border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/40 hover:border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.1)]' 
                  : 'bg-white/50 border-purple-300/50 text-purple-600 hover:bg-purple-100 hover:border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className={isDark ? 'text-cyan-300' : 'text-purple-600'}>
              <ThemeToggle />
            </div>
          </motion.div>

          {/* ── Scanner / Input / Loading ── */}
          <AnimatePresence mode="wait">
            {mainStep === 'idle' && (
              <motion.div key="scanner"
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                transition={{ type: 'spring', stiffness: 260, damping: 15 }}>
                <Scanner onScan={handleScan} />
              </motion.div>
            )}

            {mainStep === 'inputting' && (
              <motion.div key="inputting"
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                transition={{ type: 'spring', stiffness: 260, damping: 15 }}>
                <div className="mt-12">
                  <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className={`text-sm tracking-widest uppercase font-mono mb-1 ${isDark ? 'text-cyan-100/70' : 'text-cyan-700/70'}`}>[ 量子扫描就绪 ]</div>
                    <div className={`text-xs font-mono ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>输入你想练习的题目，AI 将分步引导你思考</div>
                  </motion.div>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                      className={`text-center text-sm font-mono mb-4 px-4 py-2 rounded-xl border max-w-2xl mx-auto ${
                        isDark ? 'text-red-400 border-red-500/30 bg-red-900/10' : 'text-red-600 border-red-300/50 bg-red-50'
                      }`}>
                      ⚠ {error}
                    </motion.div>
                  )}
                  <QuestionInput onSubmit={handleQuestionSubmit} />
                  <motion.div className="text-center mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <button onClick={handleReset} className={`text-xs font-mono transition-colors underline underline-offset-2 ${isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-500 hover:text-gray-700'}`}>返回</button>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {mainStep === 'scanning' && (
              <motion.div key="scanning"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                className="flex flex-col justify-center items-center h-64 gap-4">
                <div className={`font-mono tracking-widest animate-pulse text-lg ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>[ 量子扫描中... ]</div>
                <div className={`font-mono text-xs tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>正在解析题目结构</div>
              </motion.div>
            )}

            {mainStep === 'loading' && (
              <motion.div key="loading"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                className="flex flex-col justify-center items-center h-64 gap-4">
                <div className="flex items-center gap-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className={`w-5 h-5 rounded-full border-2 ${isDark ? 'border-cyan-400/30 border-t-cyan-400' : 'border-cyan-600/30 border-t-cyan-600'}`} />
                  <div className={`font-mono tracking-widest text-sm ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>AI 正在制定学习计划...</div>
                </div>
                <div className={`font-mono text-xs ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>根据题目复杂度规划教学步骤</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── AI Teaching Panel ── */}
          <AnimatePresence>
            {showPanel && lesson && (
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 15 }}
                className="flex-1 flex flex-col mt-8">

                {/* User Question Display */}
                {userQuestion && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 15 }}
                    className={`mb-6 px-4 py-3 rounded-xl border backdrop-blur-xl ${
                      isDark
                        ? 'bg-cyan-900/10 border-cyan-500/20 text-cyan-200/80'
                        : 'bg-purple-100/50 border-purple-300/40 text-purple-800/80'
                    }`}
                  >
                    <div className={`text-xs font-mono tracking-widest uppercase mb-1 ${isDark ? 'text-cyan-400/60' : 'text-purple-600/70'}`}>你的题目</div>
                    <div className="text-sm leading-relaxed">{userQuestion}</div>
                  </motion.div>
                )}

                {/* AI Avatar + Waveform + Round progress */}
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px] ${isDark ? 'shadow-[0_0_20px_rgba(0,255,255,0.4)]' : 'shadow-[0_0_20px_rgba(168,85,247,0.3)]'} flex-shrink-0`}>
                    <div className={`w-full h-full rounded-full flex items-center justify-center ${isDark ? 'bg-black' : 'bg-white'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isDark ? 'bg-cyan-400/20' : 'bg-purple-400/20'}`}>
                        <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,1)]' : 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,1)]'}`} />
                      </div>
                    </div>
                  </div>
                  <Waveform active={isSpeaking} />

                  {isQuizOrConclusion && lesson.totalRounds > 1 && (
                    <div className="ml-auto flex items-center gap-2">
                      {lesson.rounds.map((_, i) => {
                        const done = i < currentRound || mainStep === 'conclusion';
                        const active = i === currentRound && mainStep === 'quiz';
                        return (
                          <div key={i} className={`rounded-full transition-all duration-500 ${
                            done
                              ? isDark ? 'w-2 h-2 bg-cyan-400 shadow-[0_0_6px_rgba(0,255,255,0.8)]' : 'w-2 h-2 bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.8)]'
                              : active
                                ? isDark ? 'w-3 h-3 bg-cyan-400/60' : 'w-3 h-3 bg-purple-400/60'
                                : isDark ? 'w-2 h-2 bg-white/10' : 'w-2 h-2 bg-slate-300/30'
                          }`} />
                        );
                      })}
                      <span className={`text-xs font-mono ml-1 ${isDark ? 'text-cyan-400/50' : 'text-purple-500/60'}`}>
                        {mainStep === 'conclusion' ? '✓' : `${currentRound + 1}/${lesson.totalRounds}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content stream */}
                <div className="space-y-8 flex-1">

                  {/* Intro */}
                  <div className={`text-xl leading-relaxed ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <KineticText
                      text={lesson.intro}
                      onComplete={mainStep === 'intro' ? handleIntroComplete : undefined}
                    />
                  </div>

                  {/* Main formula */}
                  {lesson.formula && <MathBlock math={lesson.formula} />}

                  {/* Quiz rounds */}
                  {isQuizOrConclusion && (
                    <div className="space-y-12">

                      {/* Completed rounds */}
                      {lesson.rounds.slice(0, currentRound).map((round, i) => (
                        <CompletedRound
                          key={i}
                          round={round}
                          selectedId={roundAnswers[i]}
                          roundNum={i + 1}
                          total={lesson.totalRounds}
                          isDark={isDark}
                        />
                      ))}

                      {/* Current active round */}
                      {mainStep === 'quiz' && currentRoundData && (
                        <ActiveRound
                          key={currentRound}
                          round={currentRoundData}
                          phase={roundPhase}
                          selectedId={roundAnswers[currentRound] ?? null}
                          roundNum={currentRound + 1}
                          total={lesson.totalRounds}
                          isSpeaking={isSpeaking}
                          isLastRound={currentRound >= lesson.rounds.length - 1}
                          isDark={isDark}
                          onGuidanceComplete={handleGuidanceComplete}
                          onQuestionComplete={handleQuestionComplete}
                          onSelect={handleSelect}
                          onFeedbackComplete={handleFeedbackComplete}
                          onNext={handleNextRound}
                        />
                      )}

                      {/* Conclusion */}
                      {mainStep === 'conclusion' && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: 'spring', stiffness: 260, damping: 15 }}
                          className="space-y-6">
                          <div className="flex items-center gap-3">
                            <div className={`h-px flex-1 ${isDark ? 'bg-gradient-to-r from-purple-500/40 to-transparent' : 'bg-gradient-to-r from-purple-400/40 to-transparent'}`} />
                            <span className={`text-xs font-mono tracking-widest uppercase ${isDark ? 'text-purple-400/50' : 'text-purple-600/60'}`}>AI 综合总结</span>
                            <div className={`h-px flex-1 ${isDark ? 'bg-gradient-to-l from-purple-500/40 to-transparent' : 'bg-gradient-to-l from-purple-400/40 to-transparent'}`} />
                          </div>
                          <div className={`text-xl leading-relaxed ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            <MixedText text={lesson.conclusion} onComplete={handleConclusionComplete} />
                          </div>
                          {!isSpeaking && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 15 }}
                              className="flex justify-center mt-8 pb-8">
                              <button onClick={handleReset}
                                className={`relative px-8 py-3 rounded-2xl font-mono text-sm tracking-widest transition-all duration-300 border overflow-hidden ${
                                  isDark
                                    ? 'text-cyan-300 hover:text-cyan-200 border-cyan-500/40 hover:border-cyan-400'
                                    : 'text-purple-600 hover:text-purple-700 border-purple-300/50 hover:border-purple-400'
                                }`}>
                                <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 ${
                                  isDark ? 'bg-gradient-to-r from-cyan-500/15 via-purple-500/10 to-cyan-500/15' : 'bg-gradient-to-r from-purple-400/15 via-cyan-500/10 to-purple-400/15'
                                }`} />
                                <div className={`absolute inset-0 transition-shadow duration-300 rounded-2xl ${
                                  isDark ? 'shadow-[0_0_15px_rgba(0,255,255,0.15)] hover:shadow-[0_0_25px_rgba(0,255,255,0.3)]' : 'shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]'
                                }`} />
                                [ 再做一题 ]
                              </button>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>

                <div ref={bottomRef} className="h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </main>
  );
}

// ─── Main Page Export ─────────────────────────────────────────────────────

export default function Page() {
  return (
    <ThemeProvider>
      <PageContent />
    </ThemeProvider>
  );
}

// ─── Active Round ────────────────────────────────────────────────────────────

function ActiveRound({
  round, phase, selectedId, roundNum, total, isSpeaking, isLastRound, isDark,
  onGuidanceComplete, onQuestionComplete, onSelect, onFeedbackComplete, onNext,
}: {
  round: Round;
  phase: RoundPhase;
  selectedId: string | null;
  roundNum: number;
  total: number;
  isSpeaking: boolean;
  isLastRound: boolean;
  isDark: boolean;
  onGuidanceComplete: () => void;
  onQuestionComplete: () => void;
  onSelect: (id: string) => void;
  onFeedbackComplete: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 15 }}
      className="space-y-6">

      {/* Step divider */}
      {total > 1 && (
        <motion.div className="flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className={`h-px flex-1 ${isDark ? 'bg-gradient-to-r from-cyan-500/30 to-transparent' : 'bg-gradient-to-r from-cyan-600/30 to-transparent'}`} />
          <span className={`text-xs font-mono tracking-widest uppercase px-2 ${isDark ? 'text-cyan-400/40' : 'text-cyan-600/50'}`}>
            第 {roundNum} 步 / 共 {total} 步
          </span>
          <div className={`h-px flex-1 ${isDark ? 'bg-gradient-to-l from-cyan-500/30 to-transparent' : 'bg-gradient-to-l from-cyan-600/30 to-transparent'}`} />
        </motion.div>
      )}

      {/* Guidance */}
      <div className={`text-xl leading-relaxed ${isDark ? 'text-white' : 'text-slate-800'}`}>
        <KineticText
          text={round.guidance}
          onComplete={phase === 'guidance' ? onGuidanceComplete : undefined}
        />
      </div>

      {/* Round formula */}
      {phase !== 'guidance' && round.formula && (
        <MathBlock math={round.formula} />
      )}

      {/* Question */}
      {(phase === 'question' || phase === 'choices' || phase === 'feedback') && (
        <div className={`text-xl leading-relaxed ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <KineticText
            text={round.question}
            onComplete={phase === 'question' ? onQuestionComplete : undefined}
          />
        </div>
      )}

      {/* Choices */}
      {(phase === 'choices' || phase === 'feedback') && (
        <ChoiceTerminal
          choices={round.choices}
          onSelect={onSelect}
          selectedId={selectedId}
          isDark={isDark}
        />
      )}

      {/* Feedback after selection */}
      {phase === 'feedback' && selectedId && (
        <FeedbackBlock
          round={round}
          selectedId={selectedId}
          isSpeaking={isSpeaking}
          isLastRound={isLastRound}
          isDark={isDark}
          onComplete={onFeedbackComplete}
          onNext={onNext}
        />
      )}
    </motion.div>
  );
}

// ─── Completed Round ─────────────────────────────────────────────────────

function CompletedRound({
  round, selectedId, roundNum, total, isDark,
}: {
  round: Round;
  selectedId: string;
  roundNum: number;
  total: number;
  isDark: boolean;
}) {
  const isCorrect = selectedId === round.correctId;
  const chosen = round.choices.find((c) => c.id === selectedId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.45 }}
      className={`space-y-3 border-l-2 pl-5 ${isDark ? 'border-cyan-500/20' : 'border-purple-500/20'}`}>
      {total > 1 && (
        <div className={`text-xs font-mono tracking-widest uppercase ${isDark ? 'text-cyan-400/40' : 'text-purple-500/50'}`}>
          第 {roundNum} 步（已完成）
        </div>
      )}
      <div className={`text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{round.guidance}</div>
      <div className={`text-base ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{round.question}</div>
      <div className={`text-sm font-mono ${isDark ? (isCorrect ? 'text-cyan-400/50' : 'text-red-400/50') : (isCorrect ? 'text-green-600/60' : 'text-red-600/60')}`}>
        {selectedId}&nbsp;—&nbsp;{chosen?.text}
        {chosen?.math ? <span className="ml-1 opacity-60">[{chosen.math}]</span> : null}
        <span className="ml-2">{isCorrect ? '✓' : '✗'}</span>
      </div>
    </motion.div>
  );
}

// ─── Feedback Block ───────────────────────────────────────────────────────

function FeedbackBlock({
  round, selectedId, isSpeaking, isLastRound, isDark, onComplete, onNext,
}: {
  round: Round;
  selectedId: string;
  isSpeaking: boolean;
  isLastRound: boolean;
  isDark: boolean;
  onComplete: () => void;
  onNext: () => void;
}) {
  const isCorrect = selectedId === round.correctId;
  const feedbackText = isCorrect ? round.feedback_correct : round.feedback_wrong;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 15 }}
      className="space-y-5">

      {/* Result badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-mono tracking-wide ${
        isCorrect
          ? isDark
            ? 'border-cyan-500/40 bg-cyan-900/20 text-cyan-300'
            : 'border-green-400/50 bg-green-50/50 text-green-700'
          : isDark
            ? 'border-orange-500/40 bg-orange-900/10 text-orange-300'
            : 'border-orange-400/50 bg-orange-50/50 text-orange-700'
      }`}>
        {isCorrect ? '✓ 正确！' : '✗ 再想想'}
      </div>

      {/* Feedback text */}
      <div className={`text-xl leading-relaxed ${isDark ? 'text-white' : 'text-slate-800'}`}>
        <MixedText text={feedbackText} onComplete={onComplete} />
      </div>

      {/* Continue button */}
      {!isSpeaking && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 15 }}>
          <button
            onClick={onNext}
            className={`relative px-6 py-2.5 rounded-xl font-mono text-sm tracking-widest transition-all duration-300 border overflow-hidden ${
              isDark
                ? 'text-cyan-300 hover:text-cyan-200 border-cyan-500/40 hover:border-cyan-400'
                : 'text-purple-600 hover:text-purple-700 border-purple-300/50 hover:border-purple-400'
            }`}
          >
            <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 ${
              isDark ? 'bg-gradient-to-r from-cyan-500/15 via-purple-500/10 to-cyan-500/15' : 'bg-gradient-to-r from-purple-400/15 via-cyan-500/10 to-purple-400/15'
            }`} />
            <div className={`absolute inset-0 transition-shadow duration-300 rounded-xl ${
              isDark ? 'shadow-[0_0_12px_rgba(0,255,255,0.15)] hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]' : 'shadow-[0_0_12px_rgba(168,85,247,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]'
            }`} />
            <span className="relative z-10">{isLastRound ? '查看总结 →' : '继续下一步 →'}</span>
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
