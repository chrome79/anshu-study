import { createFileRoute, notFound } from "@tanstack/react-router";
import { getBatchBySlug } from "@/data/batches";
import { getLecturesByBatchId } from "@/data/lectures";
import { LectureRow } from "@/components/LectureRow";
import { BookOpen, Clock, PlayCircle } from "lucide-react";

export const Route = createFileRoute("/study/batch/$id")({
  head: () => ({
    meta: [
      { title: "Batch Details — STUDYxANSHU" },
      { name: "description", content: "View lectures, notes and DPP for this batch." },
      { property: "og:title", content: "Batch Details — STUDYxANSHU" },
      { property: "og:description", content: "View lectures, notes and DPP for this batch." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ params }) => {
    const batch = getBatchBySlug(params.id);
    if (!batch) throw notFound();
    const lectures = getLecturesByBatchId(batch.id);
    return { batch, lectures };
  },
  component: BatchDetailPage,
});

function BatchDetailPage() {
  const { batch, lectures } = Route.useLoaderData();

  return (
    <div className="min-h-screen px-4 pt-20 pb-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-card p-6">
          <div className="mb-4 flex aspect-video items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10">
            <BookOpen className="h-16 w-16 text-primary/60" />
          </div>
          <h1 className="mb-2 text-2xl font-extrabold text-card-foreground">{batch.title}</h1>
          <p className="mb-4 text-sm text-muted-foreground">{batch.description}</p>
          <div className="flex flex-wrap gap-3 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-3 py-1.5">
              <PlayCircle className="h-3.5 w-3.5" />
              {batch.totalLectures} lectures
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-3 py-1.5">
              <Clock className="h-3.5 w-3.5" />
              {batch.durationWeeks} weeks
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-emerald-300">
              {batch.price}
            </span>
          </div>
        </div>

        <h2 className="mb-3 text-lg font-bold text-foreground">Lectures</h2>
        <div className="space-y-3">
          {lectures.length > 0 ? (
            lectures.map((lecture, i) => (
              <LectureRow key={lecture.id} lecture={lecture} index={i} />
            ))
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Lectures for this batch will be added soon.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
