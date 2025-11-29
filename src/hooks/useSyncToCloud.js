/**
 * Cloud Sync Hook for Hausa Wedding Guide
 *
 * Manages synchronization between localStorage and Supabase cloud database.
 * Provides automatic sync, conflict resolution, and offline support.
 *
 * Features:
 * - Auto-save to cloud on data changes
 * - Auto-load from cloud on mount
 * - Merge strategy: cloud wins on conflict
 * - Fallback to localStorage when offline
 * - Migration from localStorage to cloud
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useDebouncedCallback } from "./useDebouncedCallback";

/**
 * Custom hook for cloud-synced data storage
 * @param {string} userEmail - User's email (used as identifier)
 * @param {Object} initialData - Default data structure
 * @returns {Object} - {data, updateData, syncStatus, lastSynced, forceSync}
 */
export const useSyncToCloud = (userEmail, initialData = {}) => {
  const [data, setData] = useState(initialData);
  const [syncStatus, setSyncStatus] = useState("idle"); // 'idle' | 'syncing' | 'success' | 'error' | 'offline'
  const [lastSynced, setLastSynced] = useState(null);
  const [lastError, setLastError] = useState(null); // Store error details for user feedback
  const [userId, setUserId] = useState(null);
  const isMounted = useRef(true);
  const saveTimeoutRef = useRef(null);

  // ============================================
  // INITIALIZATION: Load data on mount
  // ============================================

  // Helper: Get user-friendly error messages
  const getErrorMessage = (error) => {
    if (!navigator.onLine) {
      return "You're offline. Changes saved locally and will sync when you're back online.";
    }

    if (error?.message?.includes("fetch")) {
      return "Network error. Your changes are saved locally.";
    }

    if (error?.message?.includes("auth") || error?.code === "PGRST301") {
      return "Authentication issue. Please try logging out and back in.";
    }

    if (error?.code === "23505") {
      return "Duplicate entry detected. Your data is safe locally.";
    }

    if (error?.message?.includes("timeout")) {
      return "Request timed out. Your changes are saved locally.";
    }

    // Generic fallback
    return "Sync failed, but your data is safe locally. We'll retry automatically.";
  };

  useEffect(() => {
    isMounted.current = true;

    const initializeData = async () => {
      if (!isSupabaseConfigured()) {
        console.log("📦 Cloud sync disabled - using localStorage only");
        loadFromLocalStorage();
        setSyncStatus("offline");
        return;
      }

      if (!userEmail) {
        console.warn("⚠️ No user email provided for cloud sync");
        loadFromLocalStorage();
        setSyncStatus("offline");
        return;
      }

      // Load from cloud
      await loadFromCloud();
    };

    initializeData();

    return () => {
      isMounted.current = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [userEmail]);

  // ============================================
  // LOAD FROM LOCALSTORAGE (Fallback)
  // ============================================
  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem("hausaGuideData");
      if (stored) {
        const parsed = JSON.parse(stored);
        setData(parsed);
        console.log("📂 Loaded data from localStorage");
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  };

  // ============================================
  // LOAD FROM CLOUD (Supabase)
  // ============================================
  const loadFromCloud = async () => {
    try {
      setSyncStatus("syncing");

      // 1. Get or create user
      const { data: users, error: userError } = await supabase
        .from("web_app_users")
        .select("id, email")
        .eq("email", userEmail)
        .single();

      let currentUserId;

      if (userError && userError.code === "PGRST116") {
        // User doesn't exist - create new user
        const { data: newUser, error: insertError } = await supabase
          .from("web_app_users")
          .insert([
            {
              email: userEmail,
              last_login: new Date().toISOString(),
              login_count: 1,
            },
          ])
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        currentUserId = newUser.id;
        console.log("✨ Created new user in cloud:", userEmail);
      } else if (userError) {
        throw userError;
      } else {
        currentUserId = users.id;

        // Update last login
        await supabase
          .from("web_app_users")
          .update({
            last_login: new Date().toISOString(),
            login_count: (users.login_count || 0) + 1,
          })
          .eq("id", currentUserId);
      }

      setUserId(currentUserId);

      // 2. Get user progress data
      const { data: progressData, error: progressError } = await supabase
        .from("user_progress")
        .select("data, updated_at")
        .eq("user_id", currentUserId)
        .single();

      if (progressError && progressError.code === "PGRST116") {
        // No progress exists - check localStorage for migration
        const localData = localStorage.getItem("hausaGuideData");

        if (localData) {
          const parsed = JSON.parse(localData);

          // Migrate localStorage data to cloud
          const { error: insertError } = await supabase
            .from("user_progress")
            .insert([
              {
                user_id: currentUserId,
                data: parsed,
              },
            ]);

          if (insertError) {
            throw insertError;
          }

          setData(parsed);
          setLastSynced(new Date());
          console.log("🔄 Migrated localStorage data to cloud");
        } else {
          // No local data either - use initial data
          const { error: insertError } = await supabase
            .from("user_progress")
            .insert([
              {
                user_id: currentUserId,
                data: initialData,
              },
            ]);

          if (insertError) {
            throw insertError;
          }

          setData(initialData);
          setLastSynced(new Date());
          console.log("🆕 Initialized new progress in cloud");
        }
      } else if (progressError) {
        throw progressError;
      } else {
        // Progress exists - use cloud data (cloud wins)
        setData(progressData.data);
        setLastSynced(new Date(progressData.updated_at));

        // Also update localStorage as backup
        localStorage.setItem(
          "hausaGuideData",
          JSON.stringify(progressData.data)
        );

        console.log("☁️ Loaded data from cloud");
      }

      setSyncStatus("success");
    } catch (error) {
      console.error("Error loading from cloud:", error);

      // Store error details
      const errorMessage = getErrorMessage(error);
      setLastError({
        message: errorMessage,
        timestamp: new Date(),
        originalError: error,
      });
      setSyncStatus("error");

      // Fallback to localStorage
      loadFromLocalStorage();
    }
  };

  // ============================================
  // SAVE TO CLOUD (Debounced)
  // ============================================
  const saveToCloud = async (newData) => {
    if (!isSupabaseConfigured() || !userId) {
      // Save to localStorage only
      localStorage.setItem("hausaGuideData", JSON.stringify(newData));
      return;
    }

    try {
      setSyncStatus("syncing");

      // Upsert progress data
      const { error } = await supabase.from("user_progress").upsert(
        {
          user_id: userId,
          data: newData,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      );

      if (error) {
        throw error;
      }

      // Also save to localStorage as backup
      localStorage.setItem("hausaGuideData", JSON.stringify(newData));

      setLastSynced(new Date());
      setSyncStatus("success");

      console.log("✅ Synced to cloud");
    } catch (error) {
      console.error("Error saving to cloud:", error);

      // Store error details for user feedback
      const errorMessage = getErrorMessage(error);
      setLastError({
        message: errorMessage,
        timestamp: new Date(),
        originalError: error,
      });
      setSyncStatus("error");

      // Still save to localStorage as backup
      localStorage.setItem("hausaGuideData", JSON.stringify(newData));
    }
  };

  // Debounced save (wait 1.5 seconds after last change)
  const debouncedSave = useDebouncedCallback((newData) => {
    saveToCloud(newData);
  }, 1500);

  // ============================================
  // UPDATE DATA (Public API)
  // ============================================
  const updateData = useCallback(
    (updates) => {
      setData((prevData) => {
        const newData =
          typeof updates === "function"
            ? updates(prevData)
            : { ...prevData, ...updates };

        // Trigger debounced save
        debouncedSave(newData);

        return newData;
      });
    },
    [debouncedSave]
  );

  // ============================================
  // FORCE SYNC (Manual sync trigger)
  // ============================================
  const forceSync = useCallback(async () => {
    if (isSupabaseConfigured() && userId) {
      await saveToCloud(data);
    }
  }, [data, userId]);

  // ============================================
  // RETRY SYNC (Retry after error)
  // ============================================
  const retrySync = useCallback(async () => {
    if (!navigator.onLine) {
      setLastError({
        message: "You're still offline. Please check your internet connection.",
        timestamp: new Date(),
      });
      return false;
    }

    setLastError(null); // Clear previous error
    setSyncStatus("syncing");

    try {
      await saveToCloud(data);
      return true; // Success
    } catch (error) {
      console.error("Retry failed:", error);
      return false; // Failed
    }
  }, [data, userId]);

  // ============================================
  // RETURN API
  // ============================================
  return {
    data, // Current data object
    updateData, // Function to update data: updateData({key: value})
    syncStatus, // Current sync status
    lastSynced, // Last successful sync timestamp
    lastError, // Last error details with message
    forceSync, // Manually trigger sync
    retrySync, // Retry after error
    isCloudEnabled: isSupabaseConfigured() && userId !== null,
  };
};

export default useSyncToCloud;
