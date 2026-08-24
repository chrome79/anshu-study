import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { mainMenu, socialMenu, aboutMenu } from "@/data/menu";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export function MobileDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const MenuSection = ({ items }: { items: typeof mainMenu }) => (
    <nav className="flex flex-col gap-1 py-2">
      {items.map((item) => {
        const Icon = item.icon;
        const content = (
          <span className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/10">
            <Icon className="h-5 w-5 text-primary" />
            {item.label}
          </span>
        );
        return item.external ? (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onOpenChange(false)}
          >
            {content}
          </a>
        ) : (
          <Link
            key={item.label}
            to={item.href}
            onClick={() => onOpenChange(false)}
            activeProps={{ className: "bg-white/10" }}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <span className="hidden" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] max-w-sm border-r border-white/10 bg-card p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/brand-logo.jpg"
                  alt="STUDYxANSHU logo"
                  className="h-12 w-12 rounded-full object-cover ring-1 ring-primary/30"
                />
                <SheetTitle className="text-xl font-extrabold tracking-wide text-foreground">
                  STUDYxANSHU
                </SheetTitle>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => onOpenChange(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-3 py-2">
            <MenuSection items={mainMenu} />

            <div className="my-2 h-px bg-white/10" />
            <p className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground opacity-70">
              Social
            </p>
            <MenuSection items={socialMenu} />

            <div className="my-2 h-px bg-white/10" />
            <p className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground opacity-70">
              About
            </p>
            <MenuSection items={aboutMenu} />
          </div>

          <div className="border-t border-white/10 p-4 text-center text-xs text-muted-foreground">
            Powered by ANSHU KESHAWAT
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
