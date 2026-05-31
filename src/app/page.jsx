"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error("Session check error:", err);
      router.push("/login");
    }
  };

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