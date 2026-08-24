import { createFileRoute } from "@tanstack/react-router";
import { Mail, Send, MessageCircle } from "lucide-react";
import { DRAWER_LINKS } from "@/data/menu";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — STUDYxANSHU" },
      { name: "description", content: "Contact STUDYxANSHU via Telegram or WhatsApp." },
      { property: "og:title", content: "Contact Us — STUDYxANSHU" },
      { property: "og:description", content: "Contact STUDYxANSHU via Telegram or WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen px-4 pt-20 pb-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-foreground">Contact Us</h1>
          <p className="mt-1 text-sm text-muted-foreground">Reach out on Telegram or WhatsApp.</p>
        </div>

        <div className="grid gap-4">
          <a
            href={DRAWER_LINKS.joinTelegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-card p-5 transition-colors hover:border-primary/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/10 text-sky-400">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-card-foreground">Telegram Channel</h3>
              <p className="text-xs text-muted-foreground">Join for instant updates</p>
            </div>
          </a>

          <a
            href={DRAWER_LINKS.whatsappChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-card p-5 transition-colors hover:border-primary/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-400">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-card-foreground">WhatsApp Channel</h3>
              <p className="text-xs text-muted-foreground">Follow for announcements</p>
            </div>
          </a>

          <a
            href={DRAWER_LINKS.devInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-card p-5 transition-colors hover:border-primary/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/10 text-pink-400">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-card-foreground">Instagram</h3>
              <p className="text-xs text-muted-foreground">Follow developer on Instagram</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
