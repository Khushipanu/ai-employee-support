"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import { setSession } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid email or password.");
        return;
      }
      setSession(data.user);
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(demoEmail) {
    setEmail(demoEmail);
    setPassword("demo-pw-redacted");
    setError("");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-50 px-4">
      <div className="pointer-events-none absolute left-1/2 top-0 h-105 w-180 -translate-x-1/2 -translate-y-1/3 rounded-full bg-linear-to-br from-indigo-200 via-violet-100 to-transparent opacity-60 blur-3xl" />

      <div className="relative w-full max-w-sm animate-fade-in-up">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200">
            <Sparkles size={20} strokeWidth={2.25} />
          </span>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
            Zeera Employee Support
          </h1>
          <p className="mt-1 text-sm text-neutral-500">Sign in to continue</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm shadow-neutral-200/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  placeholder="you@zeera.com"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log In"}
              {!loading && (
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </form>

          <div className="mt-5 border-t border-neutral-100 pt-4">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-400">
              Demo accounts · demo-pw-redacted
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                ["Employee", "khushi@company.com"],
                ["HR", "hr@company.com"],
                ["IT", "it@company.com"],
              ].map(([label, mail]) => (
                <button
                  key={mail}
                  onClick={() => fillDemo(mail)}
                  className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
