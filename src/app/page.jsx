"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.log("Supabase Error:", error);
    } else {
      console.log("Supabase Connected ✅");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold">
        CommuteIQ 🚗
      </h1>
    </main>
  );
}