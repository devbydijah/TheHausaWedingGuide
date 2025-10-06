/**
 * Toast Component
 * 
 * Notification system for success/error/info messages
 * 
 * @param {Object} props
 * @param {Array} props.toasts - Array of toast objects { id, message, type }
 * @param {function} props.onRemove - Remove toast handler
 */
export default function Toast({ toasts = [], onRemove }) {
  if (toasts.length === 0) return null;
  
  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-gray-900',
  };
  
  const typeIcons = {
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  };
  
  return (
    <div
      className="fixed top-20 right-4 z-50 space-y-2"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            ${typeStyles[toast.type] || typeStyles.info}
            px-4 py-3 rounded-lg shadow-lg
            flex items-center gap-3
            animate-fade-in-up
            min-w-[300px] max-w-md
          `}
          role="alert"
        >
          <span className="flex-shrink-0">
            {typeIcons[toast.type] || typeIcons.info}
          </span>
          
          <span className="flex-1 font-inter text-sm font-medium">
            {toast.message}
          </span>
          
          <button
            onClick={() => onRemove(toast.id)}
            className="flex-shrink-0 hover:opacity-75 transition-opacity focus:ring-2 focus:ring-white/50 focus:outline-none rounded p-1"
            aria-label="Dismiss notification"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
