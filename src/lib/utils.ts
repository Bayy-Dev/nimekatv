import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number | null | undefined): string {
  if (!score) return "N/A";
  return score.toFixed(1);
}

export function formatNumber(n: number | null | undefined): string {
  if (!n) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function getStatusColor(status: string): string {
  if (status.toLowerCase().includes("ongoing") || status.toLowerCase().includes("airing")) return "text-green-400";
  if (status.toLowerCase().includes("complete") || status.toLowerCase().includes("finished")) return "text-blue-400";
  return "text-muted-foreground";
}

export function getDayOrder(day?: string): number {
  if (!day) return -1;
  const order = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
  return order.indexOf(day.toLowerCase());
}

export function getTodayName(): string {
  const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  return days[new Date().getDay()];
}

export function getYoutubeEmbedUrl(youtubeId: string | null): string | null {
  if (!youtubeId) return null;
  return `https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0`;
}
