import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLanguageSwitchText({
  language,
  value,
  value_ar,
}: {
  language: "en" | "ar";
  value: string;
  value_ar?: string;
}): string {
  return language === "en" ? value : (value_ar ?? value);
}
