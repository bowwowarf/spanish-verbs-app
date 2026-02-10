import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import FlashCard from '../components/FlashCard';
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

export default function Section4_Translation() {
  const { state, dispatch } = useApp();
  const { known, review } = state.section4;

  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Initialize deck
  useEffect(() => {
    const initialDeck = shuffleArray(sentences.map(s => s.id));
    setDeck(initialDeck);
  }, []);

  // Get current sentence from deck
  const currentSentenceId = deck[0];
  const currentSentence = useMemo(() => {
    return sentences.find(s => s.id === currentSentenceId);
  }, [currentSentenceId]);

  const handleKnow = () => {
    if (currentSentenceId) {
      dispatch({ type: 'SECTION4_MARK_KNOWN', payload: currentSentenceId });
      // Remove from deck
      setDeck(prev => prev.slice(1));
    }
  };

  const handleReview = () => {
    if (currentSentenceId) {
      dispatch({ type: 'SECTION4_MARK_REVIEW', payload: currentSentenceId });
      // Move to random position in deck
      setDeck(prev => {
        const remaining = prev.slice(1);
        const randomIndex = Math.floor(Math.random() * (remaining.length + 1));
        return [
          ...remaining.slice(0, randomIndex),
          currentSentenceId,
          ...remaining.slice(randomIndex)
        ];
      });
    }
  };

  const handleRestart = () => {
    dispatch({ type: 'SECTION4_RESET' });
    const newDeck = shuffleArray(sentences.map(s => s.id));
    setDeck(newDeck);
    setCurrentIndex(0);
  };

  // Calculate stats
  const total = sentences.length;
  const completed = known.length;
  const remaining = deck.length;
  const reviewCount = review.length;

  // Check if completed
  if (deck.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
            Congratulations!
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            You've completed all {total} translation cards!
            {reviewCount > 0 && (
              <span className="block mt-2">
                You marked {reviewCount} sentences for review.
              </span>
            )}
          </p>
          <Button onClick={handleRestart} size="lg">
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
          English to Spanish
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Translate the English sentence to Spanish
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8 space-y-4">
        <ProgressBar
          current={completed}
          total={total}
          label="Progress"
        />
        <div className="flex gap-4 text-sm">
          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
            {completed} known
          </span>
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full">
            {remaining} remaining
          </span>
          {reviewCount > 0 && (
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
              {reviewCount} to review
            </span>
          )}
        </div>
      </div>

      {/* Flashcard */}
      {currentSentence && (
        <FlashCard
          front={
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-500 mb-4">
                Translate to Spanish
              </p>
              <p className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
                {currentSentence.english}
              </p>
            </div>
          }
          back={
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-red-200 mb-4">
                Spanish Translation
              </p>
              <p className="text-2xl font-semibold">
                {currentSentence.spanish}
              </p>
            </div>
          }
          onKnow={handleKnow}
          onReview={handleReview}
        />
      )}

      {/* Restart button */}
      <div className="mt-8 flex justify-center">
        <Button variant="ghost" onClick={handleRestart}>
          Restart Section
        </Button>
      </div>
    </div>
  );
}
