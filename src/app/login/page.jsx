"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Car, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-8 relative overflow-hidden">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Decorative Blur Backgrounds for Phone/Desktop */}
      <div className="absolute top-0 left-1/4 size-80 rounded-full bg-indigo-500/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 size-80 rounded-full bg-cyan-500/5 blur-3xl -z-10 pointer-events-none" />

      <div className="w-full max-w-md space-y-8 animate-scale-in">
        {/* LOGO & TITLE */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-xl shadow-indigo-500/10">
            <Car className="size-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5 font-medium">
              Log in to your CommuteIQ fuel tracking account
            </p>
          </div>
        </div>

        {/* GLASS PANEL FORM */}
        <form
          onSubmit={handleLogin}
          className="glass-panel rounded-3xl p-6 md:p-8 space-y-5"
        >
          {/* EMAIL */}
          <div className="space-y-1.5">
            <label className="block text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Mail className="size-4.5" />
              </span>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pl-11 rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-sm font-medium placeholder-muted-foreground/60 text-foreground transition-colors"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="size-4.5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-11 pr-11 rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-sm font-medium placeholder-muted-foreground/60 text-foreground transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="size-4.5" />
                ) : (
                  <Eye className="size-4.5" />
                )}
              </button>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background hover:bg-foreground/90 py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 shadow-md shadow-foreground/5"
          >
            <span>{loading ? "Logging in..." : "Log In"}</span>
            {!loading && <ArrowRight className="size-4" />}
          </button>
        </form>

        {/* BOTTOM REDIRECT LINK */}
        <p className="text-center text-muted-foreground text-xs font-semibold">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-650 dark:hover:text-indigo-350 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}