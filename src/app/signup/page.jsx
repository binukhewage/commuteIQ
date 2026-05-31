"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.signUp({
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
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-800"
      >
        <h1 className="text-3xl font-bold mb-6">
          Create Account
        </h1>

<div className="mb-4">
  <label className="block mb-2 text-sm">
    Name
  </label>

  <input
    type="text"
    required
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
  />
</div>
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
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>
    </main>
  );
}