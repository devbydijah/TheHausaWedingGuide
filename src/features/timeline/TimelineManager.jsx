import { useState, useMemo, useRef, useEffect } from "react";
import {
  Calendar,
  CalendarBlank,
  Plus,
  FunnelSimple,
  X,
  PencilSimple,
  Trash,
  CheckCircle,
  Circle,
  CircleDashed,
  Clock,
  SortAscending,
  CaretDown,
  Warning,
} from "@phosphor-icons/react";
// Material UI Icons for enhanced timeline
import {
  EventAvailable,
  PriorityHigh,
  CheckCircle as MuiCheckCircle,
  RadioButtonUnchecked,
  MoreTime,
  CalendarToday,
} from "@mui/icons-material";
import { Card } from "../../components/ui";
import {
  TASK_CATEGORIES,
  TASK_PRIORITIES,
  TASK_STATUS,
} from "../../lib/constants";

// Common wedding tasks template
const COMMON_TASKS = [
  {
    title: "Set wedding budget",
    category: "Budget & Planning",
    priority: "urgent",
    daysBeforeWedding: 365,
  },
  {
    title: "Choose wedding date",
    category: "Budget & Planning",
    priority: "urgent",
    daysBeforeWedding: 365,
  },
  {
    title: "Book ceremony venue",
    category: "Venue & Logistics",
    priority: "high",
    daysBeforeWedding: 300,
  },
  {
    title: "Book reception venue",
    category: "Venue & Logistics",
    priority: "high",
    daysBeforeWedding: 300,
  },
  {
    title: "Hire photographer/videographer",
    category: "Vendors & Bookings",
    priority: "high",
    daysBeforeWedding: 270,
  },
  {
    title: "Select and order Kayan Lefe",
    category: "Kayan Lefe",
    priority: "high",
    daysBeforeWedding: 240,
  },
  {
    title: "Book caterer",
    category: "Vendors & Bookings",
    priority: "high",
    daysBeforeWedding: 210,
  },
  {
    title: "Choose wedding attire",
    category: "Attire & Beauty",
    priority: "high",
    daysBeforeWedding: 180,
  },
  {
    title: "Create guest list",
    category: "Guest List & Invitations",
    priority: "medium",
    daysBeforeWedding: 180,
  },
  {
    title: "Book makeup artist",
    category: "Attire & Beauty",
    priority: "medium",
    daysBeforeWedding: 150,
  },
  {
    title: "Send save-the-date cards",
    category: "Guest List & Invitations",
    priority: "medium",
    daysBeforeWedding: 120,
  },
  {
    title: "Order wedding invitations",
    category: "Guest List & Invitations",
    priority: "medium",
    daysBeforeWedding: 90,
  },
  {
    title: "Plan decor and theme",
    category: "Decor & Details",
    priority: "medium",
    daysBeforeWedding: 90,
  },
  {
    title: "Send wedding invitations",
    category: "Guest List & Invitations",
    priority: "medium",
    daysBeforeWedding: 60,
  },
  {
    title: "Final dress/attire fitting",
    category: "Attire & Beauty",
    priority: "high",
    daysBeforeWedding: 30,
  },
  {
    title: "Confirm all vendor bookings",
    category: "Vendors & Bookings",
    priority: "urgent",
    daysBeforeWedding: 14,
  },
  {
    title: "Create day-of timeline",
    category: "Day-of Coordination",
    priority: "high",
    daysBeforeWedding: 14,
  },
  {
    title: "Final venue walkthrough",
    category: "Venue & Logistics",
    priority: "high",
    daysBeforeWedding: 7,
  },
  {
    title: "Pack emergency kit",
    category: "Day-of Coordination",
    priority: "medium",
    daysBeforeWedding: 3,
  },
  {
    title: "Send thank you cards",
    category: "Post-Wedding",
    priority: "low",
    daysBeforeWedding: -30,
  },
];

/**
 * TimelineManager Component
 *
 * Comprehensive task management with filtering, sorting, countdown, and progress tracking
 */
