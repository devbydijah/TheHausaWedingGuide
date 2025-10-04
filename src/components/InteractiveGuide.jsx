import { useMemo, useState } from "react";
import { useLocalProgress } from "../hooks/useLocalProgress";

// Expanded data model matching the full plan
const DEFAULT_GUIDE = {
  // Section 1: Vision & Values
  visionQuiz: {
    answers: {}, // Quiz answers stored as { questionId: selectedOption }
    result: null, // Quiz result/type
  },
  weddingPriorities: [], // Top 5 priorities (array of strings)
  niyyahDua: "", // Personal niyyah and dua text
  brideJournal: "", // Free-form journal notes

  // Section 2: Budget Builder
  totalBudget: 0,
  budgetCategories: {
    venue: { percentage: 0, amount: 0 },
    catering: { percentage: 0, amount: 0 },
    attire: { percentage: 0, amount: 0 },
    photography: { percentage: 0, amount: 0 },
    decor: { percentage: 0, amount: 0 },
    misc: { percentage: 0, amount: 0 },
  },
  vendorQuotes: [], // Array of { vendor, category, quote }

  // Section 3: Vendor Tracker
  vendorList: [], // Array of { name, category, contact, status, notes }

  // Section 4: Timeline & Task Manager
  weddingDate: "", // ISO date string (YYYY-MM-DD)
  taskList: [], // Array of { id, title, category, dueDate, status, priority, notes, createdAt }
  showCompletedTasks: true, // Toggle for showing/hiding completed tasks

  // Section 5: Final Blueprint
  finalChecklist: [], // Master checklist items
  exportReady: false, // Flag for PDF export readiness

  // Legacy MVP checklists (we'll keep these for now)
  checklists: [
    {
      id: "prewedding",
      title: "Pre‑wedding Setup",
      items: [
        { id: "budget", text: "Set total budget", done: false },
        { id: "date", text: "Choose wedding date(s)", done: false },
        { id: "families", text: "Meet families (introduction)", done: false },
        { id: "venue", text: "Shortlist venues (city & village)", done: false },
      ],
    },
    {
      id: "kayan-lefe",
      title: "Kayan Lefe & Gifts",
      items: [
        { id: "cloth", text: "Fabrics & accessories", done: false },
        { id: "jewelry", text: "Jewelry & cosmetics", done: false },
        { id: "household", text: "Household items (starter kit)", done: false },
      ],
    },
    {
      id: "vendors",
      title: "Vendors & Bookings",
      items: [
        { id: "photography", text: "Photography / Videography", done: false },
        { id: "catering", text: "Catering", done: false },
        { id: "music", text: "Music (DJ/Live)", done: false },
        { id: "attire", text: "Attire (Bride/Groom)", done: false },
      ],
    },
  ],
  notes: "",
};

