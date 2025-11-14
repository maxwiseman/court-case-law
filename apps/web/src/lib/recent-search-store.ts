import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

type RecentSearchStoreState = { recentQueries: string[] };

type RecentSearchStoreActions = {
  addQuery: (newQuery: string) => void;
};

type RecentSearchStore = RecentSearchStoreState & RecentSearchStoreActions;

export const recentSearchStore = createStore<RecentSearchStore>()(
  persist(
    (set) => ({
      recentQueries: [],
      addQuery: (newQuery) =>
        set((prev) => ({
          recentQueries: [newQuery, ...prev.recentQueries.slice(0, 8)],
        })),
    }),
    { name: "recent-search-storage" }
  )
);
