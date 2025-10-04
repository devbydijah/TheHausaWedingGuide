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
  taskList: [], // Array of { task, dueDate, category, completed }
  milestones: [], // Key dates (e.g., engagement, nikah)

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
  const [activeSection, setActiveSection] = useState("vision"); // Track active section
  const [saveStatus, setSaveStatus] = useState(""); // "Saving..." or "Saved"

  // Wrapper to show save feedback
  const updateData = (updater) => {
    setSaveStatus("Saving...");
    setData(updater);
    setTimeout(() => setSaveStatus("Saved"), 1000);
    setTimeout(() => setSaveStatus(""), 2000);
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

  const completed = data.checklists.reduce(
    (acc, s) => acc + s.items.filter((i) => i.done).length,
    0
  );
  const total = data.checklists.reduce((acc, s) => acc + s.items.length, 0);
  const pct = Math.round((completed / Math.max(1, total)) * 100);

  const sections = [
    { id: "vision", name: "Vision & Values" },
    { id: "budget", name: "Budget Builder" },
    { id: "vendors", name: "Vendor Tracker" },
    { id: "timeline", name: "Timeline & Tasks" },
    { id: "legacy", name: "Legacy Checklists" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Hausa Wedding Guide
            </h1>
            <div className="flex items-center gap-4">
              {saveStatus && (
                <span className="text-sm text-green-600">{saveStatus}</span>
              )}
              <a
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 underline"
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
      <main className="max-w-5xl mx-auto px-4 py-8">
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
        {activeSection === "timeline" && <TimelineSection data={data} />}
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
    { value: "researching", label: "Researching", color: "bg-gray-100 text-gray-700" },
    { value: "contacted", label: "Contacted", color: "bg-blue-100 text-blue-700" },
    { value: "quoted", label: "Quoted", color: "bg-yellow-100 text-yellow-700" },
    { value: "booked", label: "Booked", color: "bg-green-100 text-green-700" },
    { value: "declined", label: "Declined", color: "bg-red-100 text-red-700" },
  ];

  // Filter vendors
  const filteredVendors = data.vendorList.filter((vendor) => {
    const categoryMatch = filterCategory === "all" || vendor.category === filterCategory;
    const statusMatch = filterStatus === "all" || vendor.status === filterStatus;
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
    return statuses.find((s) => s.value === status)?.color || "bg-gray-100 text-gray-700";
  };

  const getCategoryLabel = (categoryValue) => {
    return categories.find((c) => c.value === categoryValue)?.label || categoryValue;
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Vendor Tracker</h2>
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

function TimelineSection({ data }) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-xl font-semibold mb-4">Timeline & Tasks</h2>
      <p className="text-gray-600">
        Coming soon! Manage your wedding timeline and tasks.
      </p>
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
