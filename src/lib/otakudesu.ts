const BASE = "https://www.sankavollerei.com/otakudesu";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// ─── Types ───────────────────────────────────────────────
export interface OAnime {
  animeId: string;
  title: string;
  poster: string;
  episode?: string | number;
  episodes?: string | number;
  status?: string;
  score?: string | number;
  type?: string;
  genres?: string[];
  href?: string;
}

export interface OAnimeDetail {
  title: string;
  japanese?: string;
  poster: string;
  status: string;
  score?: string;
  type?: string;
  duration?: string;
  aired?: string;
  studios?: string;
  synopsis?: { paragraphs: string[] } | string;
  episodes?: string | number;
  genreList?: { title: string; genreId?: string; href?: string }[];
  episodeList?: { title: string; episodeId?: string; href?: string; date?: string }[];
}

export interface OEpisodeDetail {
  title?: string;
  anime?: string;
  animeId?: string;
  streamingUrl?: { quality: string; url: string }[];
  downloadUrl?: { quality: string; url: string; provider?: string }[];
  prevEpisode?: { episodeId?: string; href?: string } | null;
  nextEpisode?: { episodeId?: string; href?: string } | null;
}

export interface OListResponse {
  data: { animeList: OAnime[] };
}

export interface ODetailResponse {
  data: OAnimeDetail;
}

export interface OEpisodeResponse {
  data: OEpisodeDetail;
}

export interface OSearchResponse {
  data: { animeList: OAnime[] };
}

// ─── Functions ───────────────────────────────────────────
export function getOngoing(page = 1) {
  return apiFetch<OListResponse>(`/ongoing?page=${page}`);
}

export function getComplete(page = 1) {
  return apiFetch<OListResponse>(`/complete?page=${page}`);
}

export function searchAnime(q: string) {
  return apiFetch<OSearchResponse>(`/search?q=${encodeURIComponent(q)}`);
}

export function getAnimeDetail(animeId: string) {
  return apiFetch<ODetailResponse>(`/anime/${animeId}`);
}

export function getEpisode(episodeId: string) {
  return apiFetch<OEpisodeResponse>(`/episode/${episodeId}`);
}

export function getGenres() {
  return apiFetch<{ data: { genreId: string; title: string }[] }>(`/genres`);
}

export function getGenreAnime(genreId: string, page = 1) {
  return apiFetch<OListResponse>(`/genres/${genreId}?page=${page}`);
}

// ─── Helpers ─────────────────────────────────────────────
export function getAnimeId(anime: OAnime): string {
  return anime.animeId || anime.href?.split("/").filter(Boolean).pop() || "";
}
