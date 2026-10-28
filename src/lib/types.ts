export type FuelEntry = {
  id: string; filled_at: string; odometer_km: number | null; litres: number;
  price_per_litre: number; amount: number; station: string | null;
  receipt_number: string | null; density_kg_m3: number | null; range_km: number | null;
  notes: string | null; source: string | null; created_at?: string;
};
export type EntryInput = Omit<FuelEntry, "id" | "created_at">;