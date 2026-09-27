import type { Metadata } from 'next';
import 'maplibre-gl/dist/maplibre-gl.css';
import './globals.css';
export const metadata: Metadata = { title: 'HIDDEN — A geographic deduction game', description: 'One place. Twelve actions. How close can you get?' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
