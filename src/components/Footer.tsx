import { DRAWER_LINKS } from "@/data/menu";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-card py-6">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <p className="mb-2 text-sm font-semibold text-foreground">STUDYxANSHU</p>
        <p className="mb-4 text-xs text-muted-foreground">
          Free education platform by ANSHU KESHAWAT.
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <a href={DRAWER_LINKS.joinTelegram} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            Telegram
          </a>
          <a href={DRAWER_LINKS.whatsappChannel} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            WhatsApp
          </a>
          <a href={DRAWER_LINKS.devInstagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            Instagram
          </a>
        </div>
        <p className="mt-4 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
          Made with <Heart className="h-3 w-3 text-red-400" /> from Sugandhnagar
        </p>
      </div>
    </footer>
  );
}
