import React from "react";

/**
 * Reusable loading spinner component
 * Used for async operations like authentication, data fetching, cloud sync
 *
 * @param {Object} props
 * @param {string} props.size - Size variant: 'sm' | 'md' | 'lg' (default: 'md')
 * @param {string} props.color - Color variant: 'primary' | 'white' | 'accent' (default: 'primary')
 * @param {string} props.className - Additional Tailwind classes
 */
export default function Spinner({
  size = "md",
  color = "primary",
  className = "",
}) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const colorClasses = {
    primary: "border-[#CE805C] border-t-transparent",
    white: "border-white border-t-transparent",
    accent: "border-[#990200] border-t-transparent",
  };

  return (
    <div
      className={`
        inline-block 
        rounded-full 
        animate-spin
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
