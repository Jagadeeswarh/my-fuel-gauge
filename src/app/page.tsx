import { Dashboard } from "@/components/dashboard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FuelEntry } from "@/lib/types";

const seed: FuelEntry[] = [
{id:"seed-20251012",filled_at:"2025-10-12T10:00:00+05:30",odometer_km:42816,litres:30,price_per_litre:108.97,amount:3269.10,station:null,receipt_number:null,density_kg_m3:null,range_km:null,notes:null,source:"Fuelio archive"},
{id:"seed-20251013a",filled_at:"2025-10-13T09:00:00+05:30",odometer_km:43430,litres:20,price_per_litre:107.39,amount:2147.80,station:null,receipt_number:null,density_kg_m3:null,range_km:null,notes:"Original Fuelio entry; same-day odometer ordering needs review.",source:"Fuelio archive"},
{id:"seed-20251013b",filled_at:"2025-10-13T11:00:00+05:30",odometer_km:43149,litres:30,price_per_litre:109.48,amount:3284.40,station:null,receipt_number:null,density_kg_m3:null,range_km:null,notes:"Original Fuelio entry; preserve source values.",source:"Fuelio archive"},
{id:"seed-20251025",filled_at:"2025-10-25T10:00:00+05:30",odometer_km:43629,litres:25,price_per_litre:107.46,amount:2686.50,station:null,receipt_number:null,density_kg_m3:null,range_km:null,notes:null,source:"Fuelio archive"},
{id:"seed-20251108",filled_at:"2025-11-08T10:00:00+05:30",odometer_km:43813,litres:30,price_per_litre:107.46,amount:3223.80,station:null,receipt_number:null,density_kg_m3:null,range_km:null,notes:null,source:"Fuelio archive"},
{id:"seed-20251122",filled_at:"2025-11-22T10:00:00+05:30",odometer_km:44031,litres:25,price_per_litre:107.46,amount:2686.50,station:null,receipt_number:null,density_kg_m3:null,range_km:null,notes:null,source:"Fuelio archive"},
{id:"seed-20251226",filled_at:"2025-12-26T10:00:00+05:30",odometer_km:44156,litres:25,price_per_litre:107.46,amount:2686.50,station:null,receipt_number:null,density_kg_m3:null,range_km:null,notes:null,source:"Fuelio archive"},
{id:"seed-20260111a",filled_at:"2026-01-11T09:00:00+05:30",odometer_km:44333,litres:35,price_per_litre:107.46,amount:3761.10,station:null,receipt_number:null,density_kg_m3:null,range_km:null,notes:null,source:"Fuelio archive"},
{id:"seed-20260111b",filled_at:"2026-01-11T10:00:00+05:30",odometer_km:44655,litres:20,price_per_litre:109.24,amount:2184.80,station:null,receipt_number:null,density_kg_m3:null,range_km:null,notes:"Original Fuelio entry; retain source reading for review.",source:"Fuelio archive"},
{id:"seed-20260117",filled_at:"2026-01-17T10:00:00+05:30",odometer_km:44933,litres:30,price_per_litre:109.01,amount:3270.30,station:null,receipt_number:null,density_kg_m3:null,range_km:null,notes:null,source:"Fuelio archive"},
{id:"seed-20260118",filled_at:"2026-01-18T10:00:00+05:30",odometer_km:45163,litres:30,price_per_litre:109.00,amount:3270.00,station:null,receipt_number:null,density_kg_m3:null,range_km:null,notes:null,source:"Fuelio archive"},
{id:"seed-20260306",filled_at:"2026-03-06T10:00:00+05:30",odometer_km:45707,litres:45,price_per_litre:107.47,amount:4836.15,station:null,receipt_number:null,density_kg_m3:null,range_km:null,notes:"Next recorded odometer is much later; interval is unverified, not proof of missed fills.",source:"Fuelio archive"},
{id:"seed-20260929",filled_at:"2026-09-29T10:25:00+05:30",odometer_km:50468,litres:20,price_per_litre:115.71,amount:2314.20,station:"Malik Fuels, Hafeezpet",receipt_number:null,density_kg_m3:751.3,range_km:null,notes:null,source:"Receipt"}
];
export default async function Home(){
 const supabase=await createSupabaseServerClient(); let entries=seed; let signedIn=false; const configured=Boolean(supabase);
 if(supabase){const {data:{user}}=await supabase.auth.getUser();signedIn=Boolean(user);if(user){const {data,error}=await supabase.from("fuel_entries").select("*").order("filled_at",{ascending:false});if(!error&&data)entries=data as FuelEntry[];}}
 return <Dashboard initialEntries={entries} signedIn={signedIn} configured={configured}/>;
}