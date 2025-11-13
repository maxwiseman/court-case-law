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

/**
 * Convert a string to Title Case (English-style) with options.
 *
 * - Preserves fully uppercase words (acronyms) when preserveAcronyms is true.
 * - Keeps exception words (articles, conjunctions, short prepositions) lowercase
 *   unless they are the first or last word in the string.
 *
 * @param input - The input string to convert.
 * @param options - Optional settings:
 *    exceptions: array of words to keep lowercase (default: common English small words).
 *    preserveAcronyms: if true, keep fully uppercase words unchanged (default: true).
 *    forceAllWords: if true, ignore exceptions and title-case every word (default: false).
 * @returns The title-cased string.
 */
export function toTitleCase(
  input: string,
  options?: {
    exceptions?: string[];
    preserveAcronyms?: boolean;
    forceAllWords?: boolean;
  }
): string {
  const defaultExceptions = [
    "a",
    "an",
    "the",
    "and",
    "but",
    "or",
    "nor",
    "for",
    "so",
    "yet",
    "at",
    "around",
    "by",
    "after",
    "along",
    "from",
    "of",
    "on",
    "to",
    "with",
    "without",
    "over",
    "under",
    "in",
    "into",
    "onto",
    "per",
  ];

  const {
    exceptions = defaultExceptions,
    preserveAcronyms = true,
    forceAllWords = false,
  } = options || {};

  if (!input) return input;

  const exceptionSet = new Set(exceptions.map((w) => w.toLowerCase()));

  // Split on whitespace to preserve punctuation attached to words.
  // We'll operate on word tokens but keep surrounding punctuation intact.
  const tokens = input.split(/\s+/);

  const capitalize = (word: string) => {
    if (!word) return word;
    if (word.length === 1) return word.toUpperCase();
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  };

  const isAllUpper = (word: string) => /^[A-Z0-9]+$/.test(word);

  const stripEdgePunct = (word: string) => {
    // capture leading/trailing punctuation
    const leading = word.match(/^[^A-Za-z0-9]*/)?.[0] ?? "";
    const trailing = word.match(/[^A-Za-z0-9]*$/)?.[0] ?? "";
    const core = word.slice(leading.length, word.length - trailing.length);
    return { leading, core, trailing };
  };

  const n = tokens.length;
  const resultTokens = tokens.map((tok, idx) => {
    const { leading, core, trailing } = stripEdgePunct(tok);

    if (!core) {
      // token is only punctuation
      return tok;
    }

    // If preserving acronyms and core is fully uppercase (letters/digits), keep it.
    if (preserveAcronyms && isAllUpper(core)) {
      return leading + core + trailing;
    }

    const lowerCore = core.toLowerCase();

    const isFirstOrLast = idx === 0 || idx === n - 1;

    if (!forceAllWords && exceptionSet.has(lowerCore) && !isFirstOrLast) {
      return leading + lowerCore + trailing;
    }

    // Handle internal hyphenated words, e.g., "state-of-the-art" or "self-employed"
    const hyphenProcessed = core
      .split(/(-)/)
      .map((part) => {
        // keep hyphens as-is since split keeps separator tokens
        if (part === "-") return part;
        // For parts that are all uppercase (acronym components), preserve if requested
        if (preserveAcronyms && isAllUpper(part)) return part;
        return capitalize(part);
      })
      .join("");

    return leading + hyphenProcessed + trailing;
  });

  // Re-join with single spaces (original spacing may have been multiple spaces).
  return resultTokens.join(" ");
}
