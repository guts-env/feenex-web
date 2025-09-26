import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUserName(firstName?: string, lastName?: string, middleName?: string) {
  const parts = [firstName, middleName, lastName].filter(Boolean)
  return parts.join(' ') || ''
}
