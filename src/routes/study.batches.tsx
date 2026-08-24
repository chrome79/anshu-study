import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BatchCard } from "@/components/BatchCard";
import { batches, BATCH_CATEGORIES } from "@/data/batches";

export const Route = createFileRoute("/study/batches")({
  head: () => ({
    meta: [
      { title: "All Batches — STUDYxANSHU" },
      { name: "description", content: "Browse free batches: Regular, Infinity, Infinity Pro, Fastrack and Test Series." },
      { property: "og:title", content: "All Batches — STUDYxANSHU" },
      { property: "og:description", content: "Browse free batches: Regular, Infinity, Infinity Pro, Fastrack and Test Series." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BatchesPage,
});

function BatchesPage() {
  const [active, setActive] = useState<string>("all");

  const filtered = active === "all" ? batches : batches.filter((b) => b.category === active);

  return (
    <div className="min-h-screen px-4 pt-20 pb-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-foreground">All Batches</h1>
          <p className="mt-1 text-sm text-muted-foreground">Choose a batch and start learning for free.</p>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {BATCH_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActive(cat.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                active === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "border border-white/10 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((batch) => (
            <BatchCard key={batch.id} batch={batch} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">No batches found in this category.</p>
        )}
      </div>
    </div>
  );
}
