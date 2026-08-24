import { createFileRoute } from "@tanstack/react-router";
import { Heart, Users, BookOpen, Send } from "lucide-react";
import { DRAWER_LINKS } from "@/data/menu";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — STUDYxANSHU" },
      { name: "description", content: "About STUDYxANSHU and ANSHU KESHAWAT. Free education for every student." },
      { property: "og:title", content: "About Us — STUDYxANSHU" },
      { property: "og:description", content: "About STUDYxANSHU and ANSHU KESHAWAT. Free education for every student." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen px-4 pt-20 pb-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <img
            src="/brand-logo.jpg"
            alt="STUDYxANSHU logo"
            className="mx-auto mb-4 h-24 w-24 rounded-full object-cover ring-1 ring-primary/30"
          />
          <h1 className="text-2xl font-extrabold text-foreground">About STUDYxANSHU</h1>
          <p className="mt-1 text-sm text-muted-foreground">Free education platform by ANSHU KESHAWAT</p>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-card p-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            STUDYxANSHU is a free education platform built to provide quality learning resources to every student without any cost.
          </p>
          <p>
            We offer live classes, recorded lectures, DPP, notes, quizzes and full test series across multiple batches.
          </p>

          <div className="grid gap-3 pt-2 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <BookOpen className="mb-2 h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">Free Courses</h3>
              <p className="text-xs">All batches are 100% free.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Users className="mb-2 h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">Community</h3>
              <p className="text-xs">Learn together on Telegram & WhatsApp.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={DRAWER_LINKS.joinTelegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-4 py-2 text-xs font-bold text-sky-300"
            >
              <Send className="h-3.5 w-3.5" />
              Telegram
            </a>
            <a
              href={DRAWER_LINKS.whatsappChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-xs font-bold text-green-300"
            >
              Join WhatsApp
            </a>
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          Made with <Heart className="h-3 w-3 text-red-400" /> from Sugandhnagar
        </p>
      </div>
    </div>
  );
}
