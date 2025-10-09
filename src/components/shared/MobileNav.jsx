import { useEffect } from "react";
import {
  Sun,
  Moon,
  DownloadSimple,
  UploadSimple,
  SignOut,
} from "@phosphor-icons/react";

/**
 * MobileNav Component
 *
 * Responsive hamburger menu for mobile devices
 * Slides in from the right with overlay
 * Includes navigation sections and action buttons
 *
 * @param {boolean} isOpen - Whether menu is visible
 * @param {function} onClose - Close handler
 * @param {Array} sections - Navigation sections
 * @param {string} activeSection - Currently active section
 * @param {function} onSectionChange - Section change handler
 * @param {boolean} darkMode - Dark mode state
 * @param {function} toggleDarkMode - Toggle dark mode
 * @param {function} exportData - Export data handler
 * @param {function} importData - Import data handler
 * @param {function} handleLogout - Logout handler
 */
export default function MobileNav({
  isOpen,
  onClose,
  sections,
  activeSection,
  onSectionChange,
  darkMode,
  toggleDarkMode,
  exportData,
  importData,
  handleLogout,
}) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {/* Backdrop/Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close menu"
      />

      {/* Drawer/Sidebar */}
      <div className="absolute top-0 right-0 h-full w-72 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-playfair text-xl font-bold text-gray-900 dark:text-white">
            Menu
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-[#531946]/50 focus:outline-none"
            aria-label="Close navigation menu"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-2 border-b border-gray-200 dark:border-gray-700">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => {
              toggleDarkMode();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <Sun size={20} weight="duotone" />
            ) : (
              <Moon size={20} weight="duotone" />
            )}
            <span className="text-sm">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>

          {/* Export */}
          <button
            onClick={() => {
              exportData();
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-[#CE805C]"
                : "bg-[#CE805C]/10 hover:bg-[#CE805C]/20 text-[#740015]"
            }`}
            aria-label="Export wedding planning data to JSON file"
          >
            <DownloadSimple size={20} weight="bold" />
            <span className="text-sm">Export Data</span>
          </button>

          {/* Import */}
          <button
            onClick={() => {
              importData();
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-[#CE805C]"
                : "bg-[#CE805C]/10 hover:bg-[#CE805C]/20 text-[#740015]"
            }`}
            aria-label="Import wedding planning data from JSON file"
          >
            <UploadSimple size={20} weight="bold" />
            <span className="text-sm">Import Data</span>
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              handleLogout();
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            aria-label="Logout from wedding planner"
          >
            <SignOut size={20} weight="bold" />
            <span className="text-sm">Logout</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav
          className="flex-1 p-4 space-y-2 overflow-y-auto"
          role="navigation"
          aria-label="Main navigation"
        >
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                onSectionChange(section.id);
                onClose();
              }}
              className={`
                w-full text-left px-4 py-3 rounded-lg font-medium font-inter
                transition-all duration-200
                focus:ring-2 focus:ring-[#531946]/50 focus:outline-none
                ${
                  activeSection === section.id
                    ? "bg-gradient-to-r from-[#740015] to-[#531946] text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }
              `}
              aria-current={activeSection === section.id ? "page" : undefined}
            >
              {section.name}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <p className="font-inter text-xs text-gray-500 dark:text-gray-400 text-center">
            Hausa Wedding Guide
          </p>
        </div>
      </div>
    </div>
  );
}
