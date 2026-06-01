import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, AlertCircle, Download } from "lucide-react";
import { getEpisode, type OEpisodeDetail } from "@/lib/otakudesu";
import { cn } from "@/lib/utils";

declare global { interface Window { Hls: any } }

function VideoPlayer({ streams }: { streams: { quality: string; url: string }[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const url = streams[activeIdx]?.url;
    if (!url || !videoRef.current) return;
    setError("");
    const vid = videoRef.current;
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }

    if (url.includes(".m3u8")) {
      import("hls.js").then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hlsRef.current = hls;
          hls.loadSource(url);
          hls.attachMedia(vid);
          hls.on(Hls.Events.MANIFEST_PARSED, () => vid.play().catch(() => {}));
          hls.on(Hls.Events.ERROR, (_: any, d: any) => { if (d.fatal) setError("Gagal load stream. Coba kualitas lain."); });
        } else if (vid.canPlayType("application/vnd.apple.mpegurl")) {
          vid.src = url; vid.play().catch(() => {});
        }
      });
    } else {
      vid.src = url; vid.play().catch(() => {});
    }
    return () => { hlsRef.current?.destroy(); };
  }, [activeIdx, streams]);

  if (!streams.length) return (
    <div className="aspect-video bg-black rounded-xl flex items-center justify-center">
      <div className="text-center text-white/60"><AlertCircle className="w-10 h-10 mx-auto mb-2" /><p className="text-sm">Tidak ada stream tersedia</p></div>
    </div>
  );

  return (
    <div>
      <div className="aspect-video bg-black rounded-xl overflow-hidden mb-3">
        <video ref={videoRef} controls playsInline className="w-full h-full" />
      </div>
      {streams.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Kualitas:</span>
          {streams.map((s, i) => (
            <button key={i} onClick={() => setActiveIdx(i)}
              className={cn("px-3 py-1 rounded-lg text-xs font-semibold border transition-all",
                i === activeIdx ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border text-muted-foreground hover:border-primary/50"
              )}>
              {s.quality}
            </button>
          ))}
        </div>
      )}
      {error && <p className="text-xs text-destructive mt-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
    </div>
  );
}

export default function WatchPage() {
  const { episodeId } = useParams<{ episodeId: string }>();
  const [ep, setEp] = useState<OEpisodeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!episodeId) return;
    setLoading(true);
    setEp(null);
    getEpisode(episodeId)
      .then(r => setEp(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
    window.scrollTo({ top: 0 });
  }, [episodeId]);

  const prevId = ep?.prevEpisode?.episodeId || ep?.prevEpisode?.href?.split("/").filter(Boolean).pop();
  const nextId = ep?.nextEpisode?.episodeId || ep?.nextEpisode?.href?.split("/").filter(Boolean).pop();
  const animeId = ep?.animeId || "";

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 pb-20 sm:pb-8">
      {animeId && (
        <Link href={`/anime/${animeId}`}>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke detail anime
          </button>
        </Link>
      )}

      {ep?.title && (
        <h1 className="text-lg sm:text-xl font-bold mb-4 line-clamp-2">
          {ep.anime && <span className="text-muted-foreground">{ep.anime} — </span>}
          {ep.title}
        </h1>
      )}

      {loading ? (
        <div className="aspect-video bg-card rounded-xl flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <VideoPlayer streams={ep?.streamingUrl || []} />
      )}

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between gap-3 mt-5">
        {prevId ? (
          <Link href={`/watch/${prevId}`}>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-primary/50 text-sm font-medium transition-colors">
              <ChevronLeft className="w-4 h-4" /> Episode Sebelumnya
            </button>
          </Link>
        ) : <div />}
        {nextId && (
          <Link href={`/watch/${nextId}`}>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-primary/50 text-sm font-medium transition-colors">
              Episode Berikutnya <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        )}
      </div>

      {/* Download */}
      {ep?.downloadUrl && ep.downloadUrl.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Download className="w-4 h-4 text-primary" /> Download</h3>
          <div className="flex flex-wrap gap-2">
            {ep.downloadUrl.map((d, i) => (
              <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-card border border-border hover:border-primary/50 text-xs font-medium transition-colors">
                <Download className="w-3.5 h-3.5" /> {d.quality} {d.provider && `(${d.provider})`}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
