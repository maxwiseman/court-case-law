import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dedupeObjectList<T, K extends PropertyKey>(
  arr: T[],
  key: (item: T) => K
): T[] {
  const seen = new Set<K>();
  return arr.reduce<T[]>((acc, item) => {
    const k = key(item);
    if (!seen.has(k)) {
      seen.add(k);
      acc.push(item);
    }
    return acc;
  }, []);
}
