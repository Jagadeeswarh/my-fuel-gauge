"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function signInWithGoogle() {
    setError("");
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase is not configured. Check the Netlify environment variables.");
      setBusy(false);
      return;
    }

    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (signInError) {
      setError(signInError.message);
      setBusy(false);
    }
  }

  async function signInWithPasskey() {
    setError("");
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase is not configured. Check the Netlify environment variables.");
      setBusy(false);
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPasskey();
      if (signInError) {
        setError(signInError.message);
        setBusy(false);
        return;
      }
      window.location.href = "/";
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Passkey sign-in failed.");
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand">
          <span className="brand-mark">H</span>
          <span>HECTORO / FUEL JOURNAL</span>
        </div>
        <div className="eyebrow" style={{ marginTop: 32 }}>PRIVATE VEHICLE RECORDS</div>
        <h1 style={{ marginTop: 10 }}>Welcome back.</h1>
        <p>Sign in to your private fuel journal. Your vehicle records are available only after authentication.</p>
        <button className="button" style={{ width: "100%", marginTop: 22 }} onClick={signInWithGoogle} disabled={busy}>
          {busy ? "Opening secure sign-in…" : "Continue with Google"}
        </button>
        <button className="button secondary" style={{ width: "100%", marginTop: 10 }} onClick={signInWithPasskey} disabled={busy}>
          Sign in with a passkey
        </button>
        {error && <div className="error" role="alert" style={{ marginTop: 14 }}>{error}</div>}
        <p style={{ marginTop: 18, fontSize: 10 }}>Google sign-in must be enabled in Supabase Auth. After signing in, register a passkey for future passwordless access.</p>
      </section>
    </main>
  );
}
