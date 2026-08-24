import { useState } from "react";

export function VideoPlayer({ src, title }: { src: string; title: string }) {
  const [error, setError] = useState(false);

  if (error || !src || src === "#") {
    return (
      <div className="flex aspect-video flex-col items-center justify-center rounded-2xl border border-white/10 bg-black p-6 text-center">
        <p className="mb-2 text-sm font-semibold text-foreground">Video stream placeholder</p>
        <p className="max-w-md text-xs text-muted-foreground">
          This is a frontend clone. Replace the stream URL with your actual video source.
        </p>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
        >
          Open stream directly
        </a>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
      <iframe
        src={src}
        title={title}
        className="aspect-video w-full"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        onError={() => setError(true)}
      />
    </div>
  );
}
