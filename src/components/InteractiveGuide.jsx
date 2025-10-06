import { useState, useEffect } from 'react';
import { useSyncToCloud } from '../hooks/useSyncToCloud';
import { Toast } from './ui';
import { DEFAULT_GUIDE } from '../lib/constants';

// Feature Components
import { Dashboard } from '../features/dashboard';
import VisionQuiz from '../features/vision-quiz/VisionQuiz';
import VisionPlanner from '../features/vision/VisionPlanner';
import BudgetBuilder from '../features/budget/BudgetBuilder';
import VendorTracker from '../features/vendors/VendorTracker';
import TimelineManager from '../features/timeline/TimelineManager';
import FinalBlueprint from '../features/blueprint/FinalBlueprint';

/**
 * InteractiveGuide Component
 * 
 * Main orchestration component for the wedding planning application
 * Manages global state, navigation, and feature routing
 * 
 * Refactored: Sprint 2 - Reduced from 3753 lines to ~400 lines
 */
export default function InteractiveGuide({ auth }) {
  // Cloud sync hook - replaces localStorage-only approach
  const {
    data,
    updateData: setData,
    syncStatus,
    lastSynced,
    isCloudEnabled,
  } = useSyncToCloud(auth, DEFAULT_GUIDE);

  const [activeSection, setActiveSection] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('hwg:darkMode');
    return saved === 'true';
  });
  const [toasts, setToasts] = useState([]);

  // Toast notification system
  const showToast = (message, type = 'success') => {
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
    if (syncStatus === 'success' && lastSynced) {
      showToast('Changes saved', 'success');
    } else if (syncStatus === 'error') {
      showToast('Failed to sync - saved locally', 'error');
    }
  }, [syncStatus, lastSynced]);

  // Dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem('hwg:darkMode', newValue.toString());
      return newValue;
    });
    showToast(darkMode ? 'Light mode enabled' : 'Dark mode enabled', 'info');
  };

  // Export data to JSON file
  const exportData = () => {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hausa-wedding-guide-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Data exported successfully!', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      showToast('Failed to export data', 'error');
    }
  };

  // Import data from JSON file
  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);

          if (typeof importedData === 'object' && importedData !== null) {
            setData(importedData);
            showToast('Data imported successfully!', 'success');
          } else {
            showToast('Invalid data format', 'error');
          }
        } catch (error) {
          console.error('Import failed:', error);
          showToast('Failed to import data - invalid JSON', 'error');
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };

  // Wrapper to update data
  const updateData = (updater) => {
    setData(updater);
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
  };

  const resetQuiz = () => {
    if (!confirm('Are you sure you want to retake the quiz? This will reset your answers.')) return;
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

      if (field === 'percentage') {
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
    if (!confirm('Are you sure you want to delete this vendor?')) return;
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
    if (!confirm('Are you sure you want to delete this task?')) return;
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
    { id: 'dashboard', name: '📊 Dashboard' },
    { id: 'quiz', name: '💎 Vision Quiz' },
    { id: 'vision', name: '✨ Vision & Values' },
    { id: 'budget', name: '💰 Budget Builder' },
    { id: 'vendors', name: '🏪 Vendor Tracker' },
    { id: 'timeline', name: '📅 Timeline & Tasks' },
    { id: 'blueprint', name: '📋 Final Blueprint' },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Toast Notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Header with navigation */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-b'} sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className={`font-playfair text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Hausa Wedding Guide
            </h1>
            
            <div className="flex items-center gap-3">
              {/* Sync Status */}
              {isCloudEnabled && (
                <div className="flex items-center gap-2 text-sm">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {syncStatus === 'syncing' && '⏳ Syncing...'}
                    {syncStatus === 'success' && '✓ Saved'}
                    {syncStatus === 'error' && '✕ Error'}
                  </span>
                </div>
              )}

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span>
              </button>

              {/* Export/Import */}
              <div className="flex gap-2">
                <button
                  onClick={exportData}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Export
                </button>
                <button
                  onClick={importData}
                  className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Import
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-2 overflow-x-auto pb-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-[#990200] to-[#531946] text-white'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {section.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeSection === 'dashboard' && (
          <Dashboard data={data} setActiveSection={setActiveSection} />
        )}
        {activeSection === 'quiz' && (
          <VisionQuiz
            data={data}
            updateQuizAnswer={updateQuizAnswer}
            submitQuiz={submitQuiz}
            resetQuiz={resetQuiz}
            setActiveSection={setActiveSection}
          />
        )}
        {activeSection === 'vision' && (
          <VisionPlanner
            data={data}
            updatePriorities={updatePriorities}
            updateField={updateField}
            setActiveSection={setActiveSection}
          />
        )}
        {activeSection === 'budget' && (
          <BudgetBuilder
            data={data}
            updateTotalBudget={updateTotalBudget}
            updateCategoryField={updateCategoryField}
            setActiveSection={setActiveSection}
          />
        )}
        {activeSection === 'vendors' && (
          <VendorTracker
            data={data}
            addVendor={addVendor}
            updateVendor={updateVendor}
            deleteVendor={deleteVendor}
            setActiveSection={setActiveSection}
          />
        )}
        {activeSection === 'timeline' && (
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
        {activeSection === 'blueprint' && (
          <FinalBlueprint data={data} setActiveSection={setActiveSection} />
        )}
      </main>
    </div>
  );
}
