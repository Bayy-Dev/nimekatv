// Local storage utilities

export function addToWatchlist(animeId: string, title: string, poster: string) {
  const list = getWatchlist();
  if (!list.find(a => a.id === animeId)) {
    list.push({ id: animeId, title, poster, addedAt: Date.now() });
    localStorage.setItem("nimeka_watchlist", JSON.stringify(list));
  }
}

export function removeFromWatchlist(animeId: string) {
  const list = getWatchlist().filter(a => a.id !== animeId);
  localStorage.setItem("nimeka_watchlist", JSON.stringify(list));
}

export function isInWatchlist(animeId: string): boolean {
  return getWatchlist().some(a => a.id === animeId);
}

export function getWatchlist() {
  try {
    return JSON.parse(localStorage.getItem("nimeka_watchlist") || "[]");
  } catch { return []; }
}

export function toggleFavorite(animeId: string) {
  const favs = getFavorites();
  const idx = favs.indexOf(animeId);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(animeId);
  localStorage.setItem("nimeka_favorites", JSON.stringify(favs));
  return idx < 0;
}

export function isFavorite(animeId: string): boolean {
  return getFavorites().includes(animeId);
}

export function getFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem("nimeka_favorites") || "[]");
  } catch { return []; }
}

export function getEpisodeViews(epId: string): number {
  try {
    const views = JSON.parse(localStorage.getItem("nimeka_views") || "{}");
    return views[epId] || 0;
  } catch { return 0; }
}

export function incrementEpisodeView(epId: string) {
  try {
    const views = JSON.parse(localStorage.getItem("nimeka_views") || "{}");
    views[epId] = (views[epId] || 0) + 1;
    localStorage.setItem("nimeka_views", JSON.stringify(views));
  } catch {}
}
