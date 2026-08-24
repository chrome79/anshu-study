import { useEffect, useRef, useState } from "react";
import { DRAWER_LINKS } from "@/data/menu";

const WELCOME_KEY = "sx_welcome_seen";
const TOTAL = 20;

export function WelcomeModal() {
  const [show, setShow] = useState(false);
  const [left, setLeft] = useState(TOTAL);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(WELCOME_KEY)) return;
      sessionStorage.setItem(WELCOME_KEY, "1");
    } catch {
      // ignore
    }
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    setLeft(TOTAL);
    timerRef.current = setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setShow(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [show]);

  const close = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShow(false);
  };

  const fmt = (n: number) => `00:${n < 10 ? "0" : ""}${Math.max(0, n)}`;

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[2147483000] flex items-center justify-center bg-black/65 p-4 backdrop-blur-md"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-[340px] max-h-[85vh] overflow-y-auto rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-[#0f172a] to-[#0b1f1a] p-5 text-foreground shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/10 text-sm text-foreground transition-colors hover:bg-white/20"
        >
          ✕
        </button>

        <div className="text-center">
          <h2 className="mb-1 text-2xl font-extrabold tracking-wide text-emerald-400">
            ANSHU KESHAWAT
          </h2>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Love ❤️ From
          </p>
          <p className="mb-3 bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-base font-extrabold tracking-[0.15em] text-transparent">
            SUGANDHNAGAR
          </p>
        </div>

        <div className="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-xs font-semibold leading-relaxed text-red-200">
          Do NOT purchase this app from anyone. It is 100% FREE always.
        </div>

        <ul className="mb-4 space-y-1.5 text-sm text-slate-300">
          {[
            "Live Classes, all batches",
            "Recorded Lectures, full access",
            "DPP and Notes, download anytime",
            "Quizzes and Test Series",
            "Regular, Infinity, Infinity Pro batches",
            "Fastrack and all other batches",
            "Full Test Series, working",
            "Instant updates, always latest",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="space-y-2">
          <a
            href={DRAWER_LINKS.devInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 px-4 py-2.5 text-center text-sm font-extrabold text-white shadow-lg transition-transform hover:scale-[1.02]"
          >
            Follow Developer on Instagram
          </a>
          <a
            href="https://t.me/+JzpUpoFpWABlMzM9"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-center text-sm font-bold text-white transition-transform hover:scale-[1.02]"
          >
            Follow on Telegram
          </a>
          <a
            href={DRAWER_LINKS.whatsappChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-full bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-center text-sm font-bold text-white transition-transform hover:scale-[1.02]"
          >
            Follow on WhatsApp
          </a>
        </div>

        <div className="mt-4">
          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-1000 ease-linear"
              style={{ width: `${(left / TOTAL) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-center text-xs font-semibold tracking-wide text-muted-foreground">
            Auto closing in{" "}
            <span className="font-mono font-extrabold text-emerald-400">{fmt(left)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
