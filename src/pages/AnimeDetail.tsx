import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import {
  ArrowLeft, Star, Play, Tv, Clock, Calendar, Users,
  Loader2, PlayCircle, Search, ChevronDown, ChevronUp, Grid3X3, List
} from "lucide-react";
import { getAnimeDetail, type OAnimeDetail } from "@/lib/otakudesu";
import { cn } from "@/lib/utils";

function EpisodeList({ episodes }: { episodes: NonNullable<OAnimeDetail["episodeList"]> }) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const PAGE = 48;

  const filtered = query.trim()
    ? episodes.filter(e => (e.title || "").toLowerCase().includes(query.toLowerCase()))
    : episodes;
  const displayed = showAll ? filtered : filtered.slice(0, PAGE);

  if (!episodes.length) {
    return (
      <div className="py-10 text-center text-muted-foreground bg-card rounded-xl border border-border">
        Belum ada episode tersedia.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-primary" />
          Daftar Episode
          <span className="text-sm font-normal text-muted-foreground">({episodes.length})</span>
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex bg-card border border-border rounded-lg p-0.5">
            <button onClick={() => setView("grid")} className={cn("p-1.5 rounded-md transition-colors", view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setView("list")} className={cn("p-1.5 rounded-md transition-colors", view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
              <List className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text" placeholder="Cari episode..." value={query}
              onChange={e => setQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:border-primary w-40 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="py-8 text-center text-muted-foreground bg-card rounded-xl border border-border">
          Tidak ada episode cocok dengan "{query}".
        </div>
      )}

      {view === "grid" ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-2">
          {displayed.map((ep, idx) => {
            const epId = ep.episodeId || ep.href?.split("/").filter(Boolean).pop();
            const num = episodes.length - episodes.indexOf(ep);
            return (
              <Link key={epId || idx} href={`/watch/${epId}`}>
                <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/10 transition-all group cursor-pointer text-center">
                  <span className="text-[10px] text-muted-foreground">Ep</span>
                  <span className="text-base font-bold group-hover:text-primary transition-colors">{num}</span>
                  {ep.date && <span className="text-[9px] text-muted-foreground mt-0.5 line-clamp-1">{ep.date}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {displayed.map((ep, idx) => {
            const epId = ep.episodeId || ep.href?.split("/").filter(Boolean).pop();
            const num = episodes.length - episodes.indexOf(ep);
            return (
              <Link key={epId || idx} href={`/watch/${epId}`}>
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/10 transition-all group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">{num}</span>
                    <span className="font-medium group-hover:text-primary transition-colors text-sm line-clamp-1">{ep.title || `Episode ${num}`}</span>
                  </div>
                  {ep.date && <span className="text-xs text-muted-foreground shrink-0 ml-3">{ep.date}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {filtered.length > PAGE && (
        <button onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          {showAll ? <><ChevronUp className="w-4 h-4" /> Tampilkan lebih sedikit</> : <><ChevronDown className="w-4 h-4" /> Tampilkan semua {filtered.length} episode</>}
        </button>
      )}
    </div>
  );
}

export default function AnimeDetail() {
  const { animeId } = useParams<{ animeId: string }>();
  const [anime, setAnime] = useState<OAnimeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!animeId) return;
    setLoading(true);
    getAnimeDetail(animeId)
      .then(r => setAnime(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [animeId]);

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  if (!anime) return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-xl font-bold mb-2">Anime tidak ditemukan</p>
      <Link href="/"><button className="text-primary hover:underline text-sm">← Kembali ke beranda</button></Link>
    </div>
  );

  const synopsis = typeof anime.synopsis === "object" ? anime.synopsis?.paragraphs?.join("\n\n") : anime.synopsis || "-";
  const firstEp = anime.episodeList?.[anime.episodeList.length - 1];
  const firstEpId = firstEp?.episodeId || firstEp?.href?.split("/").filter(Boolean).pop();

  return (
    <div className="pb-16">
      {/* Backdrop */}
      <div className="relative w-full h-[45vh] min-h-[320px] overflow-hidden bg-background">
        <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover opacity-25 blur-xl scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 relative z-10 -mt-56">
        <Link href="/"><button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Kembali</button></Link>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 mb-8">
          {/* Poster */}
          <div className="w-[160px] sm:w-[200px] shrink-0 mx-auto md:mx-0">
            <div className="rounded-xl overflow-hidden shadow-2xl border border-border/50 aspect-[3/4] bg-card">
              <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover" />
            </div>
            {firstEpId && (
              <Link href={`/watch/${firstEpId}`}>
                <button className="w-full mt-4 flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity shadow-lg">
                  <Play className="w-4 h-4 fill-current" /> Mulai Nonton
                </button>
              </Link>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pt-2 md:pt-24">
            <h1 className="text-2xl sm:text-4xl font-black mb-1 leading-tight">{anime.title}</h1>
            {anime.japanese && <p className="text-base text-muted-foreground mb-4 italic">{anime.japanese}</p>}

            <div className="flex flex-wrap gap-2 mb-5">
              {anime.genreList?.map((g, i) => {
                const gId = g.genreId || g.href?.split("/").filter(Boolean).pop();
                return <Link key={i} href={`/search?q=${g.title}`}><span className="px-2.5 py-1 rounded-full bg-card border border-border hover:border-primary/50 text-xs font-medium cursor-pointer transition-colors">{g.title}</span></Link>;
              })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { icon: Star, label: "Skor", val: anime.score, color: "text-yellow-400" },
                { icon: Tv, label: "Tipe", val: anime.type },
                { icon: Clock, label: "Durasi", val: anime.duration },
                { icon: Calendar, label: "Rilis", val: anime.aired },
              ].map(({ icon: Icon, label, val, color }) => (
                <div key={label} className="p-3 rounded-xl bg-card border border-border">
                  <div className={cn("flex items-center gap-1.5 text-muted-foreground text-xs mb-1", color)}>
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </div>
                  <div className="text-sm font-bold">{val || "N/A"}</div>
                </div>
              ))}
            </div>

            {anime.studios && (
              <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                <Users className="w-4 h-4" /> <span className="font-medium text-foreground">{anime.studios}</span>
              </div>
            )}

            <div>
              <h3 className="font-bold mb-2 text-sm text-muted-foreground uppercase tracking-wide">Sinopsis</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-5">{synopsis}</p>
            </div>
          </div>
        </div>

        {/* Episodes */}
        <EpisodeList episodes={anime.episodeList || []} />
      </div>
    </div>
  );
}
