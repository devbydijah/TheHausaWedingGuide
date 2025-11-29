import {
  createContext,
  useContext,
  useState,
  useEffect,
  lazy,
  Suspense,
} from "react";
import {
  SignOutIcon,
  MoonIcon,
  SunIcon,
  ListIcon,
  X,
} from "@phosphor-icons/react";
import { useSyncToCloud } from "../hooks/useSyncToCloud";
import { Toast, Spinner } from "./ui";
import Modal from "./ui/Modal";
import { DEFAULT_GUIDE } from "../lib/constants";
import normalizeGuideData from "../lib/normalizeGuideData";
import texts from "../lib/northern-general-text";

// Feature Components - Lazy loaded for better code splitting
import { Dashboard } from "../features/dashboard";
const VisionQuiz = lazy(() => import("../features/vision-quiz/VisionQuiz"));
const VisionPlanner = lazy(() => import("../features/vision/VisionPlanner"));
const BudgetBuilder = lazy(() => import("../features/budget/BudgetBuilder"));
const VendorTracker = lazy(() => import("../features/vendors/VendorTracker"));
const TimelineManager = lazy(
  () => import("../features/timeline/TimelineManager")
);
const FinalBlueprint = lazy(
  () => import("../features/blueprint/FinalBlueprint")
);

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <Spinner size="lg" className="mx-auto mb-4" />
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

// Feature skeleton loader for better UX
const FeatureSkeleton = ({ darkMode }) => (
  <div
    className={`space-y-6 p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"} rounded-lg animate-pulse`}
  >
    <div
      className={`h-8 ${darkMode ? "bg-gray-800" : "bg-gray-200"} rounded w-1/3`}
    ></div>
    <div
      className={`h-4 ${darkMode ? "bg-gray-800" : "bg-gray-200"} rounded w-2/3`}
    ></div>
    <div className="space-y-3">
      <div
        className={`h-32 ${darkMode ? "bg-gray-800" : "bg-gray-200"} rounded`}
      ></div>
      <div
        className={`h-32 ${darkMode ? "bg-gray-800" : "bg-gray-200"} rounded`}
      ></div>
      <div
        className={`h-32 ${darkMode ? "bg-gray-800" : "bg-gray-200"} rounded`}
      ></div>
    </div>
  </div>
);

/**
 * InteractiveGuide Component
 *
 * Main orchestration component for the wedding planning application
 * Manages global state, navigation, and feature routing
 *
 * Refactored: Sprint 2 - Reduced from 3753 lines to ~400 lines
 */
