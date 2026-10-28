"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function PasskeySetup() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function register() {
    setBusy(true);
    setMessage("");
    setError("");
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase is not configured.");
      setBusy(false);
      return;
    }

    try {
      const { data, error: registerError } = await supabase.auth.registerPasskey();
      if (registerError) {
        setError(registerError.message);
      } else {
        setMessage(`Passkey registered${data?.friendly_name ? `: ${data.friendly_name}` : ""}. You can use it for future sign-ins on this device or synced authenticator.`);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Passkey registration failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <button className="button secondary" onClick={register} disabled={busy}>
        {busy ? "Waiting for passkey…" : "Set up passkey"}
      </button>
      {message && <span role="status" style={{ fontSize: 11, color: "#276749" }}>{message}</span>}
      {error && <span role="alert" style={{ fontSize: 11, color: "var(--danger)" }}>{error}</span>}
    </div>
  );
}
