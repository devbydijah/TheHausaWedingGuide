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
        {activeSection === "budget" && <BudgetSection data={data} />}
        {activeSection === "vendors" && <VendorSection data={data} />}
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

// Placeholder sections (we'll build these next)
function BudgetSection({ data }) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-xl font-semibold mb-4">Budget Builder</h2>
      <p className="text-gray-600">
        Coming soon! This will include budget tracking and category breakdowns.
      </p>
    </div>
  );
}

function VendorSection({ data }) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-xl font-semibold mb-4">Vendor Tracker</h2>
      <p className="text-gray-600">
        Coming soon! Track all your wedding vendors here.
      </p>
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