export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export default function InteractiveGuide({
  onLogout,
  accessStatus,
  userEmail,
  user,
  userData,
}) {
  // Cloud sync hook - replaces localStorage-only approach
  const {
    data: cloudData,
    updateData: setCloudData,
    syncStatus,
    lastSynced,
    lastError,
    retrySync,
    isCloudEnabled,
  } = useSyncToCloud(user?.email || userEmail, DEFAULT_GUIDE);

  // Load and normalize data
  const [data, setData] = useState(() => {
    const raw = localStorage.getItem("weddingGuideData");
    return normalizeGuideData(raw ? JSON.parse(raw) : {});
  });

  // Example: updateData helper
  const updateData = (patch) => {
    setData((prev) => {
      const updated = { ...prev, ...patch };
      localStorage.setItem("weddingGuideData", JSON.stringify(updated));
      return updated;
    });
  };

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("hwg:darkMode");
    return saved === "true";
  });
  const [toasts, setToasts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showSaveAnimation, setShowSaveAnimation] = useState(false); // For save feedback

  // Toast notification system
  const showToast = (message, type = "success") => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Watch sync status and show toast
  useEffect(() => {
    // Disabled: Don't show toast for auto-save to reduce notification noise
    // if (syncStatus === "success" && lastSynced) {
    //   showToast("Changes saved", "success");
    // } else if (syncStatus === "error") {
    if (syncStatus === "error" && lastError) {
      showToast(lastError.message, "error");
    }
  }, [syncStatus, lastSynced, lastError]);

  // Subtle save animation when sync succeeds
  useEffect(() => {
    if (syncStatus === "success" && lastSynced) {
      setShowSaveAnimation(true);
      // Reset animation after 2 seconds
      const timer = setTimeout(() => {
        setShowSaveAnimation(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [syncStatus, lastSynced]);

  // Network status detection - auto-retry when back online
  useEffect(() => {
    const handleOnline = async () => {
      if (syncStatus === "error" || syncStatus === "offline") {
        showToast("Connection restored! Syncing...", "info");
        const success = await retrySync();
        if (success) {
          showToast("Successfully synced your data!", "success");
        }
      }
    };

    const handleOffline = () => {
      showToast("You're offline. Data will sync when reconnected.", "warning");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [syncStatus, retrySync]);

  // Dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("hwg:darkMode", newValue.toString());
      return newValue;
    });
    // Removed toast notification for dark mode toggle to reduce noise
  };

  // Logout handler with confirmation
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    if (onLogout) {
      onLogout();
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Helper function for explicit save confirmations
  const showSaveConfirmation = (message = "Changes saved successfully!") => {
    showToast(message, "success");
    setShowSaveAnimation(true);
    setTimeout(() => {
      setShowSaveAnimation(false);
    }, 2000);
  };

  // ===== DATA UPDATE HANDLERS =====

  // Vision Quiz handlers
  const updateQuizAnswer = (questionId, answer) => {
    updateData((prev) => ({
      ...prev,
      visionQuiz: {
        ...prev.visionQuiz,
        answers: { ...prev.visionQuiz.answers, [questionId]: answer },
      },
    }));
  };

  const submitQuiz = (result) => {
    updateData((prev) => ({
      ...prev,
      visionQuiz: { ...prev.visionQuiz, result },
    }));
    // Show explicit confirmation for quiz completion
    showSaveConfirmation("Quiz results saved! Your wedding vision is ready.");
  };

  const resetQuiz = () => {
    if (
      !confirm(
        "Are you sure you want to retake the quiz? This will reset your answers."
      )
    )
      return;
    updateData((prev) => ({
      ...prev,
      visionQuiz: { answers: {}, result: null },
    }));
  };

  // Vision & Values handlers
  const updatePriorities = (priorities) =>
    updateData((p) => ({ ...p, weddingPriorities: priorities }));

  const updateField = (field, value) =>
    updateData((p) => ({ ...p, [field]: value }));

  // Budget Builder handlers
  const updateTotalBudget = (newTotal) => {
    updateData((prev) => {
      const total = parseFloat(newTotal) || 0;
      const updatedCategories = {};
      Object.keys(prev.budgetCategories).forEach((key) => {
        const cat = prev.budgetCategories[key];
        updatedCategories[key] = {
          percentage: cat.percentage,
          amount: (cat.percentage / 100) * total,
        };
      });
      return {
        ...prev,
        totalBudget: total,
        budgetCategories: updatedCategories,
      };
    });
  };

  const updateCategoryField = (categoryKey, field, value) => {
    updateData((prev) => {
      const numValue = parseFloat(value) || 0;
      const category = { ...prev.budgetCategories[categoryKey] };

      if (field === "percentage") {
        category.percentage = Math.max(0, Math.min(100, numValue));
        category.amount = (category.percentage / 100) * prev.totalBudget;
      } else {
        category.amount = Math.max(0, numValue);
        category.percentage = prev.totalBudget
          ? (category.amount / prev.totalBudget) * 100
          : 0;
      }

      return {
        ...prev,
        budgetCategories: {
          ...prev.budgetCategories,
          [categoryKey]: category,
        },
      };
    });
  };

  // Vendor Tracker handlers
  const addVendor = (vendor) => {
    updateData((prev) => ({
      ...prev,
      vendorList: [
        ...prev.vendorList,
        { ...vendor, id: Date.now().toString(), addedDate: Date.now() },
      ],
    }));
  };

  const updateVendor = (id, updatedFields) => {
    updateData((prev) => ({
      ...prev,
      vendorList: prev.vendorList.map((vendor) =>
        vendor.id === id ? { ...vendor, ...updatedFields } : vendor
      ),
    }));
  };

  const deleteVendor = (id) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;
    updateData((prev) => ({
      ...prev,
      vendorList: prev.vendorList.filter((vendor) => vendor.id !== id),
    }));
  };

  // Timeline & Task Manager handlers
  const updateWeddingDate = (date) => {
    updateData((prev) => ({ ...prev, weddingDate: date }));
  };

  const addTask = (task) => {
    updateData((prev) => ({
      ...prev,
      taskList: [
        ...prev.taskList,
        { ...task, id: Date.now().toString(), createdAt: Date.now() },
      ],
    }));
  };

  const updateTask = (id, updatedFields) => {
    updateData((prev) => ({
      ...prev,
      taskList: prev.taskList.map((task) =>
        task.id === id ? { ...task, ...updatedFields } : task
      ),
    }));
  };

  const deleteTask = (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    updateData((prev) => ({
      ...prev,
      taskList: prev.taskList.filter((task) => task.id !== id),
    }));
  };

  const toggleShowCompleted = () => {
    updateData((prev) => ({
      ...prev,
      showCompletedTasks: !prev.showCompletedTasks,
    }));
  };

  // Legacy checklist handlers (for backward compatibility)
  const toggle = (sectionId, itemId) => {
    updateData((prev) => ({
      ...prev,
      checklists: prev.checklists.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              items: sec.items.map((it) =>
                it.id === itemId ? { ...it, done: !it.done } : it
              ),
            }
          : sec
      ),
    }));
  };

  const updateNotes = (value) => updateData((p) => ({ ...p, notes: value }));

  // Navigation sections
  const sections = [
    { id: "dashboard", name: "Dashboard" },
    { id: "quiz", name: "Vision Quiz" },
    { id: "vision", name: "Vision & Values" },
    { id: "budget", name: "Budget Builder" },
    { id: "vendors", name: "Vendor Tracker" },
    { id: "timeline", name: "Timeline & Tasks" },
    { id: "blueprint", name: "Final Blueprint" },
  ];

  return (
    <AppContext.Provider
      value={{
        data,
        updateData,
        texts,
        showToast,
        showSaveConfirmation,
        syncStatus,
        lastSynced,
        darkMode,
        // darkMode, activeSection, syncStatus, toasts, etc.
      }}
    >
      <div
        className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        {/* Toast Notifications */}
        <Toast toasts={toasts} onRemove={removeToast} />

        {/* Header with navigation */}
        <header
          className={`${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} sticky top-0 z-50 border-b shadow-sm backdrop-blur-sm bg-opacity-95`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Bar */}
            <div className="flex items-center justify-between h-16">
              {/* Logo/Title */}
              <div className="flex items-center gap-3">
                <img
                  src="/logowhite.svg"
                  alt="Hausa Room Logo"
                  className="w-10 h-10 sm:w-12 sm:h-12"
                />
                <div className="hidden sm:block">
                  <h1
                    className={`font-playfair text-lg sm:text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Wedding Planner
                  </h1>
                  <p
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Your Planning Dashboard
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Sync Status */}
                {isCloudEnabled && (
                  <div
                    className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                      showSaveAnimation
                        ? "ring-2 ring-green-500 ring-opacity-50"
                        : ""
                    } ${
                      syncStatus === "error"
                        ? darkMode
                          ? "bg-red-900/30 border border-red-700"
                          : "bg-red-50 border border-red-200"
                        : showSaveAnimation
                          ? darkMode
                            ? "bg-green-900/20 border border-green-700"
                            : "bg-green-50 border border-green-200"
                          : darkMode
                            ? "bg-gray-800"
                            : "bg-gray-100"
                    }`}
                    title={
                      syncStatus === "success" && lastSynced
                        ? `Last saved: ${new Date(lastSynced).toLocaleTimeString()}`
                        : syncStatus === "offline"
                          ? "Working offline - will sync when reconnected"
                          : syncStatus === "error" && lastError
                            ? lastError.message
                            : ""
                    }
                  >
                    {/* Animated checkmark on successful save */}
                    {showSaveAnimation && (
                      <svg
                        className="w-4 h-4 text-green-500 animate-bounce"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}

                    {/* Status indicator dot */}
                    {!showSaveAnimation && (
                      <div
                        className={`w-2 h-2 rounded-full ${
                          syncStatus === "syncing"
                            ? "bg-yellow-500 animate-pulse"
                            : syncStatus === "success"
                              ? "bg-green-500"
                              : syncStatus === "offline"
                                ? "bg-gray-400"
                                : "bg-red-500"
                        }`}
                      />
                    )}

                    <span
                      className={`text-xs font-medium ${
                        syncStatus === "error"
                          ? darkMode
                            ? "text-red-300"
                            : "text-red-700"
                          : showSaveAnimation
                            ? darkMode
                              ? "text-green-300"
                              : "text-green-700"
                            : darkMode
                              ? "text-gray-300"
                              : "text-gray-700"
                      }`}
                    >
                      {syncStatus === "syncing" && "Syncing..."}
                      {syncStatus === "success" &&
                        (showSaveAnimation ? "Saved!" : "Saved")}
                      {syncStatus === "offline" && "Offline"}
                      {syncStatus === "error" && "Error"}
                      {syncStatus === "idle" && "Ready"}
                    </span>

                    {/* Timestamp display for successful saves */}
                    {syncStatus === "success" &&
                      lastSynced &&
                      !showSaveAnimation && (
                        <span
                          className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {new Date(lastSynced).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}

                    {/* Retry Button for Errors */}
                    {syncStatus === "error" && (
                      <button
                        onClick={async () => {
                          const success = await retrySync();
                          if (success) {
                            showToast("Successfully synced!", "success");
                          } else {
                            showToast(
                              "Retry failed. Will try again later.",
                              "error"
                            );
                          }
                        }}
                        className={`ml-1 px-2 py-0.5 text-xs rounded transition-all ${
                          darkMode
                            ? "bg-red-700 hover:bg-red-600 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                        title="Retry syncing to cloud"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                )}

                {/* Offline Mode Banner */}
                {!isCloudEnabled && (
                  <div
                    className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                      darkMode
                        ? "bg-yellow-900/30 border border-yellow-700"
                        : "bg-yellow-50 border border-yellow-200"
                    }`}
                    title="Data is saved locally and will sync when you're back online"
                  >
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span
                      className={`text-xs font-medium ${darkMode ? "text-yellow-300" : "text-yellow-700"}`}
                    >
                      Working Offline
                    </span>
                  </div>
                )}

                {/* Dark Mode Toggle - Always Visible */}
                <button
                  onClick={toggleDarkMode}
                  className={`p-2.5 rounded-lg transition-all ${
                    darkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  aria-label={
                    darkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                  title={darkMode ? "Light mode" : "Dark mode"}
                >
                  {darkMode ? (
                    <SunIcon size={20} weight="duotone" />
                  ) : (
                    <MoonIcon size={20} weight="duotone" />
                  )}
                </button>

                {/* Logout Button - Desktop Only (≥1024px) */}
                <button
                  onClick={handleLogout}
                  className={`!hidden lg:!flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    darkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  aria-label="Logout from wedding planner"
                >
                  <SignOutIcon size={20} weight="bold" aria-hidden="true" />
                  <span className="text-sm">Logout</span>
                </button>

                {/* Mobile Menu Toggle - Mobile/Tablet Only (<1024px) */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`lg:!hidden p-2.5 rounded-lg transition-all ${
                    darkMode
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  aria-label="Toggle menu"
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? (
                    <X size={24} weight="bold" />
                  ) : (
                    <ListIcon size={24} weight="bold" />
                  )}
                </button>
              </div>
            </div>

            {/* Navigation Tabs - Desktop Only (≥1024px) */}
            <nav
              className="!hidden lg:!flex gap-2 pb-3 overflow-x-auto scrollbar-hide"
              role="navigation"
              aria-label="Main sections"
            >
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-[#740015] to-[#531946] text-white shadow-md"
                      : darkMode
                        ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  aria-current={
                    activeSection === section.id ? "page" : undefined
                  }
                >
                  {section.name}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* Mobile Menu Slide-out Panel - Mobile/Tablet Only (<1024px) */}
        <div
          className={`fixed top-0 right-0 h-screen w-72 shadow-2xl z-[80] lg:!hidden transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="px-4 py-6 space-y-3">
            {/* Sync Status - Mobile */}
            {(isCloudEnabled || !isCloudEnabled) && (
              <div
                className={`px-4 py-3 rounded-lg mb-4 transition-all ${
                  showSaveAnimation && isCloudEnabled
                    ? "ring-2 ring-green-500 ring-opacity-50"
                    : ""
                } ${
                  isCloudEnabled
                    ? syncStatus === "error"
                      ? darkMode
                        ? "bg-red-900/30 border border-red-700"
                        : "bg-red-50 border border-red-200"
                      : showSaveAnimation
                        ? darkMode
                          ? "bg-green-900/20 border border-green-700"
                          : "bg-green-50 border border-green-200"
                        : darkMode
                          ? "bg-gray-700"
                          : "bg-gray-100"
                    : darkMode
                      ? "bg-yellow-900/30 border border-yellow-700"
                      : "bg-yellow-50 border border-yellow-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Animated checkmark on successful save */}
                    {showSaveAnimation && isCloudEnabled && (
                      <svg
                        className="w-4 h-4 text-green-500 animate-bounce"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}

                    {/* Status indicator dot */}
                    {!(showSaveAnimation && isCloudEnabled) && (
                      <div
                        className={`w-2 h-2 rounded-full ${
                          !isCloudEnabled
                            ? "bg-yellow-500"
                            : syncStatus === "syncing"
                              ? "bg-yellow-500 animate-pulse"
                              : syncStatus === "success"
                                ? "bg-green-500"
                                : syncStatus === "offline"
                                  ? "bg-gray-400"
                                  : syncStatus === "error"
                                    ? "bg-red-500"
                                    : "bg-blue-500"
                        }`}
                      />
                    )}

                    <span
                      className={`text-xs font-medium ${
                        !isCloudEnabled
                          ? darkMode
                            ? "text-yellow-300"
                            : "text-yellow-700"
                          : syncStatus === "error"
                            ? darkMode
                              ? "text-red-300"
                              : "text-red-700"
                            : showSaveAnimation
                              ? darkMode
                                ? "text-green-300"
                                : "text-green-700"
                              : darkMode
                                ? "text-gray-300"
                                : "text-gray-700"
                      }`}
                    >
                      {!isCloudEnabled && "Working Offline"}
                      {isCloudEnabled &&
                        syncStatus === "syncing" &&
                        "Syncing..."}
                      {isCloudEnabled &&
                        syncStatus === "success" &&
                        (showSaveAnimation ? "Saved!" : "Saved")}
                      {isCloudEnabled && syncStatus === "offline" && "Offline"}
                      {isCloudEnabled && syncStatus === "error" && "Error"}
                      {isCloudEnabled && syncStatus === "idle" && "Ready"}
                    </span>
                  </div>

                  {/* Retry Button for Errors */}
                  {isCloudEnabled && syncStatus === "error" && (
                    <button
                      onClick={async () => {
                        const success = await retrySync();
                        if (success) {
                          showToast("Successfully synced!", "success");
                        } else {
                          showToast(
                            "Retry failed. Will try again later.",
                            "error"
                          );
                        }
                      }}
                      className={`px-3 py-1 text-xs rounded transition-all ${
                        darkMode
                          ? "bg-red-700 hover:bg-red-600 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      Retry
                    </button>
                  )}
                </div>
                {isCloudEnabled && syncStatus === "success" && lastSynced && (
                  <p
                    className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Last saved: {new Date(lastSynced).toLocaleTimeString()}
                  </p>
                )}
                {isCloudEnabled && syncStatus === "error" && lastError && (
                  <p
                    className={`text-xs mt-2 ${darkMode ? "text-red-300" : "text-red-600"}`}
                  >
                    {lastError.message}
                  </p>
                )}
                {!isCloudEnabled && (
                  <p
                    className={`text-xs mt-1 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}
                  >
                    Data saved locally, will sync when online
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pb-4 border-b border-gray-200 dark:border-gray-700">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {darkMode ? (
                  <SunIcon size={20} weight="duotone" />
                ) : (
                  <MoonIcon size={20} weight="duotone" />
                )}
                <span className="text-sm">
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </span>
              </button>

              {/* Logout */}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <SignOutIcon size={20} weight="bold" />
                <span className="text-sm">Logout</span>
              </button>
            </div>

            {/* Navigation Sections */}
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-[#740015] to-[#531946] text-white shadow-lg"
                      : darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {section.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {activeSection === "dashboard" && (
            <Dashboard
              data={data}
              setActiveSection={setActiveSection}
              darkMode={darkMode}
            />
          )}

          <Suspense fallback={<FeatureSkeleton darkMode={darkMode} />}>
            {activeSection === "quiz" && (
              <VisionQuiz
                data={data}
                updateQuizAnswer={updateQuizAnswer}
                submitQuiz={submitQuiz}
                resetQuiz={resetQuiz}
                setActiveSection={setActiveSection}
                darkMode={darkMode}
              />
            )}
          </Suspense>

          <Suspense fallback={<FeatureSkeleton darkMode={darkMode} />}>
            {activeSection === "vision" && (
              <VisionPlanner
                data={data}
                updatePriorities={updatePriorities}
                updateField={updateField}
                setActiveSection={setActiveSection}
              />
            )}
          </Suspense>

          <Suspense fallback={<FeatureSkeleton darkMode={darkMode} />}>
            {activeSection === "budget" && (
              <BudgetBuilder
                data={data}
                updateTotalBudget={updateTotalBudget}
                updateCategoryField={updateCategoryField}
                setActiveSection={setActiveSection}
              />
            )}
          </Suspense>

          <Suspense fallback={<FeatureSkeleton darkMode={darkMode} />}>
            {activeSection === "vendors" && (
              <VendorTracker
                data={data}
                addVendor={addVendor}
                updateVendor={updateVendor}
                deleteVendor={deleteVendor}
                setActiveSection={setActiveSection}
              />
            )}
          </Suspense>

          <Suspense fallback={<FeatureSkeleton darkMode={darkMode} />}>
            {activeSection === "timeline" && (
              <TimelineManager
                data={data}
                addTask={addTask}
                updateTask={updateTask}
                deleteTask={deleteTask}
                updateWeddingDate={updateWeddingDate}
                toggleShowCompleted={toggleShowCompleted}
                setActiveSection={setActiveSection}
              />
            )}
          </Suspense>

          <Suspense fallback={<FeatureSkeleton darkMode={darkMode} />}>
            {activeSection === "blueprint" && (
              <FinalBlueprint
                data={data}
                setActiveSection={setActiveSection}
                userData={userData}
                userEmail={user?.email || userEmail}
                darkMode={darkMode}
              />
            )}
          </Suspense>
        </main>

        {/* Logout Confirmation Modal */}
        <Modal
          isOpen={showLogoutModal}
          onClose={cancelLogout}
          title="Logout"
          size="sm"
        >
          <div className="space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#990200] to-[#531946] flex items-center justify-center">
                <SignOutIcon size={32} weight="bold" className="text-white" />
              </div>
            </div>

            {/* Message */}
            <div className="text-center space-y-2">
              <h3
                className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                Ready to go?
              </h3>
              <p
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Don't worry, all your wedding plans are safely saved and will be
                here when you return.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={cancelLogout}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Stay
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#990200] to-[#531946] text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </AppContext.Provider>
  );
}
