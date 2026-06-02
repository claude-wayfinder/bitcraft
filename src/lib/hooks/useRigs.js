import { useState, useEffect } from 'react';

const STORAGE_KEY = 'bitcraft-rigs';

/**
 * Manages the user's mining rig fleet.
 * MVP: persists to localStorage. Post-MVP: Supabase.
 */
export function useRigs() {
  const [rigs, setRigs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rigs));
  }, [rigs]);

  const addRig = (rig) => {
    const newRig = {
      ...rig,
      id: crypto.randomUUID(),
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setRigs((prev) => [...prev, newRig]);
    return newRig;
  };

  const updateRig = (id, updates) => {
    setRigs((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const removeRig = (id) => {
    setRigs((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleRig = (id) => {
    setRigs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_active: !r.is_active } : r))
    );
  };

  return { rigs, addRig, updateRig, removeRig, toggleRig };
}
