/**
 * @file src/utils/cx.ts
 * @desc Class-name merger: drops falsy values and resolves Tailwind conflicts with tailwind-merge,
 *       so a later class (the caller's) replaces an earlier one that sets the same property.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { twMerge } from "tailwind-merge";

/** A class name, or a falsy value to skip (handy for `cond && "class"`). */
export type ClassValue = string | false | null | undefined | 0;

/**
 * @function cx
 * @param classes {ClassValue[]} class strings; falsy values are skipped
 * @returns {string} the classes in order with Tailwind conflicts resolved for the later class
 */
export const cx = (...classes: ClassValue[]): string => twMerge(...classes);
