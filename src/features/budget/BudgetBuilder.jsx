import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartPieSlice,
  Warning,
  CheckCircle,
  Info,
  TrendUp,
  Calculator,
  MapPin,
  ForkKnife,
  Dress,
  Camera,
  Sparkle,
  DotsThree,
  List,
  SquaresFour,
  ArrowsClockwise,
} from "@phosphor-icons/react";
// Material UI Icons for enhanced budget features
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  PieChart,
  BarChart,
  Assessment,
  Savings,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  GaugeContainer,
  GaugeReferenceArc,
  GaugeValueArc,
  GaugeValueText,
  useGaugeState,
} from "@mui/x-charts/Gauge";
import { Card, AnimatedCard, GradientHeader } from "../../components/ui";
import { BUDGET_CATEGORIES } from "../../lib/constants";

// Icon mapping for dynamic rendering
const ICON_MAP = {
  MapPin,
  ForkKnife,
  Dress,
  Camera,
  Sparkle,
  Dots: DotsThree,
};

const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Budget Status Indicator Component
const BudgetStatusIndicator = ({ percentage, remaining, darkMode }) => {
  const getStatus = () => {
    if (percentage < 75) {
      return {
        icon: <Savings sx={{ fontSize: 24 }} />,
        label: "Healthy Budget",
        color: "#57886C",
        bgColor: darkMode
          ? "rgba(87, 136, 108, 0.1)"
          : "rgba(87, 136, 108, 0.1)",
      };
    } else if (percentage < 90) {
      return {
        icon: <TrendingUp sx={{ fontSize: 24 }} />,
        label: "Approaching Limit",
        color: "#CE805C",
        bgColor: darkMode
          ? "rgba(206, 128, 92, 0.1)"
          : "rgba(206, 128, 92, 0.1)",
      };
    } else {
      return {
        icon: <WarningIcon sx={{ fontSize: 24 }} />,
        label: "Budget Warning",
        color: "#740015",
        bgColor: darkMode ? "rgba(116, 0, 21, 0.1)" : "rgba(116, 0, 21, 0.1)",
      };
    }
  };

  const status = getStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3 p-3 rounded-xl"
      style={{ backgroundColor: status.bgColor }}
    >
      <div
        className="flex items-center justify-center w-10 h-10 rounded-full"
        style={{ backgroundColor: `${status.color}20` }}
      >
        <span style={{ color: status.color }}>{status.icon}</span>
      </div>
      <div className="flex-1">
        <p
          className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          {status.label}
        </p>
        <p
          className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          {formatNaira(remaining)} remaining
        </p>
      </div>
    </motion.div>
  );
};

// Custom Gauge Pointer using useGaugeState
function GaugePointer({ darkMode }) {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };

  return (
    <g>
      <circle cx={cx} cy={cy} r="8" fill="#740015" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="#740015"
        strokeWidth="3"
      />
    </g>
  );
}

// Enhanced MUI Gauge Wrapper Component - Balanced information display
const MUIGaugeWrapper = ({
  percentage,
  darkMode,
  index,
  categoryAmount = 0,
  categoryLabel = "",
  totalBudget = 0,
}) => {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  // Determine color based on INDIVIDUAL category percentage (not total budget)
  const getGaugeColor = () => {
    if (clampedPercentage === 0) return darkMode ? "#4B5563" : "#9CA3AF"; // Gray for empty
    if (clampedPercentage < 20) return "#57886C"; // Low allocation - Sage Green
    if (clampedPercentage < 35) return "#B87050"; // Moderate - Dark Terracotta
    if (clampedPercentage < 50) return "#CE805C"; // High - Terracotta
    return "#740015"; // Very High - Burgundy
  };

  const gaugeColor = getGaugeColor();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.05 + index * 0.03, type: "spring" }}
      className="flex flex-col items-center w-full"
    >
      {/* Gauge Visualization */}
      <div className="relative">
        <GaugeContainer
          width={130}
          height={130}
          startAngle={-110}
          endAngle={110}
          value={clampedPercentage}
          aria-label={`${categoryLabel} allocation: ${clampedPercentage}%`}
        >
          <GaugeReferenceArc
            style={{
              fill: darkMode
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.08)",
            }}
          />
          <GaugeValueArc
            style={{
              fill: gaugeColor,
            }}
          />
          <GaugeValueText
            style={{
              fontSize: 28,
              fontWeight: "bold",
              fontFamily: "'Playfair Display', serif",
              fill: darkMode ? "#ffffff" : "#1f2937",
            }}
          />
        </GaugeContainer>
      </div>

      {/* Percentage and budget info */}
      {totalBudget > 0 && (
        <div className="text-center mt-2">
          <p
            className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}
          >
            of ₦{totalBudget.toLocaleString()} total
          </p>
        </div>
      )}
    </motion.div>
  );
};