export default function InteractiveGuide({ auth }) {
  const storageKey = useMemo(
    () => `hwg:progress:${auth.email}:${auth.token}`,
    [auth.email, auth.token]
  );

  const [data, setData] = useLocalProgress(storageKey, DEFAULT_GUIDE);
  const [activeSection, setActiveSection] = useState("dashboard"); // Track active section (default to dashboard)
  const [saveStatus, setSaveStatus] = useState(""); // "Saving..." or "Saved"
  const [darkMode, setDarkMode] = useState(() => {
    // Load dark mode preference from localStorage
    const saved = localStorage.getItem("hwg:darkMode");
    return saved === "true";
  });
  const [toasts, setToasts] = useState([]); // Array of toast notifications

  // Toast notification system
  const showToast = (message, type = "success") => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts((prev) => [...prev, toast]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("hwg:darkMode", newValue.toString());
      return newValue;
    });
    showToast(darkMode ? "Light mode enabled" : "Dark mode enabled", "info");
  };

  // Export data to JSON file
  const exportData = () => {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `hausa-wedding-guide-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Data exported successfully!", "success");
    } catch (error) {
      console.error("Export failed:", error);
      showToast("Failed to export data", "error");
    }
  };

  // Import data from JSON file
  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);

          // Validate the data has expected structure
          if (typeof importedData === "object" && importedData !== null) {
            setData(importedData);
            showToast("Data imported successfully!", "success");
          } else {
            showToast("Invalid data format", "error");
          }
        } catch (error) {
          console.error("Import failed:", error);
          showToast("Failed to import data - invalid JSON", "error");
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };

  // Wrapper to show save feedback with toast
  const updateData = (updater) => {
    setData(updater);
    showToast("Changes saved", "success");
  };

  // Legacy checklist toggle (keeping for backward compatibility)
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

  // Vision & Values handlers
  const updatePriorities = (priorities) =>
    updateData((p) => ({ ...p, weddingPriorities: priorities }));

  const updateNiyyah = (value) =>
    updateData((p) => ({ ...p, niyyahDua: value }));

  const updateJournal = (value) =>
    updateData((p) => ({ ...p, brideJournal: value }));

  const addPriority = (priority) => {
    if (data.weddingPriorities.length >= 5) return; // Max 5
    updatePriorities([...data.weddingPriorities, priority]);
  };

  const removePriority = (index) => {
    updatePriorities(data.weddingPriorities.filter((_, i) => i !== index));
  };

  // Budget Builder handlers
  const updateTotalBudget = (newTotal) => {
    updateData((prev) => {
      const total = parseFloat(newTotal) || 0;
      // When total changes, recalculate all amounts based on existing percentages
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
        // User entered percentage, calculate amount
        category.percentage = Math.max(0, Math.min(100, numValue)); // Clamp 0-100
        category.amount = (category.percentage / 100) * prev.totalBudget;
      } else {
        // User entered amount, calculate percentage
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
        {
          ...vendor,
          id: Date.now().toString(), // Simple unique ID
          addedDate: Date.now(),
        },
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
  const setWeddingDate = (date) => {
    updateData((prev) => ({
      ...prev,
      weddingDate: date,
    }));
  };

  const addTask = (task) => {
    updateData((prev) => ({
      ...prev,
      taskList: [
        ...prev.taskList,
        {
          ...task,
          id: Date.now().toString(),
          createdAt: Date.now(),
        },
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

  // Vision Quiz handlers
  const updateQuizAnswer = (questionId, answer) => {
    updateData((prev) => ({
      ...prev,
      visionQuiz: {
        ...prev.visionQuiz,
        answers: {
          ...prev.visionQuiz.answers,
          [questionId]: answer,
        },
      },
    }));
  };

  const submitQuiz = (result) => {
    updateData((prev) => ({
      ...prev,
      visionQuiz: {
        ...prev.visionQuiz,
        result,
      },
    }));
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
      visionQuiz: {
        answers: {},
        result: null,
      },
    }));
  };

  const completed = data.checklists.reduce(
    (acc, s) => acc + s.items.filter((i) => i.done).length,
    0
  );
  const total = data.checklists.reduce((acc, s) => acc + s.items.length, 0);
  const pct = Math.round((completed / Math.max(1, total)) * 100);

  const sections = [
    { id: "dashboard", name: "📊 Dashboard" },
    { id: "quiz", name: "💎 Vision Quiz" },
    { id: "vision", name: "Vision & Values" },
    { id: "budget", name: "Budget Builder" },
    { id: "vendors", name: "Vendor Tracker" },
    { id: "timeline", name: "Timeline & Tasks" },
    { id: "blueprint", name: "Final Blueprint" },
    { id: "legacy", name: "Legacy Checklists" },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
              toast.type === "success"
                ? "bg-green-600 text-white"
                : toast.type === "error"
                  ? "bg-red-600 text-white"
                  : "bg-blue-600 text-white"
            }`}
          >
            <span className="text-lg">
              {toast.type === "success"
                ? "✓"
                : toast.type === "error"
                  ? "✕"
                  : "ℹ"}
            </span>
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 hover:opacity-75 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Header with navigation */}
      <header
        className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-b"} sticky top-0 z-10`}
      >
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1
              className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Hausa Wedding Guide
            </h1>
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? "☀️" : "🌙"}
              </button>

              {/* Export Data */}
              <button
                onClick={exportData}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "bg-gray-700 text-blue-400 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="Export your data as JSON backup"
              >
                📥
              </button>

              {/* Import Data */}
              <button
                onClick={importData}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "bg-gray-700 text-green-400 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="Import data from JSON backup"
              >
                📤
              </button>

              <a
                href="/"
                className={`text-sm ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                } underline`}
              >
                ← Back to Home
              </a>
            </div>
          </div>

          {/* Section tabs */}
          <nav className="flex gap-2 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeSection === section.id
                    ? "bg-[#CE805C] text-white"
                    : darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {section.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main
        className={`max-w-5xl mx-auto px-4 py-8 ${darkMode ? "text-gray-100" : ""}`}
      >
        {activeSection === "dashboard" && (
          <DashboardSection
            data={data}
            setActiveSection={setActiveSection}
            darkMode={darkMode}
          />
        )}
        {activeSection === "quiz" && (
          <VisionQuizSection
            data={data}
            updateQuizAnswer={updateQuizAnswer}
            submitQuiz={submitQuiz}
            resetQuiz={resetQuiz}
            setActiveSection={setActiveSection}
          />
        )}
        {activeSection === "vision" && (
          <VisionSection
            data={data}
            updatePriorities={updatePriorities}
            updateNiyyah={updateNiyyah}
            updateJournal={updateJournal}
            addPriority={addPriority}
            removePriority={removePriority}
          />
        )}
        {activeSection === "budget" && (
          <BudgetSection
            data={data}
            updateTotalBudget={updateTotalBudget}
            updateCategoryField={updateCategoryField}
          />
        )}
        {activeSection === "vendors" && (
          <VendorSection
            data={data}
            addVendor={addVendor}
            updateVendor={updateVendor}
            deleteVendor={deleteVendor}
          />
        )}
        {activeSection === "timeline" && (
          <TimelineSection
            data={data}
            setWeddingDate={setWeddingDate}
            addTask={addTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
            toggleShowCompleted={toggleShowCompleted}
          />
        )}
        {activeSection === "blueprint" && <BlueprintSection data={data} />}
        {activeSection === "legacy" && (
          <LegacySection
            data={data}
            toggle={toggle}
            updateNotes={updateNotes}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between text-sm text-gray-600">
          <div>Progress: {pct}% complete</div>
          <div className="flex gap-4">
            <button
              className="underline hover:text-gray-900"
              onClick={() => {
                const blob = new Blob([JSON.stringify(data, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "guide-progress.json";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export JSON
            </button>
            <button
              className="underline hover:text-gray-900"
              onClick={() => {
                if (!confirm("Clear all progress? This cannot be undone."))
                  return;
                localStorage.removeItem(storageKey);
                setData(DEFAULT_GUIDE);
              }}
            >
              Reset All
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Dashboard/Home Section Component
function DashboardSection({ data, setActiveSection, darkMode }) {
  // Calculate wedding countdown
  const weddingDate = data.weddingDate ? new Date(data.weddingDate) : null;
  const today = new Date();
  const daysUntilWedding = weddingDate
    ? Math.ceil((weddingDate - today) / (1000 * 60 * 60 * 24))
    : null;

  // Calculate overall statistics
  const budgetTotal = data.budget?.total || 0;
  const budgetAllocated = Object.values(data.budget?.categories || {}).reduce(
    (sum, cat) => sum + (cat.amount || 0),
    0
  );
  const budgetRemaining = budgetTotal - budgetAllocated;
  const budgetCompletion =
    budgetTotal > 0 ? (budgetAllocated / budgetTotal) * 100 : 0;

  const totalVendors = data.vendors?.length || 0;
  const bookedVendors =
    data.vendors?.filter((v) => v.status === "Booked").length || 0;
  const vendorCompletion =
    totalVendors > 0 ? (bookedVendors / totalVendors) * 100 : 0;

  const totalTasks = data.taskList?.length || 0;
  const completedTasks =
    data.taskList?.filter((t) => t.status === "Completed").length || 0;
  const taskCompletion =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const overdueTasks =
    data.taskList?.filter((task) => {
      if (task.status === "Completed" || !task.dueDate) return false;
      return new Date(task.dueDate) < today;
    }).length || 0;

  const overallProgress = Math.round(
    (budgetCompletion + vendorCompletion + taskCompletion) / 3
  );

  // Section navigation cards
  const sectionCards = [
    {
      id: "quiz",
      name: "Vision Quiz",
      icon: "💎",
      description: "Discover your wedding style with our quiz",
      stats: data.visionQuiz?.result
        ? `${data.visionQuiz.result.title}`
        : "Not taken",
      color: "from-purple-600 to-pink-600",
    },
    {
      id: "vision",
      name: "Vision & Values",
      icon: "✨",
      description: "Define your wedding priorities and intentions",
      stats: `${data.priorities?.filter((p) => p).length || 0} priorities`,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "budget",
      name: "Budget Builder",
      icon: "💰",
      description: "Plan and track your wedding expenses",
      stats:
        budgetTotal > 0
          ? `₦${(budgetTotal / 1000000).toFixed(1)}M total`
          : "Not set",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "vendors",
      name: "Vendor Tracker",
      icon: "🏪",
      description: "Manage your wedding service providers",
      stats: `${bookedVendors}/${totalVendors} booked`,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "timeline",
      name: "Timeline & Tasks",
      icon: "📅",
      description: "Organize tasks and track deadlines",
      stats: `${completedTasks}/${totalTasks} completed`,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "blueprint",
      name: "Final Blueprint",
      icon: "📋",
      description: "Review your complete wedding plan",
      stats: `${overallProgress}% complete`,
      color: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#CE805C] to-[#b86a4a] rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to Your Hausa Wedding Guide
        </h1>
        <p className="text-lg opacity-90">
          Your personalized planning dashboard for a beautiful and blessed
          celebration
        </p>
      </div>

      {/* Wedding Countdown Card */}
      {weddingDate && (
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                Wedding Countdown
              </h2>
              <p className="text-gray-600">
                {weddingDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#CE805C]">
                {daysUntilWedding > 0 ? daysUntilWedding : 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {daysUntilWedding > 0
                  ? "days to go"
                  : daysUntilWedding === 0
                    ? "Today!"
                    : "days ago"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Progress */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Overall Progress</h3>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="text-3xl font-bold text-[#CE805C] mb-2">
            {overallProgress}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#CE805C] h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Budget Status */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Budget Status</h3>
            <span className="text-2xl">💰</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {budgetTotal > 0
              ? new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  minimumFractionDigits: 0,
                }).format(budgetRemaining)
              : "Not set"}
          </div>
          <p className="text-sm text-gray-600">
            {budgetTotal > 0
              ? `${Math.round(budgetCompletion)}% allocated`
              : "Set your budget"}
          </p>
        </div>

        {/* Vendor Progress */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Vendors</h3>
            <span className="text-2xl">🏪</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {bookedVendors}/{totalVendors}
          </div>
          <p className="text-sm text-gray-600">
            {totalVendors > 0
              ? `${Math.round(vendorCompletion)}% booked`
              : "No vendors yet"}
          </p>
        </div>

        {/* Task Status */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Tasks</h3>
            <span className="text-2xl">✅</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {completedTasks}/{totalTasks}
          </div>
          <p className="text-sm text-gray-600">
            {overdueTasks > 0 ? (
              <span className="text-red-600 font-medium">
                {overdueTasks} overdue
              </span>
            ) : totalTasks > 0 ? (
              `${Math.round(taskCompletion)}% complete`
            ) : (
              "No tasks yet"
            )}
          </p>
        </div>
      </div>

      {/* Section Navigation */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Planning Sections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectionCards.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className="group bg-white rounded-xl border p-6 text-left hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`text-4xl p-3 rounded-lg bg-gradient-to-br ${section.color} text-white`}
                >
                  {section.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#CE805C] transition-colors">
                {section.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {section.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  {section.stats}
                </span>
                <span className="text-[#CE805C] opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      {(weddingDate || totalVendors > 0 || totalTasks > 0) && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            {!weddingDate && (
              <button
                onClick={() => setActiveSection("timeline")}
                className="px-4 py-2 bg-[#CE805C] text-white rounded-lg hover:bg-[#b86a4a] transition-colors text-sm font-medium"
              >
                📅 Set Wedding Date
              </button>
            )}
            {totalVendors === 0 && (
              <button
                onClick={() => setActiveSection("vendors")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                🏪 Add First Vendor
              </button>
            )}
            {totalTasks === 0 && (
              <button
                onClick={() => setActiveSection("timeline")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                ✅ Create First Task
              </button>
            )}
            {budgetTotal === 0 && (
              <button
                onClick={() => setActiveSection("budget")}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                💰 Set Budget
              </button>
            )}
          </div>
        </div>
      )}

      {/* Getting Started Guide (for empty state) */}
      {!weddingDate &&
        totalVendors === 0 &&
        totalTasks === 0 &&
        budgetTotal === 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <span>🌟</span> Let's Get Started!
            </h2>
            <p className="text-gray-700 mb-6">
              Welcome to your wedding planning journey! Here are the recommended
              steps to begin:
            </p>
            <ol className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#CE805C] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <div>
                  <strong className="text-gray-900">Define Your Vision</strong>
                  <p className="text-sm text-gray-600">
                    Start by setting your top priorities and writing your niyyah
                    (intention)
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#CE805C] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <div>
                  <strong className="text-gray-900">Set Your Budget</strong>
                  <p className="text-sm text-gray-600">
                    Establish your total budget and allocate funds to different
                    categories
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#CE805C] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <div>
                  <strong className="text-gray-900">
                    Choose Your Wedding Date
                  </strong>
                  <p className="text-sm text-gray-600">
                    Pick your special day to start the countdown and plan your
                    timeline
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#CE805C] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <div>
                  <strong className="text-gray-900">
                    Start Tracking Vendors & Tasks
                  </strong>
                  <p className="text-sm text-gray-600">
                    Add vendors you're considering and create tasks to stay
                    organized
                  </p>
                </div>
              </li>
            </ol>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveSection("quiz")}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium shadow-lg"
              >
                💎 Take Vision Quiz
              </button>
              <button
                onClick={() => setActiveSection("vision")}
                className="px-6 py-3 bg-[#CE805C] text-white rounded-lg hover:bg-[#b86a4a] transition-colors font-medium"
              >
                Start with Vision & Values →
              </button>
            </div>
          </div>
        )}
    </div>
  );
}

// Vision Quiz Section Component
function VisionQuizSection({
  data,
  updateQuizAnswer,
  submitQuiz,
  resetQuiz,
  setActiveSection,
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Quiz questions
  const questions = [
    {
      id: "q1",
      question: "What best describes your ideal wedding atmosphere?",
      options: [
        {
          value: "traditional",
          text: "Traditional and cultural - honoring Hausa customs fully",
          points: { traditional: 3, modern: 0, fusion: 1 },
        },
        {
          value: "modern",
          text: "Modern and contemporary - minimalist with Western touches",
          points: { traditional: 0, modern: 3, fusion: 1 },
        },
        {
          value: "fusion",
          text: "Fusion - blending Hausa traditions with modern elements",
          points: { traditional: 1, modern: 1, fusion: 3 },
        },
        {
          value: "grand",
          text: "Grand and luxurious - opulent celebration regardless of style",
          points: { traditional: 1, modern: 2, fusion: 2 },
        },
      ],
    },
    {
      id: "q2",
      question:
        "How important is the Kayan Lefe (bridal gifts) tradition to you?",
      options: [
        {
          value: "essential",
          text: "Essential - a complete traditional Kayan Lefe is a must",
          points: { traditional: 3, modern: 0, fusion: 1 },
        },
        {
          value: "important",
          text: "Important but flexible - I'll adapt it to my taste",
          points: { traditional: 1, modern: 1, fusion: 3 },
        },
        {
          value: "symbolic",
          text: "Symbolic only - just the key items to honor tradition",
          points: { traditional: 1, modern: 2, fusion: 2 },
        },
        {
          value: "minimal",
          text: "Minimal - I prefer practical gifts over traditional items",
          points: { traditional: 0, modern: 3, fusion: 1 },
        },
      ],
    },
    {
      id: "q3",
      question: "What's your vision for the wedding attire?",
      options: [
        {
          value: "full-traditional",
          text: "Full traditional Hausa attire for all events",
          points: { traditional: 3, modern: 0, fusion: 1 },
        },
        {
          value: "mix-match",
          text: "Traditional for main events, modern for reception",
          points: { traditional: 1, modern: 1, fusion: 3 },
        },
        {
          value: "modern-elegant",
          text: "Modern elegant gowns with subtle cultural touches",
          points: { traditional: 0, modern: 3, fusion: 2 },
        },
        {
          value: "multiple-changes",
          text: "Multiple outfit changes showcasing different styles",
          points: { traditional: 1, modern: 2, fusion: 2 },
        },
      ],
    },
    {
      id: "q4",
      question: "How do you want to structure your wedding events?",
      options: [
        {
          value: "all-traditional",
          text: "All traditional events - Fatiha, Kamu, Walima as customary",
          points: { traditional: 3, modern: 0, fusion: 1 },
        },
        {
          value: "combined",
          text: "Combine some events for convenience and cost",
          points: { traditional: 1, modern: 2, fusion: 3 },
        },
        {
          value: "simplified",
          text: "Simplified - just the essential religious ceremony and reception",
          points: { traditional: 0, modern: 3, fusion: 1 },
        },
        {
          value: "extended",
          text: "Extended celebration with additional modern events (e.g., rehearsal dinner)",
          points: { traditional: 1, modern: 2, fusion: 2 },
        },
      ],
    },
    {
      id: "q5",
      question: "What's your approach to wedding decor and aesthetics?",
      options: [
        {
          value: "cultural-colors",
          text: "Rich cultural colors and traditional Hausa patterns",
          points: { traditional: 3, modern: 0, fusion: 1 },
        },
        {
          value: "elegant-neutral",
          text: "Elegant neutrals with minimalist modern design",
          points: { traditional: 0, modern: 3, fusion: 1 },
        },
        {
          value: "cultural-modern",
          text: "Cultural elements presented in a modern aesthetic",
          points: { traditional: 1, modern: 1, fusion: 3 },
        },
        {
          value: "luxury-glam",
          text: "Luxurious and glamorous regardless of cultural style",
          points: { traditional: 1, modern: 2, fusion: 2 },
        },
      ],
    },
    {
      id: "q6",
      question: "What role will family traditions play in your planning?",
      options: [
        {
          value: "central",
          text: "Central - family elders guide all major decisions",
          points: { traditional: 3, modern: 0, fusion: 1 },
        },
        {
          value: "collaborative",
          text: "Collaborative - I balance family input with personal choices",
          points: { traditional: 1, modern: 1, fusion: 3 },
        },
        {
          value: "respectful-independent",
          text: "Respectful but independent - I make final decisions",
          points: { traditional: 0, modern: 3, fusion: 2 },
        },
        {
          value: "selective",
          text: "Selective - honor key traditions, skip others",
          points: { traditional: 1, modern: 2, fusion: 2 },
        },
      ],
    },
    {
      id: "q7",
      question: "How important is it to have traditional Hausa entertainment?",
      options: [
        {
          value: "must-have",
          text: "Must have - traditional music and cultural performances",
          points: { traditional: 3, modern: 0, fusion: 1 },
        },
        {
          value: "mix-both",
          text: "Mix of traditional and contemporary music/entertainment",
          points: { traditional: 1, modern: 1, fusion: 3 },
        },
        {
          value: "mostly-modern",
          text: "Mostly modern - DJ, band, contemporary performances",
          points: { traditional: 0, modern: 3, fusion: 1 },
        },
        {
          value: "unique",
          text: "Unique fusion - maybe live band playing traditional songs modernly",
          points: { traditional: 1, modern: 2, fusion: 3 },
        },
      ],
    },
    {
      id: "q8",
      question: "What's your priority for the wedding menu?",
      options: [
        {
          value: "all-hausa",
          text: "All traditional Hausa cuisine - Tuwo, Miyan Kuka, etc.",
          points: { traditional: 3, modern: 0, fusion: 1 },
        },
        {
          value: "nigerian-variety",
          text: "Variety of Nigerian cuisines including Hausa favorites",
          points: { traditional: 2, modern: 1, fusion: 3 },
        },
        {
          value: "international",
          text: "International menu with some Nigerian options",
          points: { traditional: 0, modern: 3, fusion: 1 },
        },
        {
          value: "gourmet-fusion",
          text: "Gourmet fusion - traditional dishes with modern presentation",
          points: { traditional: 1, modern: 2, fusion: 3 },
        },
      ],
    },
  ];

  // Calculate result based on answers
  const calculateResult = () => {
    const scores = { traditional: 0, modern: 0, fusion: 0 };

    Object.entries(data.visionQuiz.answers).forEach(
      ([questionId, answerValue]) => {
        const question = questions.find((q) => q.id === questionId);
        const selectedOption = question?.options.find(
          (opt) => opt.value === answerValue
        );

        if (selectedOption) {
          scores.traditional += selectedOption.points.traditional;
          scores.modern += selectedOption.points.modern;
          scores.fusion += selectedOption.points.fusion;
        }
      }
    );

    // Determine dominant style
    const maxScore = Math.max(scores.traditional, scores.modern, scores.fusion);
    let resultType;

    if (scores.traditional === maxScore) {
      resultType = "traditional";
    } else if (scores.modern === maxScore) {
      resultType = "modern";
    } else {
      resultType = "fusion";
    }

    return {
      type: resultType,
      scores,
      title:
        resultType === "traditional"
          ? "The Traditional Hausa Bride"
          : resultType === "modern"
            ? "The Modern Minimalist Bride"
            : "The Fusion Innovator Bride",
      description:
        resultType === "traditional"
          ? "You honor your heritage deeply and want a wedding that celebrates traditional Hausa customs in their full glory. Your celebration will be rich with cultural significance, from the complete Kayan Lefe to authentic ceremonial events."
          : resultType === "modern"
            ? "You value contemporary elegance and simplicity. Your wedding will blend essential cultural elements with modern aesthetics, creating a sophisticated celebration that feels fresh and personal."
            : "You're a bridge between worlds, beautifully blending cherished Hausa traditions with modern sensibilities. Your wedding will honor your heritage while expressing your unique contemporary vision.",
      recommendations:
        resultType === "traditional"
          ? [
              "✨ Prioritize a complete traditional Kayan Lefe with authentic items",
              "👗 Invest in high-quality traditional Hausa attire from master tailors",
              "🎵 Book traditional Hausa musicians and cultural performers",
              "🍲 Feature authentic Hausa cuisine with all the traditional dishes",
              "🎨 Use rich cultural colors and traditional patterns in decor",
              "📅 Follow the complete traditional event sequence (Fatiha, Kamu, Walima)",
              "👪 Involve family elders in all major planning decisions",
              "📸 Capture cultural ceremonies and traditional rituals extensively",
            ]
          : resultType === "modern"
            ? [
                "🎨 Choose elegant neutral color palettes with minimalist design",
                "👗 Select modern gowns with subtle cultural touches or accessories",
                "📅 Simplify events - combine where appropriate for efficiency",
                "🍽️ Offer international menu with select Nigerian favorites",
                "💐 Contemporary floral arrangements and modern venue styling",
                "🎵 Hire professional DJ or modern band for entertainment",
                "📱 Utilize digital tools for invitations and RSVPs",
                "✨ Focus on quality over quantity - fewer vendors, better service",
              ]
            : [
                "🌟 Create a signature fusion aesthetic blending both worlds",
                "👗 Mix traditional and modern attire across different events",
                "🎨 Use traditional patterns in modern color palettes and layouts",
                "🍲 Offer gourmet fusion - traditional dishes with modern presentation",
                "🎵 Book live band to perform traditional songs with contemporary arrangements",
                "📅 Keep key traditional ceremonies but add modern reception elements",
                "✨ Collaborative planning - balance family input with your vision",
                "📸 Highlight the beautiful blend of cultures in your photography",
              ],
    };
  };

  const answeredQuestions = Object.keys(data.visionQuiz.answers).length;
  const allAnswered = answeredQuestions === questions.length;
  const currentAnswer = data.visionQuiz.answers[questions[currentQuestion]?.id];

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (allAnswered) {
      const result = calculateResult();
      submitQuiz(result);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = () => {
    const result = calculateResult();
    submitQuiz(result);
    setShowResults(true);
  };

  // If quiz already completed, show results
  if (data.visionQuiz.result || showResults) {
    const result = data.visionQuiz.result || calculateResult();

    return (
      <div className="space-y-8">
        {/* Results Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {result.type === "traditional"
                ? "👑"
                : result.type === "modern"
                  ? "✨"
                  : "💎"}
            </div>
            <h1 className="text-3xl font-bold mb-3">{result.title}</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              {result.description}
            </p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Your Style Profile
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Traditional
                </span>
                <span className="text-sm font-bold text-purple-600">
                  {result.scores.traditional} points
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${(result.scores.traditional / 24) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Modern
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {result.scores.modern} points
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(result.scores.modern / 24) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Fusion
                </span>
                <span className="text-sm font-bold text-pink-600">
                  {result.scores.fusion} points
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-pink-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(result.scores.fusion / 24) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Personalized Recommendations
          </h2>
          <p className="text-gray-600 mb-4">
            Based on your style, here are tailored suggestions for your wedding
            planning:
          </p>
          <ul className="space-y-3">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{rec.split(" ")[0]}</span>
                <span className="text-gray-700">
                  {rec.substring(rec.indexOf(" ") + 1)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-900">
            Next Steps
          </h2>
          <p className="text-gray-700 mb-4">
            Now that you know your wedding style, use this insight to guide your
            planning decisions. Your style profile will help you make choices
            that feel authentic to you.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveSection("vision")}
              className="px-6 py-3 bg-[#CE805C] text-white rounded-lg hover:bg-[#b86a4a] transition-colors font-medium"
            >
              Define Your Priorities →
            </button>
            <button
              onClick={() => setActiveSection("budget")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Build Your Budget →
            </button>
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz interface
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Discover Your Wedding Vision
        </h1>
        <p className="text-lg opacity-90">
          Answer 8 questions to reveal your unique bridal style and get
          personalized recommendations
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-purple-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl border p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          {question.question}
        </h2>
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => updateQuizAnswer(question.id, option.value)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                currentAnswer === option.value
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    currentAnswer === option.value
                      ? "border-purple-600 bg-purple-600"
                      : "border-gray-300"
                  }`}
                >
                  {currentAnswer === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span
                  className={`${
                    currentAnswer === option.value
                      ? "text-purple-900 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {option.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <div className="flex gap-3">
          {answeredQuestions === questions.length &&
          currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleFinish}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium shadow-lg"
            >
              See My Results ✨
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!currentAnswer}
              className="px-6 py-3 bg-[#CE805C] text-white rounded-lg hover:bg-[#b86a4a] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === questions.length - 1 ? "Finish" : "Next →"}
            </button>
          )}
        </div>
      </div>

      {/* Summary Progress */}
      <div className="bg-gray-50 rounded-xl border p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Quiz Progress
        </h3>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                data.visionQuiz.answers[q.id]
                  ? "bg-purple-600 text-white"
                  : index === currentQuestion
                    ? "bg-purple-200 text-purple-900 border-2 border-purple-600"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-3">
          {answeredQuestions} of {questions.length} questions answered
          {answeredQuestions === questions.length && " - Ready to see results!"}
        </p>
      </div>
    </div>
  );
}

// Vision & Values Section Component
function VisionSection({
  data,
  updatePriorities,
  updateNiyyah,
  updateJournal,
  addPriority,
  removePriority,
}) {
  const [newPriority, setNewPriority] = useState("");

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Top 5 Wedding Priorities
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          What matters most for your wedding? List up to 5 priorities.
        </p>

        <div className="space-y-3 mb-4">
          {data.weddingPriorities.map((priority, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#CE805C] text-white text-sm flex items-center justify-center">
                {index + 1}
              </span>
              <span className="flex-1 text-gray-900">{priority}</span>
              <button
                onClick={() => removePriority(index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {data.weddingPriorities.length < 5 && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && newPriority.trim()) {
                  addPriority(newPriority.trim());
                  setNewPriority("");
                }
              }}
              placeholder="Add a priority..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={() => {
                if (newPriority.trim()) {
                  addPriority(newPriority.trim());
                  setNewPriority("");
                }
              }}
              className="px-4 py-2 bg-[#CE805C] text-white rounded-lg text-sm hover:bg-[#b86a4a]"
            >
              Add
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Niyyah & Dua
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Write your personal intention and prayer for your wedding.
        </p>
        <textarea
          value={data.niyyahDua}
          onChange={(e) => updateNiyyah(e.target.value)}
          placeholder="Bismillah... Write your niyyah and dua here..."
          className="w-full min-h-[150px] border rounded-lg p-3 text-sm"
        />
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Bride's Journal
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Your private space for thoughts, ideas, and reflections.
        </p>
        <textarea
          value={data.brideJournal}
          onChange={(e) => updateJournal(e.target.value)}
          placeholder="Start writing your wedding journey..."
          className="w-full min-h-[200px] border rounded-lg p-3 text-sm"
        />
      </div>
    </div>
  );
}

// Budget Builder Section Component
function BudgetSection({ data, updateTotalBudget, updateCategoryField }) {
  const categories = [
    { key: "venue", label: "Venue & Location" },
    { key: "catering", label: "Catering & Food" },
    { key: "attire", label: "Attire & Accessories" },
    { key: "photography", label: "Photography & Videography" },
    { key: "decor", label: "Decorations & Ambiance" },
    { key: "misc", label: "Miscellaneous" },
  ];

  // Calculate total percentage allocated
  const totalPercentage = Object.values(data.budgetCategories).reduce(
    (sum, cat) => sum + cat.percentage,
    0
  );

  const isOverBudget = totalPercentage > 100;
  const remaining = 100 - totalPercentage;

  return (
    <div className="space-y-6">
      {/* Total Budget Input */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Total Wedding Budget
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter your total budget. All categories will be calculated based on
          this amount.
        </p>

        <div className="flex items-center gap-3">
          <span className="text-lg font-medium text-gray-700">₦</span>
          <input
            type="number"
            value={data.totalBudget || ""}
            onChange={(e) => updateTotalBudget(e.target.value)}
            placeholder="0.00"
            min="0"
            step="1000"
            className="flex-1 text-2xl font-bold border-b-2 border-gray-300 focus:border-[#CE805C] outline-none py-2 transition-colors"
          />
        </div>

        {data.totalBudget > 0 && (
          <p className="mt-3 text-sm text-gray-600">
            Total budget set:{" "}
            <span className="font-semibold">
              ₦{data.totalBudget.toLocaleString()}
            </span>
          </p>
        )}
      </div>

      {/* Budget Overview Alert */}
      {data.totalBudget > 0 && (
        <div
          className={`rounded-xl border-2 p-4 ${
            isOverBudget
              ? "bg-red-50 border-red-300"
              : remaining === 0
                ? "bg-green-50 border-green-300"
                : "bg-blue-50 border-blue-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">
                {isOverBudget
                  ? "⚠️ Over Budget!"
                  : remaining === 0
                    ? "✅ Budget Fully Allocated"
                    : "💡 Budget Status"}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Total allocated:{" "}
                <span className="font-bold">{totalPercentage.toFixed(1)}%</span>
                {!isOverBudget && remaining > 0 && (
                  <span className="ml-2">
                    • Remaining:{" "}
                    <span className="font-bold">{remaining.toFixed(1)}%</span>
                  </span>
                )}
              </p>
            </div>
            <div className="text-2xl">
              {isOverBudget ? "🚨" : remaining === 0 ? "🎯" : "📊"}
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Budget Categories
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Allocate your budget by entering either a percentage or an amount for
          each category.
        </p>

        <div className="space-y-4">
          {categories.map(({ key, label }) => {
            const category = data.budgetCategories[key];
            return (
              <div
                key={key}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Category Label */}
                <div className="flex items-center">
                  <label className="font-medium text-gray-900">{label}</label>
                </div>

                {/* Percentage Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={category.percentage || ""}
                    onChange={(e) =>
                      updateCategoryField(key, "percentage", e.target.value)
                    }
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none"
                    disabled={!data.totalBudget}
                  />
                  <span className="text-gray-600">%</span>
                </div>

                {/* Amount Input */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">₦</span>
                  <input
                    type="number"
                    value={category.amount || ""}
                    onChange={(e) =>
                      updateCategoryField(key, "amount", e.target.value)
                    }
                    placeholder="0.00"
                    min="0"
                    step="1000"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none"
                    disabled={!data.totalBudget}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {!data.totalBudget && (
          <p className="mt-4 text-sm text-gray-500 italic text-center">
            Enter a total budget above to start allocating funds to categories.
          </p>
        )}
      </div>

      {/* Budget Summary Table */}
      {data.totalBudget > 0 && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Budget Summary
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700">
                    Percentage
                  </th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map(({ key, label }) => {
                  const category = data.budgetCategories[key];
                  return (
                    <tr key={key} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3">{label}</td>
                      <td className="text-right py-2 px-3">
                        {category.percentage.toFixed(1)}%
                      </td>
                      <td className="text-right py-2 px-3 font-medium">
                        ₦
                        {category.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  );
                })}
                <tr className="font-bold border-t-2">
                  <td className="py-3 px-3">Total</td>
                  <td
                    className={`text-right py-3 px-3 ${isOverBudget ? "text-red-600" : "text-gray-900"}`}
                  >
                    {totalPercentage.toFixed(1)}%
                  </td>
                  <td className="text-right py-3 px-3 text-gray-900">
                    ₦
                    {Object.values(data.budgetCategories)
                      .reduce((sum, cat) => sum + cat.amount, 0)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Vendor Tracker Section Component
function VendorSection({ data, addVendor, updateVendor, deleteVendor }) {
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const categories = [
    { value: "venue", label: "Venue & Location" },
    { value: "catering", label: "Catering & Food" },
    { value: "attire", label: "Traditional Attire & Fabrics" },
    { value: "photography", label: "Photography & Videography" },
    { value: "decor", label: "Decorations & Event Design" },
    { value: "makeup", label: "Makeup & Beauty" },
    { value: "kayan-lefe", label: "Kayan Lefe (Traditional Gifts)" },
    { value: "entertainment", label: "Live Performers & Entertainment" },
    { value: "henna", label: "Henna Artist" },
    { value: "transportation", label: "Transportation & Logistics" },
    { value: "misc", label: "Miscellaneous" },
  ];

  const statuses = [
    {
      value: "researching",
      label: "Researching",
      color: "bg-gray-100 text-gray-700",
    },
    {
      value: "contacted",
      label: "Contacted",
      color: "bg-blue-100 text-blue-700",
    },
    {
      value: "quoted",
      label: "Quoted",
      color: "bg-yellow-100 text-yellow-700",
    },
    { value: "booked", label: "Booked", color: "bg-green-100 text-green-700" },
    { value: "declined", label: "Declined", color: "bg-red-100 text-red-700" },
  ];

  // Filter vendors
  const filteredVendors = data.vendorList.filter((vendor) => {
    const categoryMatch =
      filterCategory === "all" || vendor.category === filterCategory;
    const statusMatch =
      filterStatus === "all" || vendor.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const openAddModal = () => {
    setEditingVendor(null);
    setShowModal(true);
  };

  const openEditModal = (vendor) => {
    setEditingVendor(vendor);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    return (
      statuses.find((s) => s.value === status)?.color ||
      "bg-gray-100 text-gray-700"
    );
  };

  const getCategoryLabel = (categoryValue) => {
    return (
      categories.find((c) => c.value === categoryValue)?.label || categoryValue
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Vendor Tracker
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Organize and track all your wedding vendors in one place
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-[#CE805C] hover:bg-[#b86a4a] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Add Vendor
          </button>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none"
            >
              <option value="all">All Statuses</option>
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(filterCategory !== "all" || filterStatus !== "all") && (
          <button
            onClick={() => {
              setFilterCategory("all");
              setFilterStatus("all");
            }}
            className="mt-3 text-sm text-[#CE805C] hover:text-[#b86a4a] underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Vendor Grid */}
      {filteredVendors.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="text-6xl mb-4">💼</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {data.vendorList.length === 0
              ? "No vendors added yet"
              : "No vendors match your filters"}
          </h3>
          <p className="text-gray-600 mb-6">
            {data.vendorList.length === 0
              ? "Let's start building your dream team! 🎉"
              : "Try adjusting your filters to see more vendors."}
          </p>
          {data.vendorList.length === 0 && (
            <button
              onClick={openAddModal}
              className="px-6 py-3 bg-[#CE805C] hover:bg-[#b86a4a] text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Add Your First Vendor
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-xl border p-5 hover:shadow-lg transition-shadow"
            >
              {/* Vendor Name & Category */}
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {vendor.name}
                </h3>
                <span className="inline-block px-2 py-1 bg-[#CE805C] bg-opacity-10 text-[#CE805C] text-xs rounded-md font-medium">
                  {getCategoryLabel(vendor.category)}
                </span>
              </div>

              {/* Contact */}
              <div className="mb-3 text-sm text-gray-700">
                <span className="font-medium">Contact:</span> {vendor.contact}
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    vendor.status
                  )}`}
                >
                  {statuses.find((s) => s.value === vendor.status)?.label}
                </span>
              </div>

              {/* Notes (if any) */}
              {vendor.notes && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {vendor.notes}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t">
                <button
                  onClick={() => openEditModal(vendor)}
                  className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteVendor(vendor.id)}
                  className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vendor Modal */}
      {showModal && (
        <VendorModal
          vendor={editingVendor}
          categories={categories}
          statuses={statuses}
          onSave={(vendorData) => {
            if (editingVendor) {
              updateVendor(editingVendor.id, vendorData);
            } else {
              addVendor(vendorData);
            }
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// Vendor Modal Component
function VendorModal({ vendor, categories, statuses, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: vendor?.name || "",
    category: vendor?.category || categories[0].value,
    contact: vendor?.contact || "",
    status: vendor?.status || statuses[0].value,
    notes: vendor?.notes || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contact.trim()) {
      alert("Please fill in vendor name and contact information");
      return;
    }
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              {vendor ? "Edit Vendor" : "Add New Vendor"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Vendor Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Elegant Events Hall"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact (Phone/Email/WhatsApp) *
              </label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
                placeholder="Phone, email, or WhatsApp"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none"
                required
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Additional details, pricing, special requests..."
                rows="4"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#CE805C] hover:bg-[#b86a4a] text-white rounded-lg font-medium transition-colors"
              >
                {vendor ? "Save Changes" : "Add Vendor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Timeline & Task Manager Section Component
function TimelineSection({
  data,
  setWeddingDate,
  addTask,
  updateTask,
  deleteTask,
  toggleShowCompleted,
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate"); // dueDate | priority | category

  const categories = [
    { value: "legal", label: "Legal & Documentation" },
    { value: "venue", label: "Venue & Location" },
    { value: "catering", label: "Catering & Food" },
    { value: "attire", label: "Attire & Beauty" },
    { value: "photography", label: "Photography & Videography" },
    { value: "decor", label: "Decorations" },
    { value: "entertainment", label: "Entertainment" },
    { value: "transportation", label: "Transportation" },
    { value: "kayan-lefe", label: "Kayan Lefe" },
    { value: "misc", label: "Miscellaneous" },
  ];

  const statuses = [
    { value: "pending", label: "Pending", color: "bg-gray-100 text-gray-700" },
    {
      value: "in-progress",
      label: "In Progress",
      color: "bg-blue-100 text-blue-700",
    },
    {
      value: "completed",
      label: "Completed",
      color: "bg-green-100 text-green-700",
    },
  ];

  const priorities = [
    { value: "high", label: "High", color: "text-red-600", icon: "🔴" },
    { value: "medium", label: "Medium", color: "text-yellow-600", icon: "🟡" },
    { value: "low", label: "Low", color: "text-gray-600", icon: "⚪" },
  ];

  // Default wedding tasks template (optional quick-add)
  const defaultTasks = [
    {
      title: "Book Fatiha date",
      category: "legal",
      priority: "high",
      notes: "Confirm with families and Islamic center",
    },
    {
      title: "Order Kayan Lefe",
      category: "kayan-lefe",
      priority: "high",
      notes: "Traditional gift items for bride",
    },
    {
      title: "Schedule henna ceremony (Kunshi)",
      category: "attire",
      priority: "medium",
      notes: "Book henna artist and venue",
    },
    {
      title: "Book wedding venue",
      category: "venue",
      priority: "high",
      notes: "Contact at least 3 venues for quotes",
    },
    {
      title: "Hire photographer/videographer",
      category: "photography",
      priority: "high",
      notes: "Review portfolios and packages",
    },
    {
      title: "Choose catering menu",
      category: "catering",
      priority: "medium",
      notes: "Include traditional Hausa dishes",
    },
    {
      title: "Order wedding attire",
      category: "attire",
      priority: "high",
      notes: "Bride and groom traditional outfits",
    },
    {
      title: "Arrange transportation",
      category: "transportation",
      priority: "medium",
      notes: "For bridal party and guests",
    },
    {
      title: "Book entertainment (drummers/DJ)",
      category: "entertainment",
      priority: "low",
      notes: "Traditional drummers or modern DJ",
    },
    {
      title: "Plan venue decorations",
      category: "decor",
      priority: "medium",
      notes: "Theme, colors, and floral arrangements",
    },
  ];

  // Calculate countdown
  const getCountdown = () => {
    if (!data.weddingDate) return null;
    const wedding = new Date(data.weddingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    wedding.setHours(0, 0, 0, 0);
    const diffTime = wedding - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const countdown = getCountdown();

  // Check if task is overdue
  const isOverdue = (task) => {
    if (task.status === "completed") return false;
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  // Filter and sort tasks
  const filteredTasks = data.taskList
    .filter((task) => {
      const categoryMatch =
        filterCategory === "all" || task.category === filterCategory;
      const statusMatch =
        filterStatus === "all" || task.status === filterStatus;
      const priorityMatch =
        filterPriority === "all" || task.priority === filterPriority;

      // Hide completed if toggle is off
      if (!data.showCompletedTasks && task.status === "completed") return false;

      return categoryMatch && statusMatch && priorityMatch;
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === "category") {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });

  const openAddModal = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const getCategoryLabel = (value) => {
    return categories.find((c) => c.value === value)?.label || value;
  };

  const getStatusColor = (value) => {
    return statuses.find((s) => s.value === value)?.color || "";
  };

  const getPriorityInfo = (value) => {
    return (
      priorities.find((p) => p.value === value) || {
        icon: "⚪",
        color: "text-gray-600",
      }
    );
  };

  const toggleTaskStatus = (task) => {
    const newStatus =
      task.status === "completed"
        ? "pending"
        : task.status === "pending"
          ? "in-progress"
          : "completed";
    updateTask(task.id, { status: newStatus });
  };

  const addDefaultTasks = () => {
    if (
      !confirm(
        "Add 10 common wedding tasks? You can delete or modify any you don't need."
      )
    )
      return;

    defaultTasks.forEach((task) => {
      addTask({
        ...task,
        status: "pending",
        dueDate: "", // User will set dates later
      });
    });
  };

  // Task counts
  const totalTasks = data.taskList.length;
  const completedTasks = data.taskList.filter(
    (t) => t.status === "completed"
  ).length;
  const overdueTasks = data.taskList.filter((t) => isOverdue(t)).length;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Wedding Date & Countdown Card */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Wedding Timeline & Tasks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wedding Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wedding Date *
            </label>
            <input
              type="date"
              value={data.weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none"
            />
          </div>

          {/* Countdown Display */}
          <div className="flex items-center justify-center bg-gradient-to-br from-[#CE805C] to-[#b86a4a] rounded-lg p-6 text-white">
            {countdown !== null ? (
              <div className="text-center">
                <div className="text-4xl font-bold mb-1">
                  {countdown > 0 ? countdown : 0}
                </div>
                <div className="text-sm opacity-90">
                  {countdown > 0
                    ? countdown === 1
                      ? "day until wedding! 🎉"
                      : "days until wedding! 🎉"
                    : countdown === 0
                      ? "Wedding day is today! 💍"
                      : "Wedding has passed"}
                </div>
              </div>
            ) : (
              <div className="text-center opacity-75">
                <div className="text-2xl mb-1">📅</div>
                <div className="text-sm">Set your wedding date above</div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Summary */}
        {totalTasks > 0 && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Overall Progress
              </span>
              <span className="text-sm font-semibold text-[#CE805C]">
                {completedTasks} / {totalTasks} tasks ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-[#CE805C] h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {overdueTasks > 0 && (
              <p className="mt-2 text-sm text-red-600 font-medium">
                ⚠️ {overdueTasks} overdue{" "}
                {overdueTasks === 1 ? "task" : "tasks"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-[#CE805C] hover:bg-[#b86a4a] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Add Task
            </button>
            {totalTasks === 0 && (
              <button
                onClick={addDefaultTasks}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
              >
                + Add Common Tasks
              </button>
            )}
          </div>

          {/* Show/Hide Completed Toggle */}
          {completedTasks > 0 && (
            <button
              onClick={toggleShowCompleted}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              {data.showCompletedTasks ? "Hide" : "Show"} Completed (
              {completedTasks})
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Filter by Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none"
            >
              <option value="all">All Statuses</option>
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Filter by Priority
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none"
            >
              <option value="all">All Priorities</option>
              {priorities.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        {(filterCategory !== "all" ||
          filterStatus !== "all" ||
          filterPriority !== "all") && (
          <button
            onClick={() => {
              setFilterCategory("all");
              setFilterStatus("all");
              setFilterPriority("all");
            }}
            className="mt-3 text-sm text-[#CE805C] hover:text-[#b86a4a] underline"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {totalTasks === 0 ? "No tasks yet" : "No tasks match your filters"}
          </h3>
          <p className="text-gray-600 mb-6">
            {totalTasks === 0
              ? "Start planning your wedding by adding tasks!"
              : "Try adjusting your filters to see more tasks."}
          </p>
          {totalTasks === 0 && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={openAddModal}
                className="px-6 py-3 bg-[#CE805C] hover:bg-[#b86a4a] text-white rounded-lg font-medium transition-colors"
              >
                + Add Your First Task
              </button>
              <button
                onClick={addDefaultTasks}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                + Add Common Tasks
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-xl border p-5 hover:shadow-md transition-shadow ${
                task.status === "completed" ? "opacity-60" : ""
              } ${isOverdue(task) ? "border-l-4 border-l-red-500" : ""}`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleTaskStatus(task)}
                  className={`mt-1 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    task.status === "completed"
                      ? "bg-green-500 border-green-500"
                      : task.status === "in-progress"
                        ? "bg-blue-100 border-blue-500"
                        : "border-gray-300 hover:border-[#CE805C]"
                  }`}
                >
                  {task.status === "completed" && (
                    <span className="text-white text-sm">✓</span>
                  )}
                  {task.status === "in-progress" && (
                    <span className="text-blue-600 text-xs">●</span>
                  )}
                </button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3
                      className={`text-base font-semibold text-gray-900 ${
                        task.status === "completed" ? "line-through" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={getPriorityInfo(task.priority).icon}>
                        {" "}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {/* Category Badge */}
                    <span className="inline-block px-2 py-1 bg-[#CE805C] bg-opacity-10 text-[#CE805C] text-xs rounded-md font-medium">
                      {getCategoryLabel(task.category)}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {statuses.find((s) => s.value === task.status)?.label}
                    </span>

                    {/* Due Date */}
                    {task.dueDate && (
                      <span
                        className={`text-xs ${
                          isOverdue(task)
                            ? "text-red-600 font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                        {isOverdue(task) && " (OVERDUE)"}
                      </span>
                    )}
                  </div>

                  {/* Notes */}
                  {task.notes && (
                    <p className="text-sm text-gray-600 mb-3">{task.notes}</p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(task)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          task={editingTask}
          categories={categories}
          statuses={statuses}
          priorities={priorities}
          onSave={(taskData) => {
            if (editingTask) {
              updateTask(editingTask.id, taskData);
            } else {
              addTask(taskData);
            }
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// Task Modal Component
function TaskModal({
  task,
  categories,
  statuses,
  priorities,
  onSave,
  onClose,
}) {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    category: task?.category || categories[0].value,
    dueDate: task?.dueDate || "",
    status: task?.status || statuses[0].value,
    priority: task?.priority || "medium",
    notes: task?.notes || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a task title");
      return;
    }
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              {task ? "Edit Task" : "Add New Task"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Book wedding venue"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date (Optional)
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none"
                required
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.icon} {priority.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none"
                required
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Add any additional details..."
                rows="4"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#CE805C] focus:border-transparent outline-none resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#CE805C] hover:bg-[#b86a4a] text-white rounded-lg font-medium transition-colors"
              >
                {task ? "Save Changes" : "Add Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Final Wedding Blueprint Section Component
function BlueprintSection({ data }) {
  const [showPrintView, setShowPrintView] = useState(false);

  // Calculate statistics
  const stats = {
    // Budget stats
    totalBudget: data.totalBudget,
    budgetAllocated: Object.values(data.budgetCategories).reduce(
      (sum, cat) => sum + cat.amount,
      0
    ),
    budgetRemaining:
      data.totalBudget -
      Object.values(data.budgetCategories).reduce(
        (sum, cat) => sum + cat.amount,
        0
      ),

    // Vendor stats
    totalVendors: data.vendorList.length,
    bookedVendors: data.vendorList.filter((v) => v.status === "booked").length,
    quotedVendors: data.vendorList.filter((v) => v.status === "quoted").length,
    pendingVendors: data.vendorList.filter(
      (v) => v.status === "researching" || v.status === "contacted"
    ).length,

    // Task stats
    totalTasks: data.taskList.length,
    completedTasks: data.taskList.filter((t) => t.status === "completed")
      .length,
    inProgressTasks: data.taskList.filter((t) => t.status === "in-progress")
      .length,
    overdueTasks: data.taskList.filter((t) => {
      if (t.status === "completed") return false;
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      due.setHours(0, 0, 0, 0);
      return due < today;
    }).length,

    // Wedding date
    weddingDate: data.weddingDate,
    daysUntilWedding: data.weddingDate
      ? Math.ceil(
          (new Date(data.weddingDate) - new Date()) / (1000 * 60 * 60 * 24)
        )
      : null,

    // Priorities
    topPriorities: data.weddingPriorities.slice(0, 5),
  };

  // Calculate completion percentages
  const budgetCompletion =
    stats.totalBudget > 0
      ? Math.round((stats.budgetAllocated / stats.totalBudget) * 100)
      : 0;
  const vendorCompletion =
    stats.totalVendors > 0
      ? Math.round((stats.bookedVendors / stats.totalVendors) * 100)
      : 0;
  const taskCompletion =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;
  const overallCompletion = Math.round(
    (budgetCompletion + vendorCompletion + taskCompletion) / 3
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Export to JSON
  const exportData = () => {
    const exportObj = {
      exportDate: new Date().toISOString(),
      weddingDate: data.weddingDate,
      priorities: data.weddingPriorities,
      budget: {
        total: data.totalBudget,
        categories: data.budgetCategories,
      },
      vendors: data.vendorList,
      tasks: data.taskList,
      niyyah: data.niyyahDua,
      journal: data.brideJournal,
    };

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hausa-wedding-plan-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Print view
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-[#CE805C] to-[#b86a4a] rounded-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Your Wedding Blueprint 📋</h2>
        <p className="text-white text-opacity-90 mb-6">
          A comprehensive summary of your entire wedding plan
        </p>

        {data.weddingDate && (
          <div className="bg-white bg-opacity-20 rounded-lg p-4 inline-block">
            <div className="text-sm opacity-90 mb-1">Wedding Date</div>
            <div className="text-2xl font-bold">
              {new Date(data.weddingDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            {stats.daysUntilWedding !== null && stats.daysUntilWedding > 0 && (
              <div className="text-sm opacity-90 mt-1">
                {stats.daysUntilWedding}{" "}
                {stats.daysUntilWedding === 1 ? "day" : "days"} to go! 🎉
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overall Progress Card */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Overall Planning Progress
        </h3>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Overall Completion
            </span>
            <span className="text-lg font-bold text-[#CE805C]">
              {overallCompletion}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-[#CE805C] to-[#b86a4a] h-4 rounded-full transition-all duration-500"
              style={{ width: `${overallCompletion}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Budget Progress */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Budget Allocated</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {budgetCompletion}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${budgetCompletion}%` }}
              />
            </div>
          </div>

          {/* Vendor Progress */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Vendors Booked</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {vendorCompletion}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${vendorCompletion}%` }}
              />
            </div>
          </div>

          {/* Task Progress */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Tasks Completed</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {taskCompletion}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${taskCompletion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Priorities */}
      {stats.topPriorities.length > 0 && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Your Wedding Vision
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-3">Top 5 Priorities:</p>
            {stats.topPriorities.map((priority, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <span className="flex-shrink-0 w-8 h-8 bg-[#CE805C] text-white rounded-full flex items-center justify-center font-semibold">
                  {index + 1}
                </span>
                <span className="text-gray-900">{priority}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Summary */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Budget Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-600 mb-1">Total Budget</div>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(stats.totalBudget)}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-600 mb-1">Allocated</div>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(stats.budgetAllocated)}
            </div>
          </div>
          <div
            className={`rounded-lg p-4 ${
              stats.budgetRemaining < 0 ? "bg-red-50" : "bg-gray-50"
            }`}
          >
            <div
              className={`text-sm mb-1 ${
                stats.budgetRemaining < 0 ? "text-red-600" : "text-gray-600"
              }`}
            >
              Remaining
            </div>
            <div
              className={`text-2xl font-bold ${
                stats.budgetRemaining < 0 ? "text-red-900" : "text-gray-900"
              }`}
            >
              {formatCurrency(stats.budgetRemaining)}
            </div>
          </div>
        </div>

        {stats.budgetRemaining < 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800">
              ⚠️ <strong>Budget Alert:</strong> You've exceeded your budget by{" "}
              {formatCurrency(Math.abs(stats.budgetRemaining))}. Consider
              adjusting your allocations.
            </p>
          </div>
        )}

        {Object.keys(data.budgetCategories).filter(
          (key) => data.budgetCategories[key].amount > 0
        ).length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 font-medium mb-3">
              Budget Breakdown:
            </p>
            {Object.entries(data.budgetCategories)
              .filter(([_, cat]) => cat.amount > 0)
              .map(([key, cat]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {key}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({cat.percentage}%)
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(cat.amount)}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Vendor Summary */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Vendor Status
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalVendors}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Vendors</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-900">
              {stats.bookedVendors}
            </div>
            <div className="text-sm text-green-600 mt-1">Booked ✅</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-900">
              {stats.quotedVendors}
            </div>
            <div className="text-sm text-yellow-600 mt-1">Quoted</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-900">
              {stats.pendingVendors}
            </div>
            <div className="text-sm text-blue-600 mt-1">Pending</div>
          </div>
        </div>

        {data.vendorList.filter((v) => v.status === "booked").length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 font-medium mb-3">
              Confirmed Vendors:
            </p>
            {data.vendorList
              .filter((v) => v.status === "booked")
              .map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {vendor.name}
                    </div>
                    <div className="text-xs text-gray-600 capitalize">
                      {vendor.category.replace("-", " ")}
                    </div>
                  </div>
                  <span className="text-green-600 text-xl">✓</span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Task Summary */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Task Overview
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalTasks}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Tasks</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-900">
              {stats.completedTasks}
            </div>
            <div className="text-sm text-green-600 mt-1">Completed ✅</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-900">
              {stats.inProgressTasks}
            </div>
            <div className="text-sm text-blue-600 mt-1">In Progress</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-3xl font-bold text-red-900">
              {stats.overdueTasks}
            </div>
            <div className="text-sm text-red-600 mt-1">Overdue ⚠️</div>
          </div>
        </div>

        {stats.overdueTasks > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800">
              <strong>Action Required:</strong> You have {stats.overdueTasks}{" "}
              overdue {stats.overdueTasks === 1 ? "task" : "tasks"}. Review your
              Timeline & Tasks section.
            </p>
          </div>
        )}

        {data.taskList
          .filter((t) => t.status !== "completed" && t.priority === "high")
          .slice(0, 5).length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 font-medium mb-3">
              High Priority Tasks:
            </p>
            {data.taskList
              .filter((t) => t.status !== "completed" && t.priority === "high")
              .slice(0, 5)
              .map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-red-50 rounded-lg"
                >
                  <span className="text-red-600 text-xl flex-shrink-0">🔴</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">
                      {task.title}
                    </div>
                    {task.dueDate && (
                      <div className="text-xs text-gray-600">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Export & Share
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-[#CE805C] hover:bg-[#b86a4a] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            🖨️ Print Blueprint
          </button>
          <button
            onClick={exportData}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            💾 Download Data (JSON)
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Use Print to create a PDF for sharing, or download your data for
          backup.
        </p>
      </div>

      {/* Completion Checklist */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Pre-Wedding Checklist
        </h3>
        <div className="space-y-3">
          <ChecklistItem done={!!data.weddingDate} text="Wedding date set" />
          <ChecklistItem
            done={stats.topPriorities.length >= 3}
            text="Top priorities defined"
          />
          <ChecklistItem
            done={stats.totalBudget > 0}
            text="Budget established"
          />
          <ChecklistItem
            done={stats.budgetAllocated > 0}
            text="Budget allocated to categories"
          />
          <ChecklistItem
            done={stats.totalVendors >= 5}
            text="At least 5 vendors tracked"
          />
          <ChecklistItem
            done={stats.bookedVendors >= 3}
            text="Key vendors booked (venue, catering, photography)"
          />
          <ChecklistItem
            done={stats.totalTasks >= 10}
            text="Task list created"
          />
          <ChecklistItem
            done={taskCompletion >= 50}
            text="At least 50% of tasks completed"
          />
          <ChecklistItem
            done={stats.overdueTasks === 0}
            text="No overdue tasks"
          />
          <ChecklistItem
            done={data.niyyahDua && data.niyyahDua.trim().length > 0}
            text="Personal niyyah/dua written"
          />
        </div>

        {stats.totalVendors > 0 &&
          stats.totalTasks > 0 &&
          taskCompletion >= 80 &&
          stats.overdueTasks === 0 && (
            <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h4 className="text-xl font-bold text-green-900 mb-2">
                Congratulations!
              </h4>
              <p className="text-green-800">
                You're well-prepared for your special day! Keep up the great
                work! 💍
              </p>
            </div>
          )}
      </div>
    </div>
  );
}

// Checklist Item Component
function ChecklistItem({ done, text }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          done ? "bg-green-500 border-green-500" : "border-gray-300 bg-white"
        }`}
      >
        {done && <span className="text-white text-sm font-bold">✓</span>}
      </div>
      <span
        className={`text-sm ${
          done ? "text-gray-900 font-medium" : "text-gray-600"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

// Legacy checklists section
function LegacySection({ data, toggle, updateNotes }) {
  return (
    <div className="space-y-6">
      {data.checklists.map((sec) => (
        <div key={sec.id} className="bg-white border rounded-xl p-6">
          <h2 className="font-medium mb-4 text-lg">{sec.title}</h2>
          <ul className="space-y-3">
            {sec.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <input
                  id={`${sec.id}-${item.id}`}
                  type="checkbox"
                  className="h-5 w-5 rounded"
                  checked={item.done}
                  onChange={() => toggle(sec.id, item.id)}
                />
                <label
                  htmlFor={`${sec.id}-${item.id}`}
                  className="text-gray-900"
                >
                  {item.text}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-medium mb-4 text-lg">General Notes</h2>
        <textarea
          className="w-full min-h-[140px] border rounded-lg p-3"
          placeholder="Your personal notes…"
          value={data.notes}
          onChange={(e) => updateNotes(e.target.value)}
        />
      </div>
    </div>
  );
}
