import { Link } from "@tanstack/react-router";
import { PlayCircle, FileText, FileQuestion, Lock } from "lucide-react";
import type { Lecture } from "@/data/lectures";

export function LectureRow({ lecture, index }: { lecture: Lecture; index: number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-card p-3 transition-colors hover:border-primary/30">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-muted-foreground">
        {index + 1}
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-semibold text-card-foreground">{lecture.title}</h4>
        <p className="text-[11px] text-muted-foreground">{lecture.duration}</p>
      </div>

      <div className="flex items-center gap-1.5">
        {lecture.notesUrl && (
          <a
            href={lecture.notesUrl}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition-colors hover:bg-white/10"
            aria-label="Notes"
          >
            <FileText className="h-4 w-4" />
          </a>
        )}
        {lecture.dppUrl && (
          <a
            href={lecture.dppUrl}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition-colors hover:bg-white/10"
            aria-label="DPP"
          >
            <FileQuestion className="h-4 w-4" />
          </a>
        )}
        {lecture.isFree ? (
          <Link
            to="/lecture/$id"
            params={{ id: lecture.id }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary transition-colors hover:bg-primary/30"
            aria-label="Play"
          >
            <PlayCircle className="h-4 w-4" />
          </Link>
        ) : (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-muted-foreground">
            <Lock className="h-4 w-4" />
          </span>
        )}
      </div>
    </div>
  );
}
