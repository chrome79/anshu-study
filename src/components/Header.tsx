import { Menu } from "lucide-react";
import { useState } from "react";
import { MobileDrawer } from "./MobileDrawer";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-white/10"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-2">
            <img
              src="/brand-logo.jpg"
              alt="STUDYxANSHU logo"
              className="h-9 w-9 rounded-full object-cover ring-1 ring-primary/30"
            />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-lg font-extrabold tracking-wide text-transparent">
              STUDYxANSHU
            </span>
          </div>

          <div className="w-10" aria-hidden="true" />
        </div>
      </header>

      <MobileDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
