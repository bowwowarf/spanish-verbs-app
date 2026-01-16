import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import FlashCard from '../components/FlashCard';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import verbs from '../data/verbs.json';

export default function Section1_VerbMeaning() {
  const { state, dispatch } = useApp();
  const { deck, known, review, currentIndex } = state.section1;

  // Get current verb from deck
  const currentVerbId = deck[0];
  const currentVerb = useMemo(() => {
    return verbs.find(v => v.id === currentVerbId);
  }, [currentVerbId]);

  const handleKnow = () => {
    if (currentVerbId) {
      dispatch({ type: 'SECTION1_MARK_KNOWN', payload: currentVerbId });
    }
  };

  const handleReview = () => {
    if (currentVerbId) {
      dispatch({ type: 'SECTION1_MARK_REVIEW', payload: currentVerbId });
    }
  };

  const handleRestart = () => {
    dispatch({ type: 'SECTION1_RESET' });
  };

  // Calculate stats
  const total = verbs.length;
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
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            Congratulations!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            You've completed all {total} verb meanings!
            {reviewCount > 0 && (
              <span className="block mt-2">
                You marked {reviewCount} verbs for review.
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
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Verb Meanings
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Learn the English meaning of each Spanish verb
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
          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
            {remaining} remaining
          </span>
          {reviewCount > 0 && (
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
              {reviewCount} to review
            </span>
          )}
        </div>
      </div>

      {/* Flashcard */}
      {currentVerb && (
        <FlashCard
          front={
            <div>
              <p className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                {currentVerb.infinitive}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                (verb)
              </p>
            </div>
          }
          back={
            <div>
              <p className="text-3xl font-bold mb-2">
                {currentVerb.english}
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
