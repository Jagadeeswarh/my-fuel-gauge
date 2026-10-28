import { redirect } from "next/navigation";
import { Dashboard } from "@/components/dashboard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FuelEntry } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/login?reason=configuration");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("fuel_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("filled_at", { ascending: false });

  if (error) {
    throw new Error("Unable to load your private fuel journal. Please try again later.");
  }

  return <Dashboard initialEntries={(data ?? []) as FuelEntry[]} signedIn configured />;
}
