"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Fuel, Milestone, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function FloatingActionMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Hide the FAB on the login/signup pages
  if (pathname === "/login" || pathname === "/signup" || pathname === "/") return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    setIsOpen(false);
    router.push(path);
  };

  return (
    <div className="md:hidden fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] right-4 z-[60]" ref={menuRef}>
      <div
        className={cn(
          "absolute bottom-full right-0 mb-4 flex flex-col gap-3 transition-all duration-300 origin-bottom",
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 pointer-events-none translate-y-8"
        )}
      >
        <button
          onClick={() => handleNavigation("/fuel")}
          className="flex items-center gap-3 bg-card/95 backdrop-blur-xl border border-border shadow-xl px-4 py-2.5 rounded-full hover:bg-muted transition-colors active:scale-95 text-foreground whitespace-nowrap ml-auto"
        >
          <span className="font-semibold text-sm">Add Fuel</span>
          <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-full">
            <Fuel className="size-4" />
          </div>
        </button>
        <button
          onClick={() => handleNavigation("/trips")}
          className="flex items-center gap-3 bg-card/95 backdrop-blur-xl border border-border shadow-xl px-4 py-2.5 rounded-full hover:bg-muted transition-colors active:scale-95 text-foreground whitespace-nowrap ml-auto"
        >
          <span className="font-semibold text-sm">Log Trip</span>
          <div className="p-2 bg-cyan-500/10 text-cyan-500 rounded-full">
            <Milestone className="size-4" />
          </div>
        </button>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center size-14 rounded-full shadow-2xl border border-border text-white transition-all duration-300 active:scale-90",
          isOpen
            ? "bg-rose-500 hover:bg-rose-600 rotate-90"
            : "bg-indigo-600 hover:bg-indigo-500 hover:scale-105"
        )}
      >
        {isOpen ? <X className="size-6" /> : <Plus className="size-6" />}
      </button>
    </div>
  );
}
