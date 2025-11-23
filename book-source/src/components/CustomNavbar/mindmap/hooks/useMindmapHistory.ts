import { useState, useEffect, useCallback } from 'react';
import { MindmapData } from '../types';

const STORAGE_KEY = 'mindmap-history';
const MAX_HISTORY_ITEMS = 50;

export function useMindmapHistory() {
  const [history, setHistory] = useState<MindmapData[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading mindmap history:', error);
      setHistory([]);
    }
  }, []);

  // Save to localStorage whenever history changes
  const saveToStorage = useCallback((items: MindmapData[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving mindmap history:', error);
    }
  }, []);

  // Add a mindmap to history
  const addToHistory = useCallback(
    (mindmap: MindmapData) => {
      setHistory((prev) => {
        // Remove duplicates (same level mindmaps)
        const filtered = prev.filter((item) => item.level !== mindmap.level);

        // Add new item to the beginning
        const updated = [mindmap, ...filtered];

        // Limit to MAX_HISTORY_ITEMS
        const limited = updated.slice(0, MAX_HISTORY_ITEMS);

        saveToStorage(limited);
        return limited;
      });
    },
    [saveToStorage]
  );

  // Remove a mindmap from history
  const removeFromHistory = useCallback(
    (id: string) => {
      setHistory((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  // Rename a mindmap
  const renameMindmap = useCallback(
    (id: string, newTitle: string) => {
      setHistory((prev) => {
        const updated = prev.map((item) =>
          item.id === id ? { ...item, title: newTitle.trim() } : item
        );
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing mindmap history:', error);
    }
  }, []);

  // Get a specific mindmap by ID
  const getMindmap = useCallback(
    (id: string): MindmapData | undefined => {
      return history.find((item) => item.id === id);
    },
    [history]
  );

  return {
    history,
    addToHistory,
    removeFromHistory,
    renameMindmap,
    clearHistory,
    getMindmap,
  };
}
