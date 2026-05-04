export type ResumePalette = {
  id: string;
  name: string;
  vars: {
    bg: string;
    text: string;
    muted: string;
    border: string;
    accent: string;
    accent2: string;
  };
};

export const RESUME_PALETTES: ResumePalette[] = [
  {
    id: "bw",
    name: "Black & White",
    vars: {
      bg: "#ffffff",
      text: "#111827",
      muted: "#4b5563",
      border: "#e5e7eb",
      accent: "#111827",
      accent2: "#374151",
    },
  },
  {
    id: "blue-black",
    name: "Blue & Black",
    vars: {
      bg: "#ffffff",
      text: "#0b1220",
      muted: "#475569",
      border: "#e2e8f0",
      accent: "#2563eb",
      accent2: "#0f172a",
    },
  },
  {
    id: "emerald-slate",
    name: "Emerald & Slate",
    vars: {
      bg: "#ffffff",
      text: "#0f172a",
      muted: "#475569",
      border: "#e2e8f0",
      accent: "#059669",
      accent2: "#0f172a",
    },
  },
  {
    id: "purple-ink",
    name: "Purple & Ink",
    vars: {
      bg: "#ffffff",
      text: "#111827",
      muted: "#6b7280",
      border: "#e5e7eb",
      accent: "#7c3aed",
      accent2: "#111827",
    },
  },
  {
    id: "mono-warm",
    name: "Warm Mono",
    vars: {
      bg: "#fffdf8",
      text: "#1f2937",
      muted: "#6b7280",
      border: "#efe7d7",
      accent: "#92400e",
      accent2: "#111827",
    },
  },
];

export function paletteById(id: string) {
  return RESUME_PALETTES.find((p) => p.id === id) || RESUME_PALETTES[0];
}

