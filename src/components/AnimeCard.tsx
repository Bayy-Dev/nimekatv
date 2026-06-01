import { Link } from "wouter";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { type OAnime, getAnimeId } from "@/lib/otakudesu";

interface Props {
  anime: OAnime;
  size?: "sm" | "md";
}

export function AnimeCard({ anime, size = "md" }: Props) {
  const id = getAnimeId(anime);
  const ep = anime.episode || anime.episodes;

  return (
    <Link href={`/anime/${id}`}>
      <div className={cn(
        "group relative bg-card border border-border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5",
      )}>
        <div className={cn("relative overflow-hidden", size === "sm" ? "aspect-[3/4]" : "aspect-[2/3]")}>
          <img
            src={anime.poster}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {ep && (
            <div className="absolute top-2 left-2">
              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow">
                Eps {ep}
              </span>
            </div>
          )}

          {anime.score && (
            <div className="absolute top-2 right-2">
              <span className="flex items-center gap-0.5 bg-black/60 backdrop-blur text-yellow-400 text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
                <Star className="w-2.5 h-2.5 fill-yellow-400" />
                {anime.score}
              </span>
            </div>
          )}

          {anime.status && (
            <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                anime.status.toLowerCase().includes("ongoing") || anime.status.toLowerCase().includes("airing")
                  ? "bg-green-500/80 text-white"
                  : "bg-blue-500/80 text-white"
              )}>
                {anime.status}
              </span>
            </div>
          )}
        </div>

        <div className={cn("p-2", size === "sm" ? "p-1.5" : "p-2")}>
          <h3 className={cn(
            "font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors",
            size === "sm" ? "text-xs" : "text-xs sm:text-sm"
          )}>
            {anime.title}
          </h3>
          {anime.type && (
            <p className="text-[10px] text-muted-foreground mt-0.5">{anime.type}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