// Chart Component - Custom Radial Gauge (Fallback)
const RadialGauge = ({ percentage, darkMode, icon: Icon, index }) => {
  const angle = (percentage / 100) * 270; // 270 degrees for a more modern 3/4 circle
  const needleRotation = -135 + angle; // Start from bottom-left
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (270 / 360) * circumference; // 3/4 circle
  const strokeDashoffset = arcLength - (percentage / 100) * arcLength;

  return (
    <div className="relative w-36 h-32">
      {/* SVG Gauge */}
      <svg className="w-full h-full" viewBox="0 0 144 128">
        {/* Background Arc (3/4 circle) */}
        <motion.circle
          cx="72"
          cy="80"
          r={radius}
          fill="none"
          stroke={darkMode ? "#1F2937" : "#F3F4F6"}
          strokeWidth="12"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-135 72 80)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Progress Arc with Gradient */}
        <defs>
          <linearGradient
            id={`gauge-gradient-${index}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#740015" />
            <stop offset="50%" stopColor="#CE805C" />
            <stop offset="100%" stopColor="#531946" />
          </linearGradient>
          <filter id={`glow-${index}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.circle
          cx="72"
          cy="80"
          r={radius}
          fill="none"
          stroke={`url(#gauge-gradient-${index})`}
          strokeWidth="12"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-135 72 80)"
          filter={`url(#glow-${index})`}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset }}
          transition={{
            duration: 1.5,
            delay: 0.2 + index * 0.1,
            ease: "easeOut",
          }}
        />

        {/* Tick Marks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const tickAngle = -135 + (tick / 100) * 270;
          const tickRad = (tickAngle * Math.PI) / 180;
          const x1 = 72 + (radius - 8) * Math.cos(tickRad);
          const y1 = 80 + (radius - 8) * Math.sin(tickRad);
          const x2 = 72 + (radius - 2) * Math.cos(tickRad);
          const y2 = 80 + (radius - 2) * Math.sin(tickRad);

          return (
            <motion.line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={darkMode ? "#4B5563" : "#D1D5DB"}
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + tick * 0.01 }}
            />
          );
        })}

        {/* Animated Needle */}
        <motion.g
          initial={{ rotate: -135 }}
          animate={{ rotate: needleRotation }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          style={{ transformOrigin: "72px 80px" }}
        >
          <line
            x1="72"
            y1="80"
            x2="72"
            y2="38"
            stroke="url(#needle-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient
              id="needle-gradient"
              x1="0%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#740015" />
              <stop offset="100%" stopColor="#CE805C" />
            </linearGradient>
          </defs>
          {/* Needle tip */}
          <circle cx="72" cy="38" r="3" fill="#740015" />
        </motion.g>

        {/* Center pivot */}
        <circle
          cx="72"
          cy="80"
          r="6"
          fill={darkMode ? "#1F2937" : "#FFFFFF"}
          stroke="#740015"
          strokeWidth="2"
        />
        <circle cx="72" cy="80" r="3" fill="#740015" />
      </svg>

      {/* Icon Badge */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
        style={{
          background: "linear-gradient(135deg, #740015 0%, #531946 100%)",
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.8, type: "spring" }}
      >
        <Gauge size={24} weight="bold" />
      </motion.div>
    </div>
  );
};

