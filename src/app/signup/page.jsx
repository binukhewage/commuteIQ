"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Car, User, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      router.push("/dashboard");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created successfully ✅");
    router.push("/login");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4 py-8 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-1/4 size-80 rounded-full bg-indigo-500/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 size-80 rounded-full bg-cyan-500/5 blur-3xl -z-10 pointer-events-none" />

      <div className="w-full max-w-md space-y-8 animate-scale-in">
        {/* LOGO & TITLE */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-xl shadow-indigo-500/10">
            <Car className="size-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              Create an account
            </h1>
            <p className="text-zinc-500 text-sm mt-1.5 font-medium">
              Start tracking commute parameters and fuel expenditures
            </p>
          </div>
        </div>

        {/* GLASS PANEL FORM */}
        <form
          onSubmit={handleSignup}
          className="glass-panel border-zinc-900 rounded-3xl p-6 md:p-8 space-y-5"
        >
          {/* NAME */}
          <div className="space-y-1.5">
            <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                <User className="size-4.5" />
              </span>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 pl-11 rounded-xl bg-zinc-900/80 border border-zinc-800 focus:outline-none focus:border-indigo-500 text-sm font-medium placeholder-zinc-600 transition-colors"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-1.5">
            <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                <Mail className="size-4.5" />
              </span>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pl-11 rounded-xl bg-zinc-900/80 border border-zinc-800 focus:outline-none focus:border-indigo-500 text-sm font-medium placeholder-zinc-600 transition-colors"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                <Lock className="size-4.5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-11 pr-11 rounded-xl bg-zinc-900/80 border border-zinc-800 focus:outline-none focus:border-indigo-500 text-sm font-medium placeholder-zinc-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="size-4.5" />
                ) : (
                  <Eye className="size-4.5" />
                )}
              </button>
            </div>
          </div>

          {/* SIGN UP BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 text-black py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 shadow-lg shadow-white/5"
          >
            <span>{loading ? "Creating..." : "Sign Up"}</span>
            {!loading && <ArrowRight className="size-4" />}
          </button>
        </form>

        {/* BOTTOM REDIRECT LINK */}
        <p className="text-center text-zinc-500 text-xs font-semibold">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Log in instead
          </Link>
        </p>
      </div>
    </main>
  );
}