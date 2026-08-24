import { Link } from "@tanstack/react-router";
import { Clock, PlayCircle, BookOpen } from "lucide-react";
import type { Batch } from "@/data/batches";

export function BatchCard({ batch }: { batch: Batch }) {
  return (
    <Link
      to="/study/batch/$id"
      params={{ id: batch.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
    >
      <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <span className="absolute right-3 top-3 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
          {batch.price}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 text-base font-bold text-card-foreground group-hover:text-primary">
          {batch.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {batch.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2 text-[11px] font-semibold text-muted-foreground">
          {batch.totalLectures > 0 && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1">
              <PlayCircle className="h-3.5 w-3.5" />
              {batch.totalLectures} lectures
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1">
            <Clock className="h-3.5 w-3.5" />
            {batch.durationWeeks} weeks
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {batch.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
