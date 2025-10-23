// src/lib/normalizeGuideData.js
// Utility to normalize user guide data for backward compatibility and consistent key usage

/**
 * Normalizes the guide data object to use consistent keys and structure.
 * Handles migration from legacy keys (e.g., weddingPriorities, visionQuiz.result, vendors) to new keys.
 *
 * @param {object} data - The raw guide data object (from localStorage, Supabase, etc.)
 * @returns {object} - The normalized guide data object
 */
export function normalizeGuideData(data = {}) {
  const normalized = { ...data };

  // Priorities: migrate weddingPriorities (array or object) to priorities (object)
  if (Array.isArray(normalized.weddingPriorities)) {
    // If old array format, convert to object with default keys
    const [cultural = 5, budget = 5, family = 5, personal = 5] = normalized.weddingPriorities;
    normalized.priorities = { cultural, budget, family, personal };
  } else if (normalized.weddingPriorities && typeof normalized.weddingPriorities === 'object') {
    normalized.priorities = { ...normalized.weddingPriorities };
  }
  // If already using priorities, leave as is
  if (!normalized.priorities) {
    normalized.priorities = { cultural: 5, budget: 5, family: 5, personal: 5 };
  }
  delete normalized.weddingPriorities;

  // Vision Result: migrate visionQuiz.result to visionResult
  if (normalized.visionQuiz && normalized.visionQuiz.result) {
    normalized.visionResult = normalized.visionQuiz.result;
  }
  // If already using visionResult, leave as is

  // Vendors: migrate vendors (array) to vendorList
  if (Array.isArray(normalized.vendors)) {
    normalized.vendorList = [...normalized.vendors];
  }
  if (!Array.isArray(normalized.vendorList)) {
    normalized.vendorList = [];
  }
  delete normalized.vendors;

  // Ensure other commonly expected keys exist with safe defaults
  if (!normalized.timeline) normalized.timeline = [];
  if (!normalized.budget) normalized.budget = { items: [], total: 0 };
  if (!normalized.visionQuiz) normalized.visionQuiz = { answers: [] };

  return normalized;
}
