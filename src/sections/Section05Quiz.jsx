import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle, ArrowRight, RotateCcw, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { quizQuestions, quizResultTiers } from '../data/quizData';
import PhotoSlideshow from '../components/PhotoSlideshow';
import SectionNextButton from '../components/SectionNextButton';
import { photosConfig } from '../config/photos.config';
import audioService from '../services/audioService';
import notificationService from '../services/notificationService';
import progressService from '../services/progressService';

export default function Section05Quiz({ progress, onUpdateProgress, onNext }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState(() => progress.quizAnswers || {});
  const [isQuizCompleted, setIsQuizCompleted] = useState(() => Boolean(progress.quizCompleted));
  
  const [score, setScore] = useState(() => {
    let s = 0;
    quizQuestions.forEach(q => {
      const a = progress.quizAnswers?.[q.id];
      if (a && a.isCorrect) s++;
    });
    return s;
  });

  const totalQuestions = quizQuestions.length;
  const currentQuestion = quizQuestions[currentIndex];

  const handleSelectOption = (optionId) => {
    if (isAnswerSubmitted) return;
    audioService.playPop();
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isAnswerSubmitted) return;

    audioService.playSuccessChime();
    setIsAnswerSubmitted(true);

    const isCorrect =
      selectedOptionId === currentQuestion.correctAnswerId ||
      (currentQuestion.bonusAccepted && currentQuestion.bonusAccepted.includes(selectedOptionId));

    const selectedOption = currentQuestion.options.find(o => o.id === selectedOptionId);

    const updatedAnswers = {
      ...userAnswers,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        questionText: currentQuestion.question,
        selectedOptionId,
        selectedOptionText: selectedOption?.text || '',
        isCorrect: Boolean(isCorrect)
      }
    };
    setUserAnswers(updatedAnswers);
    onUpdateProgress({ quizAnswers: updatedAnswers });
  };

  const handleNextQuestion = () => {
    audioService.playPop();
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let calculatedScore = 0;
    quizQuestions.forEach(q => {
      const ans = userAnswers[q.id];
      if (ans && ans.isCorrect) calculatedScore++;
    });

    setScore(calculatedScore);
    setIsQuizCompleted(true);
    onUpdateProgress({ quizCompleted: true });

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#f472b6', '#a855f7', '#6366f1', '#fbbf24']
    });

    const resultTier = quizResultTiers.find(tier => calculatedScore >= tier.minScore) || quizResultTiers[quizResultTiers.length - 1];

    notificationService.submitQuizResults({
      score: calculatedScore,
      total: totalQuestions,
      resultTier: resultTier.badge,
      userAnswers
    });
  };

  const handleRestartQuiz = () => {
    audioService.playSparkle();
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setIsQuizCompleted(false);
    setScore(0);
    onUpdateProgress({ quizCompleted: false, quizAnswers: {} });
  };

  const resultTier = quizResultTiers.find(tier => score >= tier.minScore) || quizResultTiers[quizResultTiers.length - 1];
  const isCompleted = progressService.isSectionComplete(4, progress);
  const incompleteHint = progressService.getIncompleteHint(4, progress);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-100/90 text-indigo-800 text-xs font-semibold mb-3 border border-indigo-200"
        >
          <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
          <span>Chapter 05 • The Special Bond Examination 🐼🎯</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight"
        >
          How Well Do You Know <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Our Special Bond?
          </span>
        </motion.h2>

        <p className="text-sm md:text-base text-purple-900/80 mt-2 font-normal">
          Answer all 12 questions one by one to unlock Chapter 06.
        </p>
      </div>

      {!isQuizCompleted ? (
        /* ACTIVE QUESTION CARD: ONE AT A TIME */
        <div className="w-full max-w-2xl flex flex-col items-center">
          
          {/* Progress Indicators */}
          <div className="w-full mb-4 px-2 flex items-center justify-between text-xs font-semibold text-purple-900">
            <span className="bg-white/80 px-3 py-1 rounded-full shadow-sm border border-purple-100">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="text-purple-600 uppercase tracking-wider text-[11px]">
              Topic: {currentQuestion.topic}
            </span>
          </div>

          <div className="w-full bg-white/50 h-2 rounded-full overflow-hidden mb-6 border border-white/60">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Question Box */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="w-full glass-panel rounded-3xl p-6 sm:p-8 shadow-xl border border-white/80"
            >
              <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-6">
                {currentQuestion.question}
              </h3>

              {/* 4 Selectable Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  let optionStyles = 'bg-white/70 hover:bg-white text-slate-800 border-white/80 shadow-sm';

                  if (isSelected && !isAnswerSubmitted) {
                    optionStyles = 'bg-gradient-to-r from-pink-100 to-purple-100 border-pink-400 text-purple-950 font-semibold shadow-md';
                  } else if (isAnswerSubmitted) {
                    if (isSelected) {
                      optionStyles = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold shadow-md';
                    } else {
                      optionStyles = 'bg-white/40 text-gray-400 border-gray-100 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      disabled={isAnswerSubmitted}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between text-sm sm:text-base cursor-pointer ${optionStyles}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-pink-500 text-white' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {option.id}
                        </span>
                        <span>{option.text}</span>
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Answer Feedback once submitted */}
              {isAnswerSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 text-purple-950 text-xs sm:text-sm"
                >
                  <p className="font-semibold text-pink-700 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Our Bond Verdict 🐼:
                  </p>
                  <p>{currentQuestion.explanation}</p>
                </motion.div>
              )}

              {/* Buttons Row: Submit Answer OR Next Question */}
              <div className="mt-6 flex justify-end">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedOptionId}
                    className={`px-6 py-3 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                      selectedOptionId
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/30 hover:brightness-105 active:scale-95 cursor-pointer'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Submit Answer</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/30 hover:brightness-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <span>{currentIndex < totalQuestions - 1 ? 'Next Question' : 'See Final Score 🏆'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </motion.div>
          </AnimatePresence>

        </div>
      ) : (
        /* QUIZ COMPLETION RESULT SCREEN */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/90 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 text-white mb-4 shadow-lg shadow-pink-500/30">
            <Award className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold tracking-widest uppercase text-pink-600">
            {resultTier.badge}
          </span>

          <h3 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-1">
            {resultTier.title}
          </h3>
          <p className="text-xs sm:text-sm text-purple-700 italic font-semibold mb-6">
            {resultTier.subtitle}
          </p>

          {/* Score Circle */}
          <div className="inline-flex items-center justify-center p-6 rounded-full bg-pink-50 border-2 border-pink-200 mb-6 shadow-inner">
            <div className="text-center">
              <span className="font-serif-title text-4xl sm:text-5xl font-extrabold text-pink-600">
                {score}
              </span>
              <span className="text-lg text-purple-400 font-bold"> / {totalQuestions}</span>
              <p className="text-[10px] text-purple-600 uppercase tracking-widest font-semibold mt-1">
                Bond Accuracy
              </p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-md mx-auto mb-6">
            {resultTier.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRestartQuiz}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-purple-800 font-semibold text-xs border border-purple-200 hover:bg-purple-50 transition-colors shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Automatic Changing Photo Slideshow */}
      <div className="mt-8">
        <PhotoSlideshow
          photos={photosConfig.quiz.slideshow}
          intervalMs={3500}
          tilt={-1}
          size="w-56 sm:w-64"
        />
      </div>

      {/* LOCKED/UNLOCKED STEP-BY-STEP NEXT BUTTON */}
      <SectionNextButton
        currentSection={4}
        isCompleted={isCompleted}
        incompleteHint={incompleteHint}
        onNext={onNext}
      />

    </div>
  );
}
