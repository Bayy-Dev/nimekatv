import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Search as SearchIcon, Loader2, X } from "lucide-react";
import { AnimeCard } from "@/components/AnimeCard";
import { searchAnime, getOngoing, type OAnime } from "@/lib/otakudesu";

export default function SearchPage() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const initQ = params.get("q") || "";

  const [query, setQuery] = useState(initQ);
  const [results, setResults] = useState<OAnime[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function doSearch(q: string) {
    setLoading(true);
    try {
      if (q.trim().length >= 2) {
        const res = await searchAnime(q.trim());
        setResults(res.data?.animeList || []);
      } else {
        const res = await getOngoing(1);
        setResults(res.data?.animeList || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), query.length > 0 ? 600 : 0);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  useEffect(() => {
    if (initQ) { setQuery(initQ); doSearch(initQ); }
    else doSearch("");
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 pb-20 sm:pb-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Cari Anime</h1>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ketik judul anime..."
          className="w-full bg-card border border-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-muted-foreground">
          {query.trim() ? `Hasil: "${query}"` : "Sedang Tayang"}
        </h2>
        {!loading && <span className="text-xs text-muted-foreground">{results.length} anime</span>}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <SearchIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground text-lg font-medium">Tidak ada hasil</p>
          <p className="text-muted-foreground/60 text-sm mt-1">Coba kata kunci yang berbeda</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
          {results.map((a, i) => <AnimeCard key={i} anime={a} size="sm" />)}
        </div>
      )}
    </div>
  );
}
