import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import verbs from '../data/verbs.json';
import sentences from '../data/sentences.json';

const sections = [
  {
    to: '/section1',
    title: 'Verb Meanings',
    description: 'Learn the English meaning of each Spanish verb',
    icon: CardIcon,
    color: 'bg-blue-500'
  },
  {
    to: '/section2',
    title: 'Conjugations',
    description: 'Study verb conjugations across all 11 tenses',
    icon: TableIcon,
    color: 'bg-purple-500'
  },
  {
    to: '/section3',
    title: 'Fill in the Blank',
    description: 'Test your knowledge with multiple choice questions',
    icon: QuizIcon,
    color: 'bg-amber-500'
  },
  {
    to: '/section4',
    title: 'Translations',
    description: 'Practice translating English sentences to Spanish',
    icon: TranslateIcon,
    color: 'bg-emerald-500'
  },
  {
    to: '/section5',
    title: 'Custom Cards',
    description: 'Create your own vocabulary flashcards',
    icon: PlusIcon,
    color: 'bg-rose-500'
  }
];

function CardIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function TableIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function QuizIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function TranslateIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
  );
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

export default function Home() {
  const { state } = useApp();

  // Calculate overall stats
  const totalVerbs = verbs.length;
  const knownVerbs = state.section1.known.length;
  const totalSentences = sentences.length;
  const customCardsCount = state.customCards.length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
          Spanish Verb Mastery
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Learn the 50 most common Latin American Spanish verbs across 11 tenses with interactive flashcards and exercises.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center border border-slate-200 dark:border-slate-700">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalVerbs}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Verbs</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center border border-slate-200 dark:border-slate-700">
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">11</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Tenses</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center border border-slate-200 dark:border-slate-700">
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{totalSentences}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sentences</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center border border-slate-200 dark:border-slate-700">
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{knownVerbs}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Verbs Learned</p>
        </div>
      </div>

      {/* Tenses Covered */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-12 border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
          Tenses Covered
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            'Presente de Indicativo',
            'Futuro Simple',
            'Pretérito Imperfecto',
            'Pretérito Perfecto Simple',
            'Condicional Simple',
            'Presente de Subjuntivo',
            'Imperfecto de Subjuntivo',
            'Imperativo',
            'Participio',
            'Pretérito Perfecto Compuesto',
            'Pretérito Pluscuamperfecto'
          ].map((tense) => (
            <span
              key={tense}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm"
            >
              {tense}
            </span>
          ))}
        </div>
      </div>

      {/* Section Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Learning Sections
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {sections.map((section) => (
            <Link
              key={section.to}
              to={section.to}
              className="group bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${section.color} text-white`}>
                  <section.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {section.description}
                  </p>
                </div>
                <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>
          Focused on Latin American Spanish for intermediate learners.
        </p>
        {customCardsCount > 0 && (
          <p className="mt-2">
            You have {customCardsCount} custom vocabulary card{customCardsCount !== 1 ? 's' : ''}.
          </p>
        )}
      </div>
    </div>
  );
}
