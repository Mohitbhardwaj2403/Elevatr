import React from "react";
import type { ResumeData } from "../types";

export function safeJoin(parts: Array<string | undefined | null>, sep = " • ") {
  return parts.map((p) => (p || "").trim()).filter(Boolean).join(sep);
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--r-accent2)",
        marginTop: 16,
        marginBottom: 8,
        borderBottom: "1px solid var(--r-border)",
        paddingBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

export function BulletList({ items }: { items: string[] }) {
  const filtered = (items || []).map((s) => s?.trim()).filter(Boolean);
  if (filtered.length === 0) return null;
  return (
    <ul style={{ margin: "6px 0 0", paddingLeft: 18, color: "var(--r-text)" }}>
      {filtered.map((b, idx) => (
        <li key={idx} style={{ marginBottom: 4, color: "var(--r-text)" }}>
          <span style={{ color: "var(--r-muted)", fontSize: 12 }}>{b}</span>
        </li>
      ))}
    </ul>
  );
}

export function HeaderLine({ data }: { data: ResumeData }) {
  const links = (data.basics.links || [])
    .filter((l) => l.url?.trim())
    .map((l) => (l.label?.trim() ? `${l.label}: ${l.url}` : l.url));

  return (
    <div style={{ color: "var(--r-muted)", fontSize: 12, marginTop: 6 }}>
      {safeJoin(
        [data.basics.email, data.basics.phone, data.basics.location, ...links],
        " | ",
      )}
    </div>
  );
}

