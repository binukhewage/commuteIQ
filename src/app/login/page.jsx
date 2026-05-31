"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

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
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-800"
      >
        <h1 className="text-3xl font-bold mb-6">
          Login
        </h1>

        <div className="mb-4">
          <label className="block mb-2 text-sm">
            Email
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm">
            Password
          </label>

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded-lg font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}