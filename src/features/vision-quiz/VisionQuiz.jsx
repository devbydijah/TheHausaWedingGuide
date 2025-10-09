import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VISION_QUIZ_QUESTIONS } from "../../lib/constants";
import {
  CheckCircle,
  Crown,
  Sparkle,
  Diamond,
  CaretRight,
  CaretLeft,
  ArrowRight,
} from "@phosphor-icons/react";

/**
 * VisionQuiz Component
 *
 * Interactive quiz to discover wedding style (Traditional/Modern/Fusion)
 * Features: Progress navigation, results screen, accessible form controls
 */
export default function VisionQuiz({
  data,
  updateQuizAnswer,
  submitQuiz,
  resetQuiz,
  setActiveSection,
  darkMode,
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const quizContainerRef = useRef(null);

  // Check if quiz is completed
  const hasResult = data?.visionQuiz?.result;
  const answers = data?.visionQuiz?.answers || {};

  // Calculate answered questions
  const answeredQuestions = Object.keys(answers).length;
  const allAnswered = answeredQuestions === VISION_QUIZ_QUESTIONS.length;
  const currentAnswer = answers[VISION_QUIZ_QUESTIONS[currentQuestion]?.id];

  // Auto-scroll to top when question changes (mobile UX)
  useEffect(() => {
    if (quizContainerRef.current) {
      quizContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentQuestion]);

  // Calculate result based on accumulated points
  const calculateResult = () => {
    const scores = { traditional: 0, modern: 0, fusion: 0 };

    VISION_QUIZ_QUESTIONS.forEach((q) => {
      const answer = answers[q.id];
      if (answer) {
        const selectedOption = q.options.find((opt) => opt.value === answer);
        if (selectedOption?.points) {
          scores.traditional += selectedOption.points.traditional || 0;
          scores.modern += selectedOption.points.modern || 0;
          scores.fusion += selectedOption.points.fusion || 0;
        }
      }
    });

    // Determine highest score
    const maxScore = Math.max(scores.traditional, scores.modern, scores.fusion);

    if (scores.traditional === maxScore) return "traditional";
    if (scores.fusion === maxScore) return "fusion";
    return "modern";
  };

  const handleSelectOption = (optionValue) => {
    updateQuizAnswer(VISION_QUIZ_QUESTIONS[currentQuestion].id, optionValue);

    // Auto-navigate to next question after a brief delay
    setTimeout(() => {
      if (currentQuestion < VISION_QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 300); // Small delay for visual feedback
  };

  const handleNext = () => {
    // Only allow progression if current question is answered
    if (!currentAnswer) return;

    if (currentQuestion < VISION_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleJumpToQuestion = (index) => {
    // Only allow jumping to answered questions or the next unanswered question
    const targetQuestion = VISION_QUIZ_QUESTIONS[index];
    const isAnswered = answers[targetQuestion.id] !== undefined;

    // Find first unanswered question
    const firstUnansweredIndex = VISION_QUIZ_QUESTIONS.findIndex(
      (q) => answers[q.id] === undefined
    );

    // Allow jumping if: already answered, or it's the first unanswered question
    if (
      isAnswered ||
      index === firstUnansweredIndex ||
      firstUnansweredIndex === -1
    ) {
      setCurrentQuestion(index);
    }
  };

  const handleFinish = () => {
    const result = calculateResult();
    submitQuiz(result);
  };

  const handleRetake = () => {
    resetQuiz();
    setCurrentQuestion(0);
  };

  // Result configurations
  const resultConfig = {
    traditional: {
      icon: Crown,
      title: "The Traditional Hausa Bride",
      description:
        "You deeply value cultural heritage and want your wedding to honor Hausa customs fully. Your celebration will be rich in tradition, from the Kayan Lefe to traditional attire and ceremonies.",
      recommendations: [
        "Prioritize finding vendors experienced in traditional Hausa weddings",
        "Book traditional musicians and cultural performers",
        "Invest in authentic traditional attire and accessories",
        "Serve a full traditional Hausa menu",
        "Consult with family elders to ensure all customs are honored",
        "Use rich cultural colors and traditional patterns in your decor",
      ],
      nextStep: "budget",
      nextStepText: "Build Your Budget",
      gradientFrom: "#740015",
      gradientTo: "#531946",
    },
    fusion: {
      icon: Sparkle,
      title: "The Modern Fusion Bride",
      description:
        "You beautifully balance tradition with contemporary style. Your wedding will blend the best of both worlds - honoring cultural roots while adding modern touches that reflect your personal taste.",
      recommendations: [
        "Look for vendors who can blend traditional and modern aesthetics",
        "Mix traditional and contemporary entertainment",
        "Plan multiple outfit changes showcasing different styles",
        "Consider fusion menu with traditional dishes in modern presentation",
        "Selectively incorporate key traditions that matter most to you",
        "Use cultural elements presented in a modern aesthetic",
      ],
      nextStep: "vision",
      nextStepText: "Define Your Vision",
      gradientFrom: "#CE805C",
      gradientTo: "#B87050",
    },
    modern: {
      icon: Diamond,
      title: "The Modern Minimalist Bride",
      description:
        "You envision a contemporary, elegant celebration with subtle nods to culture. Your wedding will be refined, minimalist, and reflect modern sensibilities while respecting key traditions.",
      recommendations: [
        "Focus on elegant, minimalist venue and decor",
        "Book contemporary entertainment with selective cultural touches",
        "Choose modern elegant attire with optional traditional accessories",
        "Offer international menu with some Nigerian options",
        "Honor essential religious and family traditions selectively",
        "Use neutral colors and modern design with cultural accents",
      ],
      nextStep: "budget",
      nextStepText: "Plan Your Budget",
      gradientFrom: "#531946",
      gradientTo: "#CE805C",
    },
  };

  const currentResult = hasResult ? resultConfig[hasResult] : null;

  // If quiz completed, show results
  if (hasResult && currentResult) {
    const ResultIcon = currentResult.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
        ref={quizContainerRef}
      >
        {/* Results Header */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${currentResult.gradientFrom} 0%, ${currentResult.gradientTo} 100%)`,
          }}
        >
          {/* Decorative elements */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"
          />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-6 backdrop-blur-sm"
            >
              <ResultIcon size={56} weight="bold" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            >
              {currentResult.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="font-inter text-lg sm:text-xl opacity-95 max-w-2xl mx-auto leading-relaxed"
            >
              {currentResult.description}
            </motion.p>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`rounded-2xl border-2 p-6 sm:p-8 ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className="font-playfair text-2xl sm:text-3xl font-bold mb-6"
            style={{
              background: `linear-gradient(135deg, ${currentResult.gradientFrom} 0%, ${currentResult.gradientTo} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Your Personalized Recommendations
          </h2>

          <ul className="space-y-4" role="list">
            {currentResult.recommendations.map((rec, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                  darkMode
                    ? "bg-gray-700/50 hover:bg-gray-700"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${currentResult.gradientFrom} 0%, ${currentResult.gradientTo} 100%)`,
                  }}
                >
                  <CheckCircle size={16} weight="bold" className="text-white" />
                </div>
                <span
                  className={`font-inter text-sm sm:text-base leading-relaxed ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {rec}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection(currentResult.nextStep)}
            className="flex-1 px-8 py-4 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${currentResult.gradientFrom} 0%, ${currentResult.gradientTo} 100%)`,
            }}
            aria-label={`Continue to ${currentResult.nextStep}`}
          >
            {currentResult.nextStepText}
            <ArrowRight size={20} weight="bold" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRetake}
            className={`px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 ${
              darkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-gray-500"
                : "border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400"
            }`}
            aria-label="Retake the quiz"
          >
            Retake Quiz
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  // Quiz UI
  const question = VISION_QUIZ_QUESTIONS[currentQuestion];
  // Progress based on answered questions, not current position
  const progressPercent = Math.round(
    (answeredQuestions / VISION_QUIZ_QUESTIONS.length) * 100
  );
  const isLastQuestion = currentQuestion === VISION_QUIZ_QUESTIONS.length - 1;
  const canProceed = currentAnswer !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
      ref={quizContainerRef}
    >
      {/* Quiz Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="rounded-3xl p-8 text-white text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #740015 0%, #531946 100%)",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"
        />

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 backdrop-blur-sm"
          >
            <Diamond size={48} weight="bold" />
          </motion.div>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold mb-3">
            Vision Quiz
          </h1>
          <p className="font-inter text-lg opacity-90">
            Discover your wedding style
          </p>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`rounded-2xl border p-6 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            className={`font-inter text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Question {currentQuestion + 1} of {VISION_QUIZ_QUESTIONS.length}
          </span>
          <span className="font-inter text-sm font-bold bg-gradient-to-r from-[#740015] to-[#531946] bg-clip-text text-transparent">
            {progressPercent}% Complete
          </span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #740015 0%, #531946 100%)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`Quiz progress: ${progressPercent} percent complete`}
          />
        </div>

        {/* Interactive Progress Dots */}
        <div
          className="flex gap-2 mt-4 flex-wrap justify-center"
          role="navigation"
          aria-label="Question navigation"
        >
          {VISION_QUIZ_QUESTIONS.map((q, index) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = index === currentQuestion;

            return (
              <motion.button
                key={q.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleJumpToQuestion(index)}
                className={`w-10 h-10 rounded-lg font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isCurrent
                    ? "text-white shadow-lg scale-110 focus:ring-[#740015]"
                    : isAnswered
                      ? darkMode
                        ? "bg-gray-600 text-gray-300 border-2 border-gray-500"
                        : "bg-gray-200 text-gray-600 border-2 border-gray-400"
                      : darkMode
                        ? "bg-gray-700 text-gray-400 border-2 border-gray-600"
                        : "bg-gray-100 text-gray-500 border-2 border-gray-300"
                }`}
                style={
                  isCurrent
                    ? {
                        background:
                          "linear-gradient(135deg, #740015 0%, #531946 100%)",
                      }
                    : {}
                }
                aria-label={`Go to question ${index + 1}${isAnswered ? ", answered" : ""}`}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isAnswered && !isCurrent ? (
                  <CheckCircle size={20} weight="fill" className="mx-auto" />
                ) : (
                  index + 1
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className={`rounded-2xl border-2 p-6 sm:p-8 ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            id={`question-${question.id}`}
            className={`font-playfair text-2xl sm:text-3xl font-bold mb-8 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {question.question}
          </h2>

          {/* Options - Accessible Radio Group */}
          <div
            role="radiogroup"
            aria-labelledby={`question-${question.id}`}
            className="space-y-3"
          >
            {question.options.map((option, index) => {
              const isSelected = currentAnswer === option.value;

              return (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectOption(option.value)}
                  className={`group w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-[#740015] bg-gradient-to-r from-[#740015]/5 to-[#531946]/5 shadow-md"
                      : darkMode
                        ? "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <div className="flex items-center gap-4">
                    {/* Custom Radio - Clean Design */}
                    <div className="flex-shrink-0 relative">
                      <div
                        className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                          isSelected
                            ? "border-[#740015] bg-gradient-to-br from-[#740015] to-[#531946]"
                            : darkMode
                              ? "border-gray-600 group-hover:border-gray-500"
                              : "border-gray-300 group-hover:border-gray-400"
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Option Text - Left Aligned */}
                    <span
                      className={`font-inter text-base leading-relaxed transition-colors ${
                        isSelected
                          ? "font-semibold bg-gradient-to-r from-[#740015] to-[#531946] bg-clip-text text-transparent"
                          : darkMode
                            ? "text-gray-200 group-hover:text-white"
                            : "text-gray-700 group-hover:text-gray-900"
                      }`}
                    >
                      {option.text}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row justify-between gap-3"
      >
        <motion.button
          whileHover={{ scale: currentQuestion > 0 ? 1.02 : 1 }}
          whileTap={{ scale: currentQuestion > 0 ? 0.98 : 1 }}
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all focus:outline-none focus:ring-2 flex items-center justify-center gap-2 ${
            currentQuestion === 0
              ? "opacity-50 cursor-not-allowed border-gray-300 text-gray-400 bg-gray-100"
              : darkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-gray-500/50"
                : "border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400/50"
          }`}
          aria-label="Go to previous question"
        >
          <CaretLeft size={18} weight="bold" />
          Previous
        </motion.button>

        {!isLastQuestion ? (
          <motion.button
            whileHover={{ scale: canProceed ? 1.02 : 1 }}
            whileTap={{ scale: canProceed ? 0.98 : 1 }}
            onClick={handleNext}
            disabled={!canProceed}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all focus:outline-none focus:ring-2 flex items-center justify-center gap-2 ${
              canProceed
                ? "border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400/50"
                : "opacity-50 cursor-not-allowed border-gray-300 text-gray-400 bg-gray-100"
            }`}
            aria-label="Go to next question"
          >
            Next
            <CaretRight size={18} weight="bold" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: allAnswered ? 1.02 : 1 }}
            whileTap={{ scale: allAnswered ? 0.98 : 1 }}
            onClick={handleFinish}
            disabled={!allAnswered}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all focus:outline-none focus:ring-2 flex items-center justify-center gap-2 ${
              allAnswered
                ? "border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400/50"
                : "opacity-50 cursor-not-allowed border-gray-300 text-gray-400 bg-gray-100"
            }`}
            aria-label="Finish quiz and see results"
          >
            Finish Quiz
            <CheckCircle size={18} weight="bold" />
          </motion.button>
        )}
      </motion.div>

      {/* Answer Required Warning */}
      {!canProceed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border-2 ${
            darkMode
              ? "bg-yellow-900/20 border-yellow-700 text-yellow-300"
              : "bg-yellow-50 border-yellow-300 text-yellow-800"
          }`}
        >
          <p className="font-inter text-sm text-center">
            Please select an answer to continue
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
