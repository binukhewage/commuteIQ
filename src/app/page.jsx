"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car,
  Milestone,
  Fuel,
  TrendingUp,
  ArrowRight,
  Zap,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setIsLoggedIn(true);
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Auth check error:", err);
    } finally {
      setCheckingAuth(false);
    }
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="size-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">
            CommuteIQ Sync
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="h-screen w-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between overflow-hidden relative font-sans select-none">
      {/* Decorative Glowing Blur Backdrops */}
      <div className="absolute top-[-10%] left-[-10%] size-[400px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] size-[400px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      {/* HEADER */}
      <header className="w-full bg-zinc-950/40 backdrop-blur-md border-b border-zinc-900/60 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/10">
              <Car className="size-5 group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-extrabold text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              CommuteIQ
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-md shadow-white/5"
              >
                <span>Dashboard</span>
                <ChevronRight className="size-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-zinc-400 hover:text-zinc-100 px-3 py-2 text-xs font-bold transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-md shadow-white/5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO & MOCKUP VISUAL (SINGLE VIEWPORT CONTAINER) */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 flex flex-col md:grid md:grid-cols-12 md:gap-10 items-center justify-center z-10 overflow-hidden py-4">
        {/* Left Column: Heading and CTAs */}
        <div className="md:col-span-6 flex flex-col items-center md:items-start text-center md:text-left space-y-6 max-w-lg md:max-w-none animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/40 text-indigo-400 text-[10px] font-bold rounded-full border border-indigo-900/30 w-fit">
            <Zap className="size-3" />
            <span>Next-Generation Travel Intelligence</span>
          </div>

          <div className="space-y-3.5">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.1] text-white">
              Smart Travel & Fuel Analytics For{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-500">
                Commuters
              </span>
            </h1>
            <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-md md:max-w-none">
              Record commutes, optimize fuel consumption, and monitor spending velocity. CommuteIQ turns your travel logs into actionable intelligence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold py-3 px-6 rounded-xl text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20 text-center"
            >
              <span>Start Tracking Free</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto glass-panel border-zinc-900 text-zinc-300 hover:text-white py-3 px-6 rounded-xl text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] text-center"
            >
              <span>Log In to Account</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Premium Dashboard Preview Mockup */}
        <div className="md:col-span-6 w-full hidden md:block animate-scale-in">
          <div className="glass-panel border-zinc-900 rounded-3xl p-5 shadow-2xl relative overflow-hidden group">
            {/* Visual Glass Header */}
            <div className="flex items-center justify-between border-b border-zinc-900/60 pb-3 mb-5">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-rose-500/80" />
                <span className="size-2.5 rounded-full bg-amber-500/80" />
                <span className="size-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider">
                Live Overview Mockup
              </span>
            </div>

            {/* Simulated Desktop Metrics Grid */}
            <div className="grid grid-cols-3 gap-3.5 mb-4">
              <div className="bg-zinc-900/40 border border-zinc-900/80 p-3.5 rounded-xl text-left">
                <div className="flex items-center justify-between text-zinc-500 mb-1.5">
                  <span className="text-[9px] font-bold uppercase">Monthly Kms</span>
                  <Milestone className="size-3.5 text-indigo-400" />
                </div>
                <p className="text-xl font-black text-white">480 KM</p>
                <div className="w-full bg-zinc-950 h-1 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-indigo-500 h-1 rounded-full" style={{ width: "65%" }} />
                </div>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-900/80 p-3.5 rounded-xl text-left">
                <div className="flex items-center justify-between text-zinc-500 mb-1.5">
                  <span className="text-[9px] font-bold uppercase">Litres Used</span>
                  <Fuel className="size-3.5 text-cyan-400" />
                </div>
                <p className="text-xl font-black text-white">32.8 L</p>
                <div className="w-full bg-zinc-950 h-1 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-cyan-500 h-1 rounded-full" style={{ width: "48%" }} />
                </div>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-900/80 p-3.5 rounded-xl text-left">
                <div className="flex items-center justify-between text-zinc-500 mb-1.5">
                  <span className="text-[9px] font-bold uppercase">Fuel Cost</span>
                  <TrendingUp className="size-3.5 text-emerald-400" />
                </div>
                <p className="text-xl font-black text-white">Rs. 13,448</p>
                <div className="w-full bg-zinc-950 h-1 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-1 rounded-full" style={{ width: "72%" }} />
                </div>
              </div>
            </div>

            {/* Small dynamic chart preview representation */}
            <div className="bg-zinc-900/20 border border-zinc-900/80 rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between items-center text-[10px] text-zinc-500">
                <span className="font-semibold uppercase">Commute Efficiency Trend</span>
                <span className="text-emerald-400 font-bold">14.6 KM/L Average</span>
              </div>
              <div className="h-12 flex items-end gap-1.5 pt-2">
                <div className="bg-zinc-800 hover:bg-indigo-500/40 w-full h-[30%] rounded-sm transition-all" />
                <div className="bg-zinc-800 hover:bg-indigo-500/40 w-full h-[55%] rounded-sm transition-all" />
                <div className="bg-zinc-800 hover:bg-indigo-500/40 w-full h-[40%] rounded-sm transition-all" />
                <div className="bg-indigo-500/20 hover:bg-indigo-500/40 w-full h-[70%] rounded-sm transition-all border border-indigo-500/30" />
                <div className="bg-indigo-500 w-full h-[85%] rounded-sm shadow-lg shadow-indigo-500/10" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER (HIGHLIGHT ROW) */}
      <footer className="w-full border-t border-zinc-900/60 bg-zinc-950 py-4 z-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-zinc-600 font-semibold uppercase tracking-wider">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-indigo-500" />
              <span>Real-Time Math</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-cyan-500" />
              <span>Mobile Optimized</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>Spend Forecasting</span>
            </span>
          </div>
          <p>© {new Date().getFullYear()} CommuteIQ.</p>
        </div>
      </footer>
    </div>
  );
}