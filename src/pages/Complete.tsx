import { useState, useEffect } from "react";
import { CheckCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimeCard } from "@/components/AnimeCard";
import { getComplete, type OAnime } from "@/lib/otakudesu";

export default function Complete() {
  const [list, setList] = useState<OAnime[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getComplete(page)
      .then(r => setList(r.data?.animeList || []))
      .catch(console.error)
      .finally(() => setLoading(false));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 pb-20 sm:pb-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
        <CheckCircle className="w-6 h-6 text-green-400" /> Anime Tamat
      </h1>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
          {list.map((a, i) => <AnimeCard key={i} anime={a} size="sm" />)}
        </div>
      )}

      <div className="flex items-center justify-center gap-3 mt-8">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors">
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
        <span className="text-sm text-muted-foreground font-medium">Halaman {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={loading || list.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
