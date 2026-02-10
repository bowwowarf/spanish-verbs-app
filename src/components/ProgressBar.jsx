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
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {label}
            </span>
          )}
          {showFraction && (
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {current} / {total}
            </span>
          )}
        </div>
      )}
      <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
