export default function ProgressBar({
  current,
  total,
  label,
  showFraction = true,
  className = ''
}) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={`w-full ${className}`}>
      {(label || showFraction) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {label}
            </span>
          )}
          {showFraction && (
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {current} / {total}
            </span>
          )}
        </div>
      )}
      <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
