import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

/**
 * Merge Tailwind classes safely. Use for all variant props on primitives.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
