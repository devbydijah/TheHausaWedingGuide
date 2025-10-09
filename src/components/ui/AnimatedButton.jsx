import { motion } from "framer-motion";

/**
 * AnimatedButton - Reusable button with animations and brand styling
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {function} props.onClick - Click handler
 * @param {string} props.variant - "primary" | "secondary" | "outline"
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.gradientFrom - Primary gradient start color
 * @param {string} props.gradientTo - Primary gradient end color
 * @param {string} props.className - Additional classes
 * @param {React.ReactNode} props.leftIcon - Icon on left side
 * @param {React.ReactNode} props.rightIcon - Icon on right side
 * @param {boolean} props.fullWidth - Full width button
 */
export default function AnimatedButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  gradientFrom = "#740015",
  gradientTo = "#531946",
  className = "",
  leftIcon,
  rightIcon,
  fullWidth = false,
  ...props
}) {
  const baseClasses =
    "px-6 py-3 rounded-xl font-semibold text-base transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 flex items-center justify-center gap-2";

  const variantClasses = {
    primary: disabled
      ? "bg-gray-400 text-white cursor-not-allowed opacity-50"
      : "text-white shadow-lg hover:shadow-xl",
    secondary: disabled
      ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
      : "bg-gradient-to-r from-[#CE805C] to-[#B87050] text-white shadow-lg hover:shadow-xl",
    outline: disabled
      ? "border-2 border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
      : "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700",
  };

  const motionProps = disabled
    ? {}
    : {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
      };

  const buttonStyle =
    variant === "primary" && !disabled
      ? {
          background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
        }
      : {};

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...motionProps}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      style={buttonStyle}
      {...props}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </motion.button>
  );
}
