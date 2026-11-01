import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX = 8;

interface RecentlyViewedState {
  handles: string[];
  add: (handle: string) => void;
}

// Product handles the shopper has opened, newest first (kept in localStorage).
export const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      handles: [],
      add: (handle) =>
        set((s) => ({ handles: [handle, ...s.handles.filter((h) => h !== handle)].slice(0, MAX) })),
    }),
    { name: "bincohub-recently-viewed" },
  ),
);
