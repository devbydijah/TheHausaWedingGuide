/**
 * Input Component
 *
 * Standardized form input with label, help text, and validation
 *
 * @param {Object} props
 * @param {string} props.label - Input label text
 * @param {string} props.type - Input type (text, number, date, email, etc.)
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.helpText - Help text below input
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether input is required
 * @param {string} props.className - Additional CSS classes
 */
export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  helpText,
  error,
  required = false,
  disabled = false,
  className = "",
  id,
  ...props
}) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;
  const helpId = `${inputId}-help`;
  const errorId = `${inputId}-error`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium font-inter text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && (
            <span className="text-red-600 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-describedby={helpText ? helpId : error ? errorId : undefined}
        aria-invalid={error ? "true" : "false"}
        className={`
          w-full px-4 py-2 font-inter text-base
          border-2 rounded-lg
          transition-all
          focus:ring-4 focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          dark:bg-gray-800 dark:text-white dark:border-gray-600
          ${
            error
              ? "border-red-500 focus:border-red-600 focus:ring-red-500/50"
              : "border-gray-300 focus:border-[#531946] focus:ring-[#531946]/30"
          }
        `}
        {...props}
      />

      {helpText && !error && (
        <p
          id={helpId}
          className="mt-1 text-sm text-gray-500 dark:text-gray-400"
        >
          {helpText}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="mt-1 text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