export default function TimelineManager({
  data,
  addTask,
  updateTask,
  deleteTask,
  updateWeddingDate,
  toggleShowCompleted,
  setActiveSection,
  darkMode,
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [showFilters, setShowFilters] = useState(false);

  const modalRef = useRef(null);
  const titleInputRef = useRef(null);

  const weddingDate = data?.weddingDate;
  const tasks = data?.taskList || [];
  const showCompletedTasks = data?.showCompletedTasks !== false;

  // Focus title input when modal opens
  useEffect(() => {
    if (showModal && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [showModal]);

  // Calculate wedding countdown
  const getCountdown = () => {
    if (!weddingDate) return null;

    const wedding = new Date(weddingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    wedding.setHours(0, 0, 0, 0);

    const diffTime = wedding - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { days: Math.abs(diffDays), isPast: true };
    if (diffDays === 0) return { days: 0, isToday: true };
    return { days: diffDays, isFuture: true };
  };

  const countdown = getCountdown();

  // Filter and sort tasks with memoization
  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter((task) => {
      // Category filter
      if (filterCategory !== "all" && task.category !== filterCategory)
        return false;

      // Status filter
      if (filterStatus !== "all" && task.status !== filterStatus) return false;

      // Priority filter
      if (filterPriority !== "all" && task.priority !== filterPriority)
        return false;

      // Hide completed if toggled off
      if (!showCompletedTasks && task.status === "Completed") return false;

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);

        case "priority": {
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }

        case "category":
          return (a.category || "").localeCompare(b.category || "");

        case "status": {
          const statusOrder = {
            "Not Started": 0,
            "In Progress": 1,
            Waiting: 2,
            Completed: 3,
          };
          return statusOrder[a.status] - statusOrder[b.status];
        }

        default:
          return 0;
      }
    });

    return filtered;
  }, [
    tasks,
    filterCategory,
    filterStatus,
    filterPriority,
    sortBy,
    showCompletedTasks,
  ]);

  // Calculate task statistics
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const overdue = tasks.filter((t) => {
      if (t.status === "Completed" || !t.dueDate) return false;
      return new Date(t.dueDate) < new Date();
    }).length;
    const progressPercent =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, overdue, progressPercent };
  }, [tasks]);

  // Get priority display info
  const getPriorityInfo = (priority) => {
    const config = {
      urgent: {
        label: "Urgent",
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        dot: "bg-red-500",
      },
      high: {
        label: "High",
        color:
          "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        dot: "bg-orange-500",
      },
      medium: {
        label: "Medium",
        color:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        dot: "bg-yellow-500",
      },
      low: {
        label: "Low",
        color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400",
        dot: "bg-gray-400",
      },
    };
    return config[priority] || config.low;
  };

  // Get status display info
  const getStatusInfo = (status) => {
    const config = {
      "Not Started": {
        label: "Not Started",
        color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400",
        icon: <Circle size={20} weight="bold" />,
      },
      "In Progress": {
        label: "In Progress",
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        icon: <CircleDashed size={20} weight="bold" />,
      },
      Waiting: {
        label: "Waiting",
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        icon: <Clock size={20} weight="bold" />,
      },
      Completed: {
        label: "Completed",
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        icon: <CheckCircle size={20} weight="fill" />,
      },
    };
    return config[status] || config["Not Started"];
  };

  // Toggle task status (cycles through states)
  const handleToggleStatus = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const statusCycle = {
      "Not Started": "In Progress",
      "In Progress": "Completed",
      Waiting: "In Progress",
      Completed: "Not Started",
    };

    updateTask(taskId, { status: statusCycle[task.status] || "Not Started" });
  };

  // Handle add common tasks
  const handleAddCommonTasks = () => {
    if (!weddingDate) {
      alert("Please set your wedding date first!");
      return;
    }

    const wedding = new Date(weddingDate);

    COMMON_TASKS.forEach((template) => {
      const dueDate = new Date(wedding);
      dueDate.setDate(dueDate.getDate() - template.daysBeforeWedding);

      const newTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: template.title,
        category: template.category,
        priority: template.priority,
        status: "Not Started",
        dueDate: dueDate.toISOString().split("T")[0],
        notes: "",
        createdAt: new Date().toISOString(),
      };

      addTask(newTask);
    });
  };

  // Handle save task (add or update)
  const handleSaveTask = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const taskData = {
      title: formData.get("title"),
      category: formData.get("category"),
      dueDate: formData.get("dueDate") || null,
      status: formData.get("status"),
      priority: formData.get("priority"),
      notes: formData.get("notes") || "",
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask({
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      });
    }

    setShowModal(false);
    setEditingTask(null);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterCategory("all");
    setFilterStatus("all");
    setFilterPriority("all");
  };

  const hasActiveFilters =
    filterCategory !== "all" ||
    filterStatus !== "all" ||
    filterPriority !== "all";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#CE805C] to-[#B87050] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 text-center">
          <Calendar
            size={72}
            weight="duotone"
            className="mx-auto mb-4"
            aria-hidden="true"
          />
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold mb-3">
            Timeline & Tasks
          </h1>
          <p className="font-inter text-lg opacity-90">
            Organize tasks and track deadlines
          </p>
        </div>
      </div>

      {/* Wedding Date Selector */}
      {!weddingDate && (
        <Card className="!p-6 border-2 border-[#CE805C] bg-gradient-to-br from-[#CE805C]/5 to-[#B87050]/5">
          <div className="flex items-start gap-4">
            <Warning
              size={32}
              weight="duotone"
              className="text-[#CE805C] flex-shrink-0"
            />
            <div className="flex-1">
              <h3 className="font-playfair text-xl font-bold mb-2 bg-gradient-to-r from-[#740015] to-[#531946] bg-clip-text text-transparent">
                Set Your Wedding Date
              </h3>
              <p
                className={`text-sm mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Choose your wedding date to enable countdown, task scheduling,
                and timeline features.
              </p>
              <div className="flex gap-3 items-center flex-wrap">
                <input
                  type="date"
                  id="wedding-date-picker"
                  className={`px-4 py-2.5 rounded-lg border-2 border-[#CE805C] focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                    darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-gray-900"
                  }`}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    if (e.target.value) {
                      updateWeddingDate(e.target.value);
                    }
                  }}
                />
                <span
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Select your special day
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Wedding Countdown */}
      {countdown && (
        <Card className="!p-6 sm:!p-8 text-center bg-gradient-to-br from-[#CE805C]/10 to-[#B87050]/10 border-2 border-[#CE805C]/30">
          <div className="flex items-center justify-center gap-3 mb-3">
            <CalendarBlank
              size={40}
              weight="duotone"
              className="text-[#CE805C]"
            />
            <div className="text-5xl sm:text-6xl font-bold">
              {countdown.isToday ? (
                <span className="bg-gradient-to-r from-[#740015] to-[#531946] bg-clip-text text-transparent">
                  Today!
                </span>
              ) : countdown.isPast ? (
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  {countdown.days} days ago
                </span>
              ) : (
                <span className="bg-gradient-to-r from-[#CE805C] to-[#B87050] bg-clip-text text-transparent">
                  {countdown.days}
                </span>
              )}
            </div>
          </div>
          <p
            className={`font-inter text-sm sm:text-base font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            {countdown.isToday
              ? "Your wedding day is here! Alhamdulillah! 🎉"
              : countdown.isPast
                ? "since your beautiful wedding"
                : "days until your special day"}
          </p>
          {weddingDate && (
            <p
              className={`text-xs mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Wedding Date:{" "}
              {new Date(weddingDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </Card>
      )}

      {/* Progress Overview */}
      <Card className="!p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-playfair text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#740015] to-[#531946] bg-clip-text text-transparent">
            Overall Progress
          </h2>
          <span className="font-inter text-2xl sm:text-3xl font-bold text-[#CE805C]">
            {taskStats.progressPercent}%
          </span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#CE805C] to-[#B87050] transition-all duration-500 rounded-full"
            style={{ width: `${taskStats.progressPercent}%` }}
            role="progressbar"
            aria-valuenow={taskStats.progressPercent}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {taskStats.total}
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Tasks
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {taskStats.completed}
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Completed
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {taskStats.overdue}
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Overdue
            </div>
          </div>
        </div>
      </Card>

      {/* Actions Bar */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => {
            setEditingTask(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#CE805C] to-[#B87050] text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#CE805C]/50"
        >
          <Plus size={20} weight="bold" />
          Add Task
        </button>

        {tasks.length === 0 && weddingDate && (
          <button
            onClick={handleAddCommonTasks}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold border-2 transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#CE805C]/50 ${
              darkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Calendar size={20} weight="bold" />
            Add Common Tasks
          </button>
        )}

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold border-2 transition-all focus:outline-none focus:ring-4 focus:ring-[#CE805C]/50 ${
            showFilters || hasActiveFilters
              ? "border-[#CE805C] bg-[#CE805C]/10 text-[#CE805C] dark:bg-[#CE805C]/20"
              : darkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <FunnelSimple size={20} weight="bold" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-[#CE805C] text-white text-xs rounded-full">
              {
                [filterCategory, filterStatus, filterPriority].filter(
                  (f) => f !== "all"
                ).length
              }
            </span>
          )}
        </button>

        <div className="flex-1" />

        {tasks.some((t) => t.status === "Completed") && (
          <button
            onClick={toggleShowCompleted}
            className={`text-sm font-medium underline transition-colors ${
              darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {showCompletedTasks ? "Hide" : "Show"} Completed
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="!p-4">
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Filter Tasks
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-orange-600 dark:text-orange-400 hover:underline font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="all">All Categories</option>
                {TASK_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="all">All Statuses</option>
                {TASK_STATUS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="all">All Priorities</option>
                {TASK_PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Sort Controls */}
      {filteredTasks.length > 0 && (
        <div className="flex items-center gap-2">
          <SortAscending
            size={20}
            className={darkMode ? "text-gray-400" : "text-gray-600"}
          />
          <span
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="category">Category</option>
            <option value="status">Status</option>
          </select>
        </div>
      )}

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <Card className="!p-12 text-center">
          <CheckCircle
            size={72}
            weight="duotone"
            className={`mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`}
          />
          <h3
            className={`font-playfair text-2xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {hasActiveFilters
              ? "No tasks match your filters"
              : tasks.length === 0
                ? "No tasks yet"
                : "All tasks completed!"}
          </h3>
          <p
            className={`font-inter mb-6 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {hasActiveFilters
              ? "Try adjusting your filters"
              : tasks.length === 0
                ? "Add your first task or import common wedding tasks"
                : "Great job staying organized!"}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-gradient-to-r from-[#CE805C] to-[#B87050] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Clear Filters
            </button>
          )}
        </Card>
      ) : (
        <ul className="space-y-3" role="list">
          {filteredTasks.map((task) => {
            const priorityInfo = getPriorityInfo(task.priority);
            const statusInfo = getStatusInfo(task.status);
            const isOverdue =
              task.status !== "Completed" &&
              task.dueDate &&
              new Date(task.dueDate) < new Date();
            const isCompleted = task.status === "Completed";

            return (
              <li
                key={task.id}
                className={`${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } border-2 rounded-xl p-4 transition-all hover:shadow-md ${
                  isCompleted ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Status Toggle Button */}
                  <button
                    onClick={() => handleToggleStatus(task.id)}
                    className={`flex-shrink-0 p-2 rounded-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      statusInfo.color
                    }`}
                    aria-label={`Mark as ${
                      task.status === "Completed"
                        ? "not completed"
                        : task.status === "In Progress"
                          ? "completed"
                          : "in progress"
                    }`}
                    title={`Current status: ${task.status}. Click to change.`}
                  >
                    {statusInfo.icon}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3
                        className={`font-inter font-semibold text-lg ${
                          isCompleted
                            ? darkMode
                              ? "text-gray-500 line-through"
                              : "text-gray-400 line-through"
                            : darkMode
                              ? "text-white"
                              : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </h3>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setShowModal(true);
                          }}
                          className={`p-2 rounded-lg transition-colors hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            darkMode
                              ? "hover:bg-gray-700 text-gray-400"
                              : "hover:bg-gray-100 text-gray-600"
                          }`}
                          aria-label="Edit task"
                        >
                          <PencilSimple size={18} weight="bold" />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this task?"
                              )
                            ) {
                              deleteTask(task.id);
                            }
                          }}
                          className="p-2 rounded-lg transition-colors hover:scale-110 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          aria-label="Delete task"
                        >
                          <Trash size={18} weight="bold" />
                        </button>
                      </div>
                    </div>

                    {/* Task Meta */}
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      {/* Category Badge */}
                      <span
                        className={`px-2.5 py-1 rounded-lg font-medium ${
                          darkMode
                            ? "bg-[#CE805C]/20 text-[#CE805C]"
                            : "bg-[#CE805C]/10 text-[#740015]"
                        }`}
                      >
                        {task.category}
                      </span>

                      {/* Priority Badge with accessible text */}
                      <span
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium ${priorityInfo.color}`}
                        title={`${priorityInfo.label} priority`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${priorityInfo.dot}`}
                          aria-hidden="true"
                        />
                        <span className="text-xs font-bold">
                          {priorityInfo.label[0]}
                        </span>
                        <span className="sr-only">
                          {priorityInfo.label} priority
                        </span>
                      </span>

                      {/* Due Date */}
                      {task.dueDate && (
                        <span
                          className={`px-2.5 py-1 rounded-lg font-medium ${
                            isOverdue
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : darkMode
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <CalendarBlank
                            size={14}
                            weight="bold"
                            className="inline mr-1"
                          />
                          {new Date(task.dueDate).toLocaleDateString()}
                          {isOverdue && " (Overdue)"}
                        </span>
                      )}

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-1 rounded-lg font-medium ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Notes */}
                    {task.notes && (
                      <p
                        className={`mt-3 text-sm leading-relaxed ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Task Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="task-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setEditingTask(null);
            }
          }}
        >
          <div
            ref={modalRef}
            className={`w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h2
                id="task-modal-title"
                className={`font-playfair text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {editingTask ? "Edit Task" : "Add New Task"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingTask(null);
                }}
                className={`p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
                aria-label="Close modal"
              >
                <X size={24} weight="bold" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveTask} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label
                  htmlFor="task-title"
                  className={`block text-sm font-semibold mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Task Title *
                </label>
                <input
                  ref={titleInputRef}
                  type="text"
                  id="task-title"
                  name="title"
                  defaultValue={editingTask?.title || ""}
                  required
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="e.g., Book photographer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Category */}
                <div>
                  <label
                    htmlFor="task-category"
                    className={`block text-sm font-semibold mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Category *
                  </label>
                  <select
                    id="task-category"
                    name="category"
                    defaultValue={editingTask?.category || TASK_CATEGORIES[0]}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    {TASK_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label
                    htmlFor="task-dueDate"
                    className={`block text-sm font-semibold mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="task-dueDate"
                    name="dueDate"
                    defaultValue={editingTask?.dueDate || ""}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    aria-describedby="date-format-note"
                  />
                  <span id="date-format-note" className="sr-only">
                    Format: YYYY-MM-DD
                  </span>
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="task-status"
                    className={`block text-sm font-semibold mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Status *
                  </label>
                  <select
                    id="task-status"
                    name="status"
                    defaultValue={editingTask?.status || "Not Started"}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    {TASK_STATUS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label
                    htmlFor="task-priority"
                    className={`block text-sm font-semibold mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Priority *
                  </label>
                  <select
                    id="task-priority"
                    name="priority"
                    defaultValue={editingTask?.priority || "medium"}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    {TASK_PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="task-notes"
                  className={`block text-sm font-semibold mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Notes (optional)
                </label>
                <textarea
                  id="task-notes"
                  name="notes"
                  defaultValue={editingTask?.notes || ""}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="Add any additional details..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTask(null);
                  }}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold border-2 transition-all focus:outline-none focus:ring-4 focus:ring-gray-500/50 ${
                    darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#CE805C] to-[#B87050] text-white rounded-lg font-semibold hover:shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-orange-500/50"
                >
                  {editingTask ? "Save Changes" : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
