/**
 * Card Component
 *
 * Reusable container with shadow and hover effects
 *
 * @param {Object} props
 * @param {string} props.title - Optional card title
 * @param {string} props.subtitle - Optional subtitle
 * @param {React.ReactNode} props.children - Card content
 * @param {boolean} props.hoverable - Enable hover effects
 * @param {string} props.className - Additional CSS classes
 */
export default function Card({
  title,
  subtitle,
  children,
  hoverable = false,
  className = "",
  ...props
}) {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800 
        rounded-xl shadow-md 
        p-6
        transition-all duration-300
        ${hoverable ? "hover:shadow-xl hover:scale-105 cursor-pointer" : ""}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="font-playfair text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="font-inter text-sm text-gray-600 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="font-inter text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </div>
  );
}