const LiquidFill = ({ percentage, darkMode, icon: Icon }) => {
  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full" viewBox="0 0 112 112">
        {/* Container Circle */}
        <circle
          cx="56"
          cy="56"
          r="52"
          fill="none"
          stroke={darkMode ? "#374151" : "#E5E7EB"}
          strokeWidth="4"
        />
        {/* Liquid Fill */}
        <defs>
          <clipPath id="liquid-clip">
            <circle cx="56" cy="56" r="50" />
          </clipPath>
        </defs>
        <motion.rect
          x="0"
          y="112"
          width="112"
          height="112"
          fill="url(#liquid-gradient)"
          clipPath="url(#liquid-clip)"
          initial={{ y: 112 }}
          animate={{ y: 112 - (percentage / 100) * 112 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        />
        <defs>
          <linearGradient
            id="liquid-gradient"
            x1="0%"
            y1="100%"
            x2="0%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#740015" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#531946" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Wave animation */}
        <motion.path
          d="M 0 56 Q 14 50, 28 56 T 56 56 T 84 56 T 112 56 L 112 112 L 0 112 Z"
          fill="url(#wave-gradient)"
          clipPath="url(#liquid-clip)"
          initial={{ y: 112 }}
          animate={{
            y: 112 - (percentage / 100) * 112,
            d: [
              "M 0 56 Q 14 50, 28 56 T 56 56 T 84 56 T 112 56 L 112 112 L 0 112 Z",
              "M 0 56 Q 14 62, 28 56 T 56 56 T 84 56 T 112 56 L 112 112 L 0 112 Z",
              "M 0 56 Q 14 50, 28 56 T 56 56 T 84 56 T 112 56 L 112 112 L 0 112 Z",
            ],
          }}
          transition={{
            y: { duration: 1.2, delay: 0.2 },
            d: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        <defs>
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#CE805C" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#B87050" stopOpacity="0.7" />
          </linearGradient>
        </defs>
      </svg>

      {/* Icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white backdrop-blur-sm"
          style={{
            background:
              "linear-gradient(135deg, rgba(116, 0, 21, 0.9) 0%, rgba(83, 25, 70, 0.9) 100%)",
          }}
        >
          <Icon size={24} weight="bold" />
        </div>
      </div>
    </div>
  );
};

const HexagonProgress = ({ percentage, darkMode, icon: Icon }) => {
  const points = "56,8 100,28 100,68 56,88 12,68 12,28";
  const pathLength = 240;

  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full" viewBox="0 0 112 96">
        {/* Background Hexagon */}
        <polygon
          points={points}
          fill="none"
          stroke={darkMode ? "#374151" : "#E5E7EB"}
          strokeWidth="6"
        />
        {/* Progress Hexagon */}
        <motion.polygon
          points={points}
          fill="none"
          stroke="url(#hex-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          }}
          animate={{
            strokeDashoffset: pathLength - (percentage / 100) * pathLength,
          }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <defs>
          <linearGradient id="hex-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#740015" />
            <stop offset="100%" stopColor="#531946" />
          </linearGradient>
        </defs>
      </svg>

      {/* Icon in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white"
          style={{
            background: "linear-gradient(135deg, #740015 0%, #531946 100%)",
          }}
        >
          <Icon size={28} weight="bold" />
        </div>
      </div>
    </div>
  );
};

const RingSegments = ({ percentage, darkMode, icon: Icon }) => {
  const circumference = 2 * Math.PI * 40;

  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full transform -rotate-90">
        {/* Outer ring background */}
        <circle
          cx="56"
          cy="56"
          r="40"
          stroke={darkMode ? "#374151" : "#E5E7EB"}
          strokeWidth="12"
          fill="none"
        />
        {/* Outer ring progress */}
        <motion.circle
          cx="56"
          cy="56"
          r="40"
          stroke="url(#ring-gradient)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          initial={{
            strokeDasharray: circumference,
            strokeDashoffset: circumference,
          }}
          animate={{
            strokeDashoffset:
              circumference - (percentage / 100) * circumference,
          }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <defs>
          <linearGradient
            id="ring-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#740015" />
            <stop offset="50%" stopColor="#CE805C" />
            <stop offset="100%" stopColor="#531946" />
          </linearGradient>
        </defs>
      </svg>

      {/* Icon in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white"
          style={{
            background: "linear-gradient(135deg, #740015 0%, #531946 100%)",
          }}
        >
          <Icon size={32} weight="bold" />
        </div>
      </div>
    </div>
  );
};

const VerticalThermometer = ({ percentage, darkMode, icon: Icon }) => {
  return (
    <div className="relative w-24 h-28 flex flex-col items-center">
      {/* Thermometer body */}
      <div
        className={`relative w-8 h-20 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"} overflow-hidden`}
      >
        {/* Fill */}
        <motion.div
          className="absolute bottom-0 w-full rounded-full"
          style={{
            background: "linear-gradient(to top, #740015 0%, #CE805C 100%)",
          }}
          initial={{ height: 0 }}
          animate={{ height: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />

        {/* Markers */}
        <div className="absolute inset-0 flex flex-col justify-between py-2">
          {[100, 75, 50, 25, 0].map((mark) => (
            <div key={mark} className="w-full h-px bg-white/30" />
          ))}
        </div>
      </div>

      {/* Bulb at bottom */}
      <div
        className="mt-1 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
        style={{
          background: "linear-gradient(135deg, #740015 0%, #531946 100%)",
        }}
      >
        <Icon size={24} weight="bold" />
      </div>
    </div>
  );
};

const CircularProgress = ({ percentage, darkMode, icon: Icon, index }) => {
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative">
      <svg className="w-28 h-28 transform -rotate-90">
        <circle
          cx="56"
          cy="56"
          r="36"
          stroke={darkMode ? "#374151" : "#E5E7EB"}
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx="56"
          cy="56"
          r="36"
          stroke="url(#circular-gradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
          strokeDasharray={circumference}
        />
        <defs>
          <linearGradient
            id="circular-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#740015" />
            <stop offset="100%" stopColor="#531946" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white"
          style={{
            background: "linear-gradient(135deg, #740015 0%, #531946 100%)",
          }}
        >
          <Icon size={28} weight="bold" />
        </div>
      </div>
    </div>
  );
};

/**
 * BudgetBuilder Component
 *
 * Comprehensive budget planning with visual charts, sliders, and real-time calculations
 */
export default function BudgetBuilder({
  data,
  updateTotalBudget,
  updateCategoryField,
  setActiveSection,
  darkMode,
}) {
  const [showChart, setShowChart] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const totalBudgetInputRef = useRef(null);

  const totalBudget = data?.totalBudget || 0;
  const categories = data?.budgetCategories || {};

  // Calculate total percentage and amounts with memoization
  const budgetStats = useMemo(() => {
    const categoryKeys = Object.keys(BUDGET_CATEGORIES);

    let totalPercentage = 0;
    let totalAllocated = 0;
    let categoryStats = [];

    categoryKeys.forEach((key) => {
      const category = categories[key] || { percentage: 0, amount: 0 };
      const percentage = parseFloat(category.percentage) || 0;
      const amount = parseFloat(category.amount) || 0;

      totalPercentage += percentage;
      totalAllocated += amount;

      categoryStats.push({
        key,
        label: BUDGET_CATEGORIES[key].label,
        icon: BUDGET_CATEGORIES[key].icon,
        percentage,
        amount,
      });
    });

    const remainingPercentage = 100 - totalPercentage;
    const remainingAmount = totalBudget - totalAllocated;
    const isOverBudget = totalPercentage > 100;
    const isFullyAllocated = totalPercentage === 100;
    const isUnderAllocated = totalPercentage < 100 && totalPercentage > 0;

    return {
      totalPercentage,
      totalAllocated,
      remainingPercentage,
      remainingAmount,
      isOverBudget,
      isFullyAllocated,
      isUnderAllocated,
      categoryStats,
    };
  }, [categories, totalBudget]);

  // Update percentage and sync amount
  const handlePercentageChange = useCallback(
    (categoryKey, newPercentage) => {
      const percentage = parseFloat(newPercentage) || 0;
      const amount = totalBudget ? (percentage / 100) * totalBudget : 0;

      updateCategoryField(categoryKey, "percentage", percentage);
      updateCategoryField(categoryKey, "amount", Math.round(amount));
    },
    [totalBudget, updateCategoryField]
  );

  // Update amount and sync percentage
  const handleAmountChange = useCallback(
    (categoryKey, newAmount) => {
      const amount = parseFloat(newAmount) || 0;
      const percentage = totalBudget ? (amount / totalBudget) * 100 : 0;

      updateCategoryField(categoryKey, "amount", amount);
      updateCategoryField(
        categoryKey,
        "percentage",
        Math.round(percentage * 10) / 10
      );
    },
    [totalBudget, updateCategoryField]
  );

  // Apply suggested percentages
  const applySuggestedPercentages = () => {
    if (!totalBudget) {
      alert("Please set your total budget first!");
      return;
    }

    Object.keys(BUDGET_CATEGORIES).forEach((key) => {
      const defaultPercentage = BUDGET_CATEGORIES[key].defaultPercentage;
      handlePercentageChange(key, defaultPercentage);
    });
  };

  // Clear all allocations
  const clearAllocations = () => {
    if (
      window.confirm("Are you sure you want to clear all budget allocations?")
    ) {
      Object.keys(BUDGET_CATEGORIES).forEach((key) => {
        updateCategoryField(key, "percentage", 0);
        updateCategoryField(key, "amount", 0);
      });
    }
  };

  // Get status color for percentage
  const getPercentageColor = (percentage) => {
    if (percentage === 0) return darkMode ? "text-gray-400" : "text-gray-500";
    if (percentage < 10) return "text-blue-600 dark:text-blue-400";
    if (percentage < 20) return "text-green-600 dark:text-green-400";
    if (percentage < 30) return "text-yellow-600 dark:text-yellow-400";
    if (percentage < 40) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <GradientHeader
        icon={Calculator}
        title="Budget Builder"
        subtitle="Plan and track your wedding expenses"
        gradientFrom="#740015"
        gradientTo="#531946"
        iconSize={56}
      />

      {/* Total Budget Input */}
      <Card className="!p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <label
              htmlFor="total-budget"
              className={`block text-sm font-semibold mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Total Wedding Budget
            </label>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                ₦
              </span>
              <input
                ref={totalBudgetInputRef}
                type="number"
                id="total-budget"
                value={totalBudget || ""}
                onChange={(e) =>
                  updateTotalBudget(parseFloat(e.target.value) || 0)
                }
                min="0"
                step="10000"
                className={`flex-1 text-3xl font-bold px-4 py-2 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="0"
                aria-label="Total wedding budget in Naira"
              />
            </div>
          </div>
        </div>

        {totalBudget > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={applySuggestedPercentages}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Calculator size={16} weight="bold" />
              Apply Suggested
            </button>
            <button
              onClick={clearAllocations}
              className="text-sm text-red-600 dark:text-red-400 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2"
            >
              Clear All
            </button>
            <div className="flex-1" />
            <button
              onClick={() => setShowChart(!showChart)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                showChart
                  ? "bg-[#CE805C] text-white"
                  : darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              <ChartPieSlice size={16} weight="bold" />
              {showChart ? "Hide" : "Show"} Chart
            </button>
          </div>
        )}
      </Card>

      {/* Budget Status Alert */}
      {totalBudget > 0 && budgetStats.totalPercentage > 0 && (
        <Card className="!p-0 w-full">
          <div
            role="status"
            aria-live="polite"
            className={`rounded-xl p-5 border-2 w-full ${
              budgetStats.isOverBudget
                ? "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700"
                : budgetStats.isFullyAllocated
                  ? "border-[#740015] dark:border-[#CE805C]"
                  : budgetStats.remainingPercentage < 10
                    ? "bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700"
                    : "bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700"
            }`}
            style={
              budgetStats.isFullyAllocated
                ? {
                    background:
                      "linear-gradient(135deg, rgba(116, 0, 21, 0.1) 0%, rgba(83, 25, 70, 0.1) 100%)",
                  }
                : {}
            }
          >
            <div className="flex items-start gap-4 w-full">
              <motion.div
                animate={
                  budgetStats.isOverBudget
                    ? { rotate: [0, -5, 5, -5, 5, 0] }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                {budgetStats.isOverBudget ? (
                  <Warning
                    size={32}
                    weight="bold"
                    className="text-red-600 dark:text-red-400 flex-shrink-0"
                  />
                ) : budgetStats.isFullyAllocated ? (
                  <CheckCircle
                    size={32}
                    weight="fill"
                    className="text-[#740015] dark:text-[#CE805C] flex-shrink-0"
                  />
                ) : budgetStats.remainingPercentage < 10 ? (
                  <Info
                    size={32}
                    weight="bold"
                    className="text-yellow-600 dark:text-yellow-400 flex-shrink-0"
                  />
                ) : (
                  <TrendUp
                    size={32}
                    weight="bold"
                    className="text-blue-600 dark:text-blue-400 flex-shrink-0"
                  />
                )}
              </motion.div>

              <div className="flex-1">
                <p
                  className={`font-bold mb-2 text-lg ${
                    budgetStats.isOverBudget
                      ? "text-red-700 dark:text-red-400"
                      : budgetStats.isFullyAllocated
                        ? "text-[#740015] dark:text-[#CE805C]"
                        : budgetStats.remainingPercentage < 10
                          ? "text-yellow-700 dark:text-yellow-400"
                          : "text-blue-700 dark:text-blue-400"
                  }`}
                >
                  {budgetStats.isOverBudget
                    ? "Over Budget Warning!"
                    : budgetStats.isFullyAllocated
                      ? "Budget Fully Allocated"
                      : budgetStats.remainingPercentage < 10
                        ? "Almost Fully Allocated"
                        : "Budget In Progress"}
                </p>
                <p
                  className={`text-sm leading-relaxed ${
                    budgetStats.isOverBudget
                      ? "text-red-600 dark:text-red-300"
                      : budgetStats.isFullyAllocated
                        ? "text-[#740015] dark:text-[#CE805C]"
                        : budgetStats.remainingPercentage < 10
                          ? "text-yellow-600 dark:text-yellow-300"
                          : "text-blue-600 dark:text-blue-300"
                  }`}
                >
                  {budgetStats.isOverBudget ? (
                    <>
                      Total allocated: {budgetStats.totalPercentage.toFixed(1)}%
                      (
                      <span className="font-bold">
                        {(budgetStats.totalPercentage - 100).toFixed(1)}% over
                      </span>
                      ) • ₦{budgetStats.totalAllocated.toLocaleString()} (
                      <span className="font-bold">
                        ₦
                        {(
                          budgetStats.totalAllocated - totalBudget
                        ).toLocaleString()}{" "}
                        over budget
                      </span>
                      )
                    </>
                  ) : budgetStats.isFullyAllocated ? (
                    <>
                      Perfect! All 100% of your budget is allocated (₦
                      {budgetStats.totalAllocated.toLocaleString()})
                    </>
                  ) : (
                    <>
                      Remaining: {budgetStats.remainingPercentage.toFixed(1)}% •
                      ₦{budgetStats.remainingAmount.toLocaleString()} left to
                      allocate
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Visual Chart */}
      {totalBudget > 0 && showChart && budgetStats.totalPercentage > 0 && (
        <Card className="!p-6 w-full">
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`font-playfair text-xl sm:text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Budget Distribution
            </h2>

            {/* View Toggle */}
            <div
              className={`flex items-center gap-1 p-1 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "text-white"
                    : darkMode
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-600 hover:text-gray-900"
                }`}
                style={
                  viewMode === "grid"
                    ? {
                        background:
                          "linear-gradient(135deg, #740015 0%, #531946 100%)",
                      }
                    : {}
                }
                title="Grid view"
              >
                <SquaresFour size={20} weight="bold" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list"
                    ? "text-white"
                    : darkMode
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-600 hover:text-gray-900"
                }`}
                style={
                  viewMode === "list"
                    ? {
                        background:
                          "linear-gradient(135deg, #740015 0%, #531946 100%)",
                      }
                    : {}
                }
                title="List view"
              >
                <List size={20} weight="bold" />
              </motion.button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {budgetStats.categoryStats.map((cat, index) => {
                  if (cat.percentage === 0) return null;

                  const IconComponent = ICON_MAP[cat.icon] || DotsThree;

                  // Get color for this category
                  const categoryColor =
                    cat.percentage === 0
                      ? darkMode
                        ? "#4B5563"
                        : "#9CA3AF"
                      : cat.percentage < 20
                        ? "#57886C"
                        : cat.percentage < 35
                          ? "#B87050"
                          : cat.percentage < 50
                            ? "#CE805C"
                            : "#740015";

                  return (
                    <motion.div
                      key={cat.key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.08 }}
                      className={`aspect-square p-6 rounded-2xl border-2 transition-all hover:shadow-lg flex flex-col ${
                        darkMode
                          ? "bg-gray-800/50 border-gray-700 hover:border-[#CE805C]"
                          : "bg-white border-gray-200 hover:border-[#CE805C] shadow-sm"
                      }`}
                    >
                      {/* Icon Badge */}
                      <div className="flex justify-center mb-2">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
                          style={{
                            background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`,
                          }}
                        >
                          <IconComponent size={24} weight="duotone" />
                        </div>
                      </div>

                      {/* Chart Display */}
                      <div className="flex items-center justify-center flex-1">
                        <MUIGaugeWrapper
                          percentage={cat.percentage}
                          darkMode={darkMode}
                          index={index}
                          categoryAmount={cat.amount}
                          categoryLabel={cat.label}
                          totalBudget={totalBudget}
                        />
                      </div>

                      {/* Category Info */}
                      <div className="text-center space-y-1.5 mt-3">
                        <h3
                          className={`font-bold text-lg ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {cat.label}
                        </h3>
                        <p
                          className="text-2xl font-bold"
                          style={{ color: categoryColor }}
                        >
                          {cat.percentage.toFixed(1)}%
                        </p>
                        <div
                          className={`pt-2 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                        >
                          <p
                            className={`text-xs font-medium mb-1 ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Allocated Amount
                          </p>
                          <p
                            className={`text-lg font-bold ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            ₦{cat.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {budgetStats.categoryStats.map((cat, index) => {
                  if (cat.percentage === 0) return null;

                  const IconComponent = ICON_MAP[cat.icon] || DotsThree;

                  return (
                    <motion.div
                      key={cat.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-sm font-medium flex items-center gap-2 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                            style={{
                              background:
                                "linear-gradient(135deg, #740015 0%, #531946 100%)",
                            }}
                          >
                            <IconComponent size={16} weight="bold" />
                          </div>
                          {cat.label}
                        </span>
                        <span
                          className={`text-sm font-bold ${getPercentageColor(
                            cat.percentage
                          )}`}
                        >
                          {cat.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div
                        className={`w-full rounded-full h-8 overflow-hidden relative ${
                          darkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(cat.percentage, 100)}%`,
                          }}
                          transition={{ duration: 1, delay: index * 0.05 }}
                          className="h-full flex items-center justify-end pr-3"
                          style={{
                            background:
                              "linear-gradient(90deg, #CE805C 0%, #B87050 100%)",
                          }}
                        >
                          {cat.percentage >= 15 && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 + index * 0.05 }}
                              className="text-xs font-bold text-white"
                            >
                              ₦{cat.amount.toLocaleString()}
                            </motion.span>
                          )}
                        </motion.div>
                        {cat.percentage < 15 && cat.percentage > 0 && (
                          <span
                            className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            ₦{cat.amount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      )}

      {/* Category Allocations */}
      <Card className="!p-6 w-full">
        <h2
          className={`font-playfair text-xl sm:text-2xl font-bold mb-6 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Budget Categories
        </h2>

        {!totalBudget && (
          <div className="text-center py-8">
            <Info
              size={48}
              className={`mx-auto mb-3 ${
                darkMode ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <p
              className={`font-inter ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Set your total budget above to start allocating funds
            </p>
          </div>
        )}

        {/* Grid Layout for Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Object.keys(BUDGET_CATEGORIES).map((categoryKey, index) => {
            const category = BUDGET_CATEGORIES[categoryKey];
            const values = categories[categoryKey] || {
              percentage: 0,
              amount: 0,
            };
            const IconComponent = ICON_MAP[category.icon] || DotsThree;

            return (
              <motion.div
                key={categoryKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700 hover:border-[#CE805C]/50"
                    : "bg-gray-50 border-gray-200 hover:border-[#CE805C]/50"
                }`}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #740015 0%, #531946 100%)",
                    }}
                  >
                    <IconComponent size={24} weight="bold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-base ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {category.label}
                    </h3>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Suggested: {category.defaultPercentage}%
                    </p>
                  </div>
                </div>

                {/* Slider */}
                <div className="mb-4">
                  <input
                    type="range"
                    id={`${categoryKey}-slider`}
                    min="0"
                    max="100"
                    step="0.5"
                    value={values.percentage || 0}
                    onChange={(e) =>
                      handlePercentageChange(categoryKey, e.target.value)
                    }
                    disabled={!totalBudget}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer budget-slider"
                    style={{
                      background: `linear-gradient(to right, #CE805C 0%, #CE805C ${values.percentage || 0}%, ${
                        darkMode ? "#374151" : "#E5E7EB"
                      } ${values.percentage || 0}%, ${
                        darkMode ? "#374151" : "#E5E7EB"
                      } 100%)`,
                    }}
                    aria-label={`${category.label} percentage allocation`}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={values.percentage || 0}
                  />
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Percentage Input */}
                  <div>
                    <label
                      htmlFor={`${categoryKey}-percentage`}
                      className={`block text-xs font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Percentage
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        id={`${categoryKey}-percentage`}
                        value={values.percentage || ""}
                        onChange={(e) =>
                          handlePercentageChange(categoryKey, e.target.value)
                        }
                        min="0"
                        max="100"
                        step="0.5"
                        disabled={!totalBudget}
                        className={`w-full px-3 py-2 text-sm rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white disabled:bg-gray-800 disabled:text-gray-500"
                            : "bg-white border-gray-300 text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                        }`}
                        placeholder="0"
                        aria-label={`${category.label} percentage`}
                      />
                      <span
                        className={`text-sm font-semibold ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        %
                      </span>
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label
                      htmlFor={`${categoryKey}-amount`}
                      className={`block text-xs font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Amount
                    </label>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        ₦
                      </span>
                      <input
                        type="number"
                        id={`${categoryKey}-amount`}
                        value={values.amount || ""}
                        onChange={(e) =>
                          handleAmountChange(categoryKey, e.target.value)
                        }
                        min="0"
                        step="1000"
                        disabled={!totalBudget}
                        className={`w-full px-3 py-2 text-sm rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white disabled:bg-gray-800 disabled:text-gray-500"
                            : "bg-white border-gray-300 text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                        }`}
                        placeholder="0"
                        aria-label={`${category.label} amount in Naira`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Custom Slider Styles */}
      <style>{`
        .budget-slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #740015;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: transform 0.15s ease;
        }

        .budget-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          background: #531946;
        }

        .budget-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #740015;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: transform 0.15s ease;
        }

        .budget-slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          background: #531946;
        }

        .budget-slider:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </motion.div>
  );
}
