import { type ClassValue, clsx } from "clsx"
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isPastDate = (date: Date) => {
  return dayjs(date).isBefore(dayjs(), 'day');
};
