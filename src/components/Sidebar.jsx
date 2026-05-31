"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, Milestone, Fuel, LogOut, Car } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Overview & Analytics",
    },
    {
      name: "Trips Log",
      href: "/trips",
      icon: Milestone,
      description: "Manage your trips",
    },
    {
      name: "Fuel Log",
      href: "/fuel",
      icon: Fuel,
      description: "Refueling history",
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-zinc-950/80 backdrop-blur-xl border-r border-zinc-900 p-6 justify-between z-50 animate-fade-in">
        <div className="flex flex-col gap-8">
          {/* Logo / Header */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/20">
              <Car className="size-6 animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                CommuteIQ
              </h1>
              <p className="text-[10px] text-zinc-500 font-medium tracking-wider uppercase">
                Premium Tracker
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden",
                    isActive
                      ? "text-white bg-zinc-900 border border-zinc-800 shadow-md shadow-black/40"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/40 border border-transparent"
                  )}
                >
                  {/* Active Indicator Glow */}
                  {isActive && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r bg-indigo-500" />
                  )}

                  <Icon
                    className={cn(
                      "size-5 transition-transform duration-300 group-hover:scale-110",
                      isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm tracking-wide">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-normal group-hover:text-zinc-400 transition-colors">
                      {item.description}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User / Logout */}
        <div className="pt-4 border-t border-zinc-900/60">
          <button
            onClick={handleLogout}
            className="group w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-950/30 transition-all duration-300"
          >
            <LogOut className="size-5 text-zinc-500 group-hover:text-rose-400 transition-transform group-hover:translate-x-0.5 duration-300" />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-900 flex items-center justify-around px-4 py-1 z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-1 rounded-lg transition-all",
                isActive ? "text-indigo-400 font-medium" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Icon className="size-5" />
              <span className="text-[10px] tracking-wide font-semibold">{item.name}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-zinc-500 hover:text-rose-400 transition-all"
        >
          <LogOut className="size-5" />
          <span className="text-[10px] tracking-wide font-semibold">Logout</span>
        </button>
      </nav>
    </>
  );
}
