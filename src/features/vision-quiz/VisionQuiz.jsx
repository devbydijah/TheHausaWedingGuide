/**
 * VisionQuiz Component
 * 
 * Interactive quiz to discover wedding style (Traditional/Modern/Fusion)
 * 
 * TODO Sprint 2 Day 3: Extract full quiz logic, Question and Result components
 */
export default function VisionQuiz({ data, updateQuizAnswer, submitQuiz, resetQuiz, setActiveSection }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white text-center">
        <div className="text-6xl mb-4">💎</div>
        <h1 className="font-playfair text-3xl font-bold mb-3">Vision Quiz</h1>
        <p className="font-inter text-lg opacity-90">Discover your wedding style</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 text-center">
        <p className="font-inter text-gray-600 dark:text-gray-400 mb-4">
          Vision Quiz component - Full implementation pending Sprint 2 Day 3
        </p>
        <button
          onClick={() => setActiveSection("dashboard")}
          className="px-6 py-3 bg-gradient-to-r from-[#990200] to-[#531946] text-white rounded-lg hover:shadow-lg transition-all font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
