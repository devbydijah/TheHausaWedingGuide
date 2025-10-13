import { motion } from "framer-motion";
import {
  CheckCircle,
  TrendingUp,
  Warning as WarningIcon,
} from "@mui/icons-material";

/**
 * Enhanced ProgressRing Component
 *
 * SVG-based circular progress indicator with status indicators,
 * dynamic colors, and accessibility improvements
 *
 * @param {number} percentage - Progress percentage (0-100)
 * @param {number} size - Size of the circle in pixels
 * @param {string} color - Primary color for progress (overridden by health logic)
 * @param {number} strokeWidth - Width of the progress stroke
 * @param {boolean} showLabel - Whether to display percentage label
 * @param {boolean} darkMode - Dark mode styling
 * @param {boolean} showStatus - Whether to show status indicator
 */
export default function ProgressRing({
  percentage = 0,
  size = 120,
  color = "#CE805C",
  strokeWidth = 8,
  showLabel = true,
  darkMode = false,
  showStatus = true,
}) {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedPercentage / 100) * circumference;

  // Dynamic color based on completion health
  const getProgressColor = () => {
    if (clampedPercentage >= 90) return "#57886C"; // Excellent - Sage Green
    if (clampedPercentage >= 70) return "#CE805C"; // Good - Terracotta
    if (clampedPercentage >= 40) return "#B87050"; // Fair - Dark Terracotta
    return "#740015"; // Needs Work - Burgundy
  };

  // Status indicator
  const getStatusIndicator = () => {
    if (clampedPercentage >= 90) {
      return {
        icon: <CheckCircle sx={{ fontSize: 20 }} />,
        label: "Excellent Progress!",
        color: "#57886C",
        bgColor: darkMode
          ? "rgba(87, 136, 108, 0.15)"
          : "rgba(87, 136, 108, 0.15)",
      };
    } else if (clampedPercentage >= 70) {
      return {
        icon: <TrendingUp sx={{ fontSize: 20 }} />,
        label: "Good Progress",
        color: "#CE805C",
        bgColor: darkMode
          ? "rgba(206, 128, 92, 0.15)"
          : "rgba(206, 128, 92, 0.15)",
      };
    } else {
      return {
        icon: <WarningIcon sx={{ fontSize: 20 }} />,
        label: "Keep Going!",
        color: "#740015",
        bgColor: darkMode ? "rgba(116, 0, 21, 0.15)" : "rgba(116, 0, 21, 0.15)",
      };
    }
  };

  const progressColor = getProgressColor();
  const status = getStatusIndicator();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="relative inline-flex flex-col items-center gap-3"
    >
      {/* Progress Ring */}
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          role="img"
          aria-label={`Overall progress: ${Math.round(clampedPercentage)}%`}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={darkMode ? "rgba(255, 255, 255, 0.1)" : "#e5e7eb"}
            strokeWidth={strokeWidth}
          />

          {/* Progress circle with animation */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Gradient definition for shimmer effect */}
          <defs>
            <linearGradient
              id="shimmer-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={progressColor} stopOpacity="0.8" />
              <stop offset="50%" stopColor={progressColor} stopOpacity="1" />
              <stop offset="100%" stopColor={progressColor} stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center label with enhanced typography */}
        {showLabel && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="text-center">
              <span
                className={`text-3xl font-black ${darkMode ? "text-white" : "text-gray-900"}`}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: progressColor,
                }}
              >
                {Math.round(clampedPercentage)}
              </span>
              <span
                className={`text-lg font-bold ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                %
              </span>
            </div>
          </motion.div>
        )}

        {/* Animated pulse ring for excellent progress */}
        {clampedPercentage >= 90 && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 pointer-events-none"
            style={{ borderColor: `${progressColor}40` }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>

      {/* Status Indicator */}
      {showStatus && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: status.bgColor }}
        >
          <span style={{ color: status.color }}>{status.icon}</span>
          <span
            className={`text-xs font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
            style={{ color: status.color }}
          >
            {status.label}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
