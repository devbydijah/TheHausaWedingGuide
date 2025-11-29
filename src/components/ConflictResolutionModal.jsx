import { useState } from "react";
import { Modal } from "./ui";
import { Warning, Cloud, HardDrive, GitMerge } from "@phosphor-icons/react";

/**
 * ConflictResolutionModal Component
 *
 * Shows when there's a conflict between local and cloud data.
 * Allows user to choose: Keep Cloud, Keep Local, or Merge.
 */
export default function ConflictResolutionModal({
  isOpen,
  onClose,
  cloudData,
  localData,
  onResolve,
  darkMode = false,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Calculate differences
  const getDifferences = () => {
    const diffs = [];

    // Compare each major section
    const sections = [
      { key: "visionQuiz", label: "Vision Quiz" },
      { key: "priorities", label: "Priorities" },
      { key: "totalBudget", label: "Total Budget" },
      { key: "budgetCategories", label: "Budget Categories" },
      { key: "vendorList", label: "Vendors" },
      { key: "taskList", label: "Tasks" },
      { key: "weddingDate", label: "Wedding Date" },
    ];

    sections.forEach((section) => {
      const cloudValue = cloudData?.[section.key];
      const localValue = localData?.[section.key];

      // Check if different
      if (JSON.stringify(cloudValue) !== JSON.stringify(localValue)) {
        diffs.push({
          section: section.label,
          cloud: cloudValue,
          local: localValue,
          isDifferent: true,
        });
      }
    });

    return diffs;
  };

  const differences = getDifferences();

  const handleResolve = () => {
    if (!selectedOption) return;

    let resolvedData;

    if (selectedOption === "cloud") {
      resolvedData = cloudData;
    } else if (selectedOption === "local") {
      resolvedData = localData;
    } else if (selectedOption === "merge") {
      // Merge strategy: Take newer data for each section
      resolvedData = {
        ...cloudData, // Start with cloud data
        ...localData, // Override with local data (assuming local is newer)

        // For arrays, merge intelligently
        vendorList: [
          ...(cloudData?.vendorList || []),
          ...(localData?.vendorList || []),
        ].filter((v, i, arr) => arr.findIndex((x) => x.id === v.id) === i), // Remove duplicates by ID

        taskList: [
          ...(cloudData?.taskList || []),
          ...(localData?.taskList || []),
        ].filter((t, i, arr) => arr.findIndex((x) => x.id === t.id) === i), // Remove duplicates by ID
      };
    }

    onResolve(resolvedData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Prevent closing without resolution
      title="Data Conflict Detected"
      darkMode={darkMode}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Warning Message */}
        <div
          className={`flex items-start gap-3 p-4 rounded-lg ${
            darkMode
              ? "bg-yellow-900/20 border border-yellow-800"
              : "bg-yellow-50 border border-yellow-200"
          }`}
        >
          <Warning
            size={24}
            weight="fill"
            className="text-yellow-600 flex-shrink-0 mt-0.5"
          />
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
              Your data has changed in multiple places
            </h3>
            <p
              className={`text-sm ${darkMode ? "text-yellow-200" : "text-yellow-700"}`}
            >
              We found differences between your cloud data and local data. This
              usually happens when you've edited your wedding plan on different
              devices or while offline. Please choose how to resolve this
              conflict.
            </p>
          </div>
        </div>

        {/* Differences Summary */}
        <div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`text-sm font-medium ${
              darkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-700"
            } underline`}
          >
            {showDetails ? "Hide" : "Show"} {differences.length} difference(s)
          </button>

          {showDetails && (
            <div
              className={`mt-3 space-y-2 p-3 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-gray-50"
              }`}
            >
              {differences.map((diff, index) => (
                <div key={index} className="text-sm">
                  <span className="font-semibold">{diff.section}:</span>
                  <span
                    className={darkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    {" "}
                    Different values found
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resolution Options */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Choose how to resolve:</h3>

          {/* Option 1: Keep Cloud Data */}
          <button
            onClick={() => setSelectedOption("cloud")}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selectedOption === "cloud"
                ? "border-[#CE805C] bg-[#CE805C]/10"
                : darkMode
                  ? "border-gray-700 hover:border-gray-600"
                  : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <Cloud
                size={24}
                weight="fill"
                className="text-[#CE805C] flex-shrink-0 mt-1"
              />
              <div>
                <h4 className="font-semibold mb-1">Keep Cloud Data</h4>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Use the data from the cloud and discard local changes. Choose
                  this if you want the most recent synced version.
                </p>
              </div>
            </div>
          </button>

          {/* Option 2: Keep Local Data */}
          <button
            onClick={() => setSelectedOption("local")}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selectedOption === "local"
                ? "border-[#740015] bg-[#740015]/10"
                : darkMode
                  ? "border-gray-700 hover:border-gray-600"
                  : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <HardDrive
                size={24}
                weight="fill"
                className="text-[#740015] flex-shrink-0 mt-1"
              />
              <div>
                <h4 className="font-semibold mb-1">Keep Local Data</h4>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Use your local changes and overwrite the cloud. Choose this if
                  your recent edits are more important.
                </p>
              </div>
            </div>
          </button>

          {/* Option 3: Merge Both */}
          <button
            onClick={() => setSelectedOption("merge")}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selectedOption === "merge"
                ? "border-[#531946] bg-[#531946]/10"
                : darkMode
                  ? "border-gray-700 hover:border-gray-600"
                  : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <GitMerge
                size={24}
                weight="fill"
                className="text-[#531946] flex-shrink-0 mt-1"
              />
              <div>
                <h4 className="font-semibold mb-1">Merge Both</h4>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Combine cloud and local data intelligently. Local changes will
                  be prioritized, and unique items (vendors, tasks) will be
                  merged.
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleResolve}
            disabled={!selectedOption}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedOption
                ? "bg-gradient-to-r from-[#CE805C] to-[#B87050] text-white hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Apply Resolution
          </button>
        </div>
      </div>
    </Modal>
  );
}
