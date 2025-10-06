/**
 * Button Component
 *
 * Standardized button with variant support and accessibility features
 *
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'danger' | 'ghost'} props.variant - Button style variant
 * @param {'sm' | 'md' | 'lg'} props.size - Button size
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.isLoading - Shows loading spinner
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 */
export default function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  className = "",
  type = "button",
  onClick,
  children,
  ...props
}) {
  const baseClasses =
    "font-inter font-medium rounded-lg transition-all focus:ring-4 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-[#990200] to-[#531946] text-white hover:shadow-lg hover:scale-105 focus:ring-[#CE805C]/50",
    secondary:
      "bg-white text-[#531946] border-2 border-[#531946] hover:bg-[#531946] hover:text-white focus:ring-[#531946]/50",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50",
    ghost:
      "bg-transparent text-[#531946] hover:bg-[#531946]/10 focus:ring-[#531946]/30",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}
