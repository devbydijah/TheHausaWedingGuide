/**
 * ProgressRing Component
 *
 * SVG-based circular progress indicator with percentage label
 *
 * @param {number} percentage - Progress value (0-100)
 * @param {number} size - Ring diameter in pixels (default: 120)
 * @param {number} strokeWidth - Ring thickness (default: 8)
 * @param {string} color - Primary color for progress arc (default: #740015)
 * @param {string} backgroundColor - Background ring color (default: #e5e7eb)
 * @param {boolean} showLabel - Display percentage text (default: true)
 * @param {string} label - Optional label below percentage
 * @param {boolean} darkMode - Enable dark mode styling
 */
export default function ProgressRing({
  percentage = 0,
  size = 120,
  strokeWidth = 8,
  color = "#740015",
  backgroundColor = "#e5e7eb",
  showLabel = true,
  label = "",
  darkMode = false,
}) {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  // Calculate SVG circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedPercentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={darkMode ? "#374151" : backgroundColor}
            strokeWidth={strokeWidth}
          />

          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Percentage Label */}
        {showLabel && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {Math.round(clampedPercentage)}%
            </span>
            {label && (
              <span
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {label}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
