"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { FormError, Input } from "../forms/fields";
import { btn, cn } from "../ui";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        const fd = new FormData(e.currentTarget);
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
          });
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          if (!res.ok) throw new Error(data.error || "Sign in failed.");
          router.replace("/admin");
          router.refresh();
        } catch (err) {
          setError((err as Error).message);
          setBusy(false);
        }
      }}
    >
      <Input name="email" type="email" label="Email" required autoComplete="username" />
      <Input name="password" type="password" label="Password" required autoComplete="current-password" />
      <FormError>{error}</FormError>
      <button type="submit" disabled={busy} className={cn(btn.dark, btn.lg, "w-full")}>
        {busy ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />}
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
