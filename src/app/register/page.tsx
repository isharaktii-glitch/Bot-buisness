"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Network error. Try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-darker flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-lg gradient-btn flex items-center justify-center">
            <MessageCircle size={20} className="text-black" />
          </div>
          <span className="text-xl font-bold">BotVerse</span>
        </Link>

        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-white/50 text-sm mb-6">
            Start automating your business messages
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-white/70 block mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                minLength={3}
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary transition"
                placeholder="yourbusiness"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 block mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 block mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-btn text-black font-bold py-3 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-white/50 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
