/**
 * @file cn.ts
 * @path src/shared/utils/cn.ts
 * @description ฟังก์ชันจัดการและผสานรวมคลาสสไตล์ Tailwind (Tailwind Class Merger Utility)
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
