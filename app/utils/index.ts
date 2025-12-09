import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Converts a file size in bytes to a human-readable format.
 *
 * The function automatically determines the appropriate unit (KB, MB, or GB)
 * based on the size and returns a formatted string with 2 decimal places.
 *
 * @param bytes - The file size in bytes to be formatted
 * @returns A formatted string representing the size in the most appropriate unit
 *
 * @example
 * ```ts
 * formatSize(0);           // "0 Bytes"
 * formatSize(1024);        // "1.00 KB"
 * formatSize(1536);        // "1.50 KB"
 * formatSize(1048576);     // "1.00 MB"
 * formatSize(5242880);     // "5.00 MB"
 * formatSize(1073741824);  // "1.00 GB"
 * ```
 *
 * @remarks
 * - Uses binary conversion (1 KB = 1024 bytes)
 * - Returns values with 2 decimal places for precision
 * - Scales automatically: Bytes → KB → MB → GB
 */
export const formatSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;

  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;

  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
};


export const generateUUID = () => {
    return crypto.randomUUID();
}

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(...inputs));
}