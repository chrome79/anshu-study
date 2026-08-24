import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getLectureById } from "@/data/lectures";
import { getBatchById } from "@/data/batches";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ArrowLeft, FileText, FileQuestion } from "lucide-react";

export const Route = createFileRoute("/lecture/$id")({
  head: () => ({
    meta: [
      { title: "Lecture — STUDYxANSHU" },
      { name: "description", content: "Watch lecture video, download notes and DPP." },
      { property: "og:title", content: "Lecture — STUDYxANSHU" },
      { property: "og:description", content: "Watch lecture video, download notes and DPP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ params }) => {
    const lecture = getLectureById(params.id);
    if (!lecture) throw notFound();
    const batch = getBatchById(lecture.batchId);
    return { lecture, batch };
  },
  component: LecturePage,
});

function LecturePage() {
  const { lecture, batch } = Route.useLoaderData();

  return (
    <div className="min-h-screen px-4 pt-20 pb-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to={batch ? "/study/batch/$id" : "/study/batches"}
          params={batch ? { id: batch.slug } : undefined}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {batch ? batch.title : "batches"}
        </Link>

        <h1 className="mb-4 text-xl font-extrabold text-foreground sm:text-2xl">{lecture.title}</h1>

        <VideoPlayer src={lecture.streamUrl} title={lecture.title} />

        <div className="mt-4 flex flex-wrap gap-3">
          {lecture.notesUrl && lecture.notesUrl !== "#" && (
            <a
              href={lecture.notesUrl}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/20"
            >
              <FileText className="h-4 w-4" />
              Notes
            </a>
          )}
          {lecture.dppUrl && lecture.dppUrl !== "#" && (
            <a
              href={lecture.dppUrl}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/20"
            >
              <FileQuestion className="h-4 w-4" />
              DPP
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
