import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import sentences from '../data/sentences.json';

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const QUIZ_SIZE = 200;

export default function Section3_FillBlank() {
  const { state, dispatch } = useApp();
  const { attempts, correct, currentIndex } = state.section3;

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [shuffledSentences, setShuffledSentences] = useState([]);

  // Shuffle and pick random sentences on mount
  useEffect(() => {
    const shuffled = shuffleArray(sentences).slice(0, QUIZ_SIZE);
    setShuffledSentences(shuffled);
    dispatch({ type: 'SECTION3_RESET' });
  }, [dispatch]);

  // Get current sentence
  const currentSentence = shuffledSentences[currentIndex];

  // Create shuffled options for current question
  const options = useMemo(() => {
    if (!currentSentence) return [];
    const allOptions = [currentSentence.correct_answer, ...currentSentence.distractors];
    return shuffleArray(allOptions);
  }, [currentSentence]);

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    setShowFeedback(true);

    const isCorrect = answer === currentSentence.correct_answer;
    dispatch({
      type: 'SECTION3_ANSWER',
      payload: { questionId: currentSentence.id, isCorrect }
    });
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    dispatch({ type: 'SECTION3_NEXT' });
  };

  const handleRestart = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    const shuffled = shuffleArray(sentences).slice(0, QUIZ_SIZE);
    setShuffledSentences(shuffled);
    dispatch({ type: 'SECTION3_RESET' });
  };

  // Calculate stats
  const total = shuffledSentences.length;
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

  // Check if quiz is complete
  if (currentIndex >= total && total > 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            Quiz Complete!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            You answered {correct} out of {attempts} questions correctly.
          </p>
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6">
            {accuracy}%
          </div>
          <Button onClick={handleRestart} size="lg">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!currentSentence) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <p className="text-slate-600 dark:text-slate-400">Loading sentences...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Fill in the Blank
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Choose the correct verb form to complete the sentence
        </p>
      </div>

      {/* Progress and Score */}
      <div className="mb-6 space-y-4">
        <ProgressBar
          current={currentIndex + 1}
          total={total}
          label="Progress"
        />
        <div className="flex gap-4 text-sm">
          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
            {correct} correct
          </span>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
            {accuracy}% accuracy
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 mb-6">
        {/* English sentence */}
        <p className="text-slate-500 dark:text-slate-400 mb-4 text-lg">
          {currentSentence.english}
        </p>

        {/* Spanish sentence with blank */}
        <p className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-8">
          {currentSentence.blank_sentence.split('_____').map((part, index, arr) => (
            <span key={index}>
              {part}
              {index < arr.length - 1 && (
                <span className={`inline-block min-w-[120px] mx-1 px-4 py-1 rounded-lg border-2 border-dashed ${
                  showFeedback
                    ? selectedAnswer === currentSentence.correct_answer
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                      : 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400'
                    : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {showFeedback ? currentSentence.correct_answer : '?'}
                </span>
              )}
            </span>
          ))}
        </p>

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-4">
          {options.map((option, index) => {
            let buttonClass = 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600';

            if (showFeedback) {
              if (option === currentSentence.correct_answer) {
                buttonClass = 'bg-emerald-500 text-white';
              } else if (option === selectedAnswer) {
                buttonClass = 'bg-red-500 text-white';
              } else {
                buttonClass = 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showFeedback}
                className={`p-4 rounded-xl font-medium text-lg transition-all ${buttonClass} ${
                  showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`mt-6 p-4 rounded-xl ${
            selectedAnswer === currentSentence.correct_answer
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
          }`}>
            {selectedAnswer === currentSentence.correct_answer ? (
              <p className="font-medium">Correct! Well done.</p>
            ) : (
              <p className="font-medium">
                Incorrect. The correct answer is: <strong>{currentSentence.correct_answer}</strong>
              </p>
            )}
            <p className="mt-2 text-sm opacity-80">
              Full sentence: {currentSentence.spanish}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        {showFeedback && (
          <Button onClick={handleNext} size="lg">
            {currentIndex < total - 1 ? 'Next Question' : 'See Results'}
          </Button>
        )}
      </div>

      {/* Restart button */}
      <div className="mt-8 flex justify-center">
        <Button variant="ghost" onClick={handleRestart}>
          Restart Quiz
        </Button>
      </div>
    </div>
  );
}
