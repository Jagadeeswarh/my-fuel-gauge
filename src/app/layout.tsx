import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = { title:"Hectoro — Fuel Journal", description:"A premium fuel journal for the MG Hector Plus.", applicationName:"Hectoro Fuel Gauge" };
export const viewport: Viewport = { themeColor:"#FFFDF2", width:"device-width", initialScale:1 };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }