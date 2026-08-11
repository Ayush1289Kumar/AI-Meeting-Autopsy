"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "register" ? { name, email, password } : { email, password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Something went wrong");
      router.push("/dashboard");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-card border border-border bg-card p-6">
      <h2 className="text-base font-semibold text-white">
        {mode === "login" ? "Sign in" : "Create your account"}
      </h2>

      {mode === "register" ? (
        <Field label="Name">
          <Input required value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
      ) : null}

      <Field label="Email">
        <Input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </Field>
      <Field label="Password">
        <Input
          required
          type="password"
          minLength={mode === "register" ? 8 : 1}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </Field>

      {error ? <p className="text-xs text-danger">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
      </Button>

      <p className="text-center text-xs text-muted">
        {mode === "login" ? (
          <>
            No account?{" "}
            <Link href="/register" className="text-brand hover:underline">
              Register
            </Link>
          </>
        ) : (
          <>
            Already registered?{" "}
            <Link href="/login" className="text-brand hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
      <p className="text-center text-[11px] text-muted">
        Demo account: john@example.com / password123
      </p>
    </form>
  );
}
