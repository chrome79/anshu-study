import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Play, Users, Award, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "STUDYxANSHU — Free Education Platform" },
      { name: "description", content: "Free live classes, recorded lectures, DPP, notes and test series by ANSHU KESHAWAT." },
      { property: "og:title", content: "STUDYxANSHU — Free Education Platform" },
      { property: "og:description", content: "Free live classes, recorded lectures, DPP, notes and test series by ANSHU KESHAWAT." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.18),transparent_50%)]" />

        <div className="relative z-10 mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 p-1 ring-1 ring-primary/30">
          <img
            src="/brand-logo.jpg"
            alt="STUDYxANSHU logo"
            className="h-full w-full rounded-full object-cover"
          />
        </div>

        <h1 className="relative z-10 mb-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            STUDYxANSHU
          </span>
        </h1>

        <p className="relative z-10 mb-8 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Free live classes, recorded lectures, DPP, notes and test series — built for every student.
        </p>

        <div className="relative z-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/study/batches"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-105"
          >
            <BookOpen className="h-4 w-4" />
            Explore Batches
          </Link>
          <a
            href="https://t.me/+1YqS8Bxcj5M4OTk1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-white/10"
          >
            <Users className="h-4 w-4" />
            Join Telegram
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Play, title: "Recorded Lectures", desc: "Watch anytime, unlimited access." },
            { icon: BookOpen, title: "DPP & Notes", desc: "Download practice sheets and notes." },
            { icon: Award, title: "Test Series", desc: "Full mock tests with solutions." },
            { icon: Users, title: "Community", desc: "Learn together on Telegram & WhatsApp." },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-card p-5 transition-colors hover:border-primary/30"
            >
              <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-2.5 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1 text-sm font-bold text-card-foreground">{f.title}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-6 text-center sm:p-10">
          <h2 className="mb-2 text-xl font-extrabold text-foreground">Ready to start learning?</h2>
          <p className="mb-5 text-sm text-muted-foreground">All batches are 100% free. No signup required.</p>
          <Link
            to="/study/batches"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105"
          >
            Browse Batches
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
