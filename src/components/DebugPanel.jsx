import { useState, useEffect } from "react";
import { useAppContext } from "./InteractiveGuide";

/**
 * DebugPanel Component
 *
 * Displays real-time sync status and data persistence information
 * Only visible in test mode for debugging purposes
 */
export default function DebugPanel() {
  const { data, syncStatus, lastSynced, darkMode } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [localStorageSize, setLocalStorageSize] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Calculate localStorage size
    const stored = localStorage.getItem("hausaGuideData");
    if (stored) {
      setLocalStorageSize((stored.length / 1024).toFixed(2));
    }
    setLastUpdate(new Date());
  }, [data]);

  // Check if we're in test mode
  const params = new URLSearchParams(window.location.search);
  const isTestMode = params.get("test") === "true";

  if (!isTestMode) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-[100] ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border-2 rounded-lg shadow-2xl transition-all ${
        isExpanded ? "w-96" : "w-48"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between p-3 cursor-pointer ${
          darkMode ? "bg-gray-700" : "bg-gray-100"
        } rounded-t-lg`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              syncStatus === "syncing"
                ? "bg-yellow-500 animate-pulse"
                : syncStatus === "success"
                  ? "bg-green-500"
                  : syncStatus === "error"
                    ? "bg-red-500"
                    : "bg-gray-400"
            }`}
          />
          <span
            className={`text-xs font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            🔧 Debug Panel
          </span>
        </div>
        <span className="text-xs">{isExpanded ? "▼" : "▲"}</span>
      </div>

      {/* Content */}
      {isExpanded && (
        <div
          className={`p-4 space-y-3 text-xs ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          {/* Sync Status */}
          <div>
            <p className="font-semibold mb-1">Sync Status:</p>
            <p
              className={`${
                syncStatus === "success"
                  ? "text-green-600"
                  : syncStatus === "error"
                    ? "text-red-600"
                    : "text-yellow-600"
              }`}
            >
              {syncStatus.toUpperCase()}
            </p>
          </div>

          {/* Last Synced */}
          {lastSynced && (
            <div>
              <p className="font-semibold mb-1">Last Synced:</p>
              <p>{new Date(lastSynced).toLocaleTimeString()}</p>
            </div>
          )}

          {/* Last Update */}
          <div>
            <p className="font-semibold mb-1">Last Update:</p>
            <p>{lastUpdate.toLocaleTimeString()}</p>
          </div>

          {/* Data Size */}
          <div>
            <p className="font-semibold mb-1">LocalStorage Size:</p>
            <p>{localStorageSize} KB</p>
          </div>

          {/* Data Summary */}
          <div>
            <p className="font-semibold mb-1">Data Summary:</p>
            <ul className="space-y-1 pl-3">
              <li>
                ✓ Quiz: {data?.visionQuiz?.result ? "Completed" : "Not taken"}
              </li>
              <li>
                ✓ Budget:{" "}
                {data?.totalBudget
                  ? `₦${data.totalBudget.toLocaleString()}`
                  : "Not set"}
              </li>
              <li>✓ Vendors: {data?.vendorList?.length || 0}</li>
              <li>✓ Tasks: {data?.taskList?.length || 0}</li>
              <li>✓ Date: {data?.weddingDate || "Not set"}</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-300 space-y-2">
            <button
              onClick={() => {
                console.log("📊 Current Data:", data);
                alert("Check browser console for full data");
              }}
              className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
            >
              Log Data to Console
            </button>
            <button
              onClick={() => {
                const stored = localStorage.getItem("hausaGuideData");
                console.log(
                  "💾 LocalStorage Data:",
                  stored ? JSON.parse(stored) : null
                );
                alert("Check browser console for localStorage data");
              }}
              className="w-full px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded text-xs"
            >
              Check LocalStorage
            </button>
            <button
              onClick={() => {
                if (
                  confirm("Clear all test data? This will refresh the page.")
                ) {
                  localStorage.removeItem("hausaGuideData");
                  window.location.reload();
                }
              }}
              className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
            >
              Clear Test Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
