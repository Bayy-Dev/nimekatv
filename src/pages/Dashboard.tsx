import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronRight, TrendingUp, CheckCircle, Play, ChevronLeft, Star, Loader2 } from "lucide-react";
import { AnimeCard } from "@/components/AnimeCard";
import { getOngoing, getComplete, type OAnime, getAnimeId } from "@/lib/otakudesu";

function HeroCarousel({ anime }: { anime: OAnime[] }) {
  const [current, setCurrent] = useState(0);
  const heroes = anime.slice(0, 8);

  useEffect(() => {
    if (!heroes.length) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % heroes.length), 5000);
    return () => clearInterval(t);
  }, [heroes.length]);

  if (!heroes.length) return null;
  const hero = heroes[current];
  const id = getAnimeId(hero);

  return (
    <div className="relative w-full h-[280px] sm:h-[420px] rounded-2xl overflow-hidden mb-8 shadow-2xl">
      <img
        src={hero.poster}
        alt={hero.title}
        className="w-full h-full object-cover object-top transition-all duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

      <div className="absolute bottom-0 left-0 p-4 sm:p-8 max-w-lg">
        <div className="flex items-center gap-2 mb-2">
          {hero.score && (
            <span className="flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/40 rounded-full px-2 py-0.5 text-xs font-medium text-yellow-400">
              <Star className="w-3 h-3 fill-yellow-400" /> {hero.score}
            </span>
          )}
          {hero.episode && (
            <span className="bg-primary/20 border border-primary/40 rounded-full px-2 py-0.5 text-xs font-medium text-primary">
              Eps {hero.episode}
            </span>
          )}
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-white mb-4 line-clamp-2">{hero.title}</h1>
        <Link href={`/anime/${id}`}>
          <button className="flex items-center gap-2 bg-primary hover:opacity-90 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-opacity shadow-lg">
            <Play className="w-4 h-4 fill-white" /> Tonton Sekarang
          </button>
        </Link>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 flex gap-1.5">
        {heroes.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-primary" : "w-1.5 bg-white/40"}`} />
        ))}
      </div>

      <button onClick={() => setCurrent(c => (c - 1 + heroes.length) % heroes.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full transition-colors">
        <ChevronLeft className="w-4 h-4 text-white" />
      </button>
      <button onClick={() => setCurrent(c => (c + 1) % heroes.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full transition-colors">
        <ChevronRight className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}

export default function Dashboard() {
  const [ongoing, setOngoing] = useState<OAnime[]>([]);
  const [complete, setComplete] = useState<OAnime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load page 1 & 2 for both ongoing and complete to get more anime
    Promise.all([
      getOngoing(1), getOngoing(2),
      getComplete(1), getComplete(2),
    ])
      .then(([on1, on2, com1, com2]) => {
        const onList = [
          ...(on1.data?.animeList || []),
          ...(on2.data?.animeList || []),
        ];
        const comList = [
          ...(com1.data?.animeList || []),
          ...(com2.data?.animeList || []),
        ];
        setOngoing(onList);
        setComplete(comList);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Memuat anime...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 pb-4">
      <HeroCarousel anime={ongoing} />

      {/* Ongoing */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Sedang Tayang
            <span className="text-sm font-normal text-muted-foreground">({ongoing.length})</span>
          </h2>
          <Link href="/ongoing">
            <button className="flex items-center gap-1 text-sm text-primary hover:opacity-80 font-medium">
              Lihat semua <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3">
          {ongoing.slice(0, 24).map((a, i) => <AnimeCard key={i} anime={a} size="sm" />)}
        </div>
      </section>

      {/* Complete */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" /> Baru Tamat
            <span className="text-sm font-normal text-muted-foreground">({complete.length})</span>
          </h2>
          <Link href="/complete">
            <button className="flex items-center gap-1 text-sm text-primary hover:opacity-80 font-medium">
              Lihat semua <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3">
          {complete.slice(0, 24).map((a, i) => <AnimeCard key={i} anime={a} size="sm" />)}
        </div>
      </section>
    </div>
  );
}
