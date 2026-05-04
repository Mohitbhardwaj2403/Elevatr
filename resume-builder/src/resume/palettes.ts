export type PaletteId =
  | "bw"
  | "blueBlack"
  | "tealSlate"
  | "purpleIndigo"
  | "emeraldNavy"
  | "roseCharcoal";

export type Palette = {
  id: PaletteId;
  name: string;
  accent: string; // tailwind classes
  accentBg: string;
  heading: string;
  text: string;
  muted: string;
  border: string;
};

export const PALETTES: Palette[] = [
  {
    id: "bw",
    name: "Black & White",
    accent: "text-gray-900",
    accentBg: "bg-gray-900",
    heading: "text-gray-900",
    text: "text-gray-800",
    muted: "text-gray-600",
    border: "border-gray-200",
  },
  {
    id: "blueBlack",
    name: "Blue & Black",
    accent: "text-blue-700",
    accentBg: "bg-blue-700",
    heading: "text-gray-900",
    text: "text-gray-800",
    muted: "text-gray-600",
    border: "border-gray-200",
  },
  {
    id: "tealSlate",
    name: "Teal & Slate",
    accent: "text-teal-700",
    accentBg: "bg-teal-700",
    heading: "text-slate-900",
    text: "text-slate-800",
    muted: "text-slate-600",
    border: "border-slate-200",
  },
  {
    id: "purpleIndigo",
    name: "Purple & Indigo",
    accent: "text-purple-700",
    accentBg: "bg-purple-700",
    heading: "text-indigo-950",
    text: "text-indigo-900",
    muted: "text-indigo-700",
    border: "border-indigo-200",
  },
  {
    id: "emeraldNavy",
    name: "Emerald & Navy",
    accent: "text-emerald-700",
    accentBg: "bg-emerald-700",
    heading: "text-slate-950",
    text: "text-slate-900",
    muted: "text-slate-700",
    border: "border-slate-200",
  },
  {
    id: "roseCharcoal",
    name: "Rose & Charcoal",
    accent: "text-rose-700",
    accentBg: "bg-rose-700",
    heading: "text-zinc-950",
    text: "text-zinc-900",
    muted: "text-zinc-700",
    border: "border-zinc-200",
  },
];

export function getPalette(id: PaletteId): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}

