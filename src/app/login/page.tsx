"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);

    const db = createSupabaseBrowserClient();
    if (!db) {
      setError("Supabase is not configured. Set the environment variables from .env.example.");
      setBusy(false);
      return;
    }

    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error: signInError } = await db.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (signInError) {
      setError(signInError.message);
      setBusy(false);
      return;
    }

    setMessage("Check your email for a secure sign-in link. You can close this page after opening the email.");
    setBusy(false);
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="brand">
          <span className="brand-mark">H</span>
          <span>HECTORO / FUEL JOURNAL</span>
        </div>
        <div className="eyebrow" style={{ marginTop: 32 }}>PRIVATE VEHICLE RECORDS</div>
        <h1 style={{ marginTop: 10 }}>Welcome back.</h1>
        <p>Sign in to your private fuel journal. Your vehicle records are available only after authentication.</p>
        <div className="field" style={{ marginTop: 22 }}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        {error && <div className="error" role="alert">{error}</div>}
        {message && <div className="success" role="status">{message}</div>}
        <button className="button" style={{ width: "100%", marginTop: 18 }} disabled={busy}>
          {busy ? "Sending link…" : "Email me a sign-in link"}
        </button>
        <p style={{ marginTop: 18, fontSize: 10 }}>Use the owner email configured in Supabase Auth. The sign-in link expires according to your Supabase settings.</p>
      </form>
    </main>
  );
}
