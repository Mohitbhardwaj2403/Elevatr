import React from "react";
import type { ResumeData } from "../types";
import { BulletList, HeaderLine, SectionTitle, safeJoin } from "./shared";

export default function TemplateAccentHeader({ data }: { data: ResumeData }) {
  return (
    <div style={{ background: "var(--r-bg)", color: "var(--r-text)" }}>
      <div
        style={{
          borderRadius: 14,
          padding: 16,
          background: "linear-gradient(135deg, var(--r-accent), var(--r-accent2))",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 950 }}>{data.basics.fullName || "Your Name"}</div>
        <div style={{ fontSize: 14, opacity: 0.95, marginTop: 4 }}>
          {data.basics.headline || "Headline / Title"}
        </div>
        <div style={{ fontSize: 12, opacity: 0.9, marginTop: 8 }}>
          {safeJoin([data.basics.email, data.basics.phone, data.basics.location], " | ")}
        </div>
      </div>

      {data.summary?.trim() && (
        <>
          <SectionTitle>Summary</SectionTitle>
          <div style={{ fontSize: 12, color: "var(--r-muted)", lineHeight: 1.65 }}>{data.summary}</div>
        </>
      )}

      {data.skills?.length > 0 && (
        <>
          <SectionTitle>Skills</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {data.skills
              .flatMap((g) => g.skills)
              .map((s) => s.trim())
              .filter(Boolean)
              .slice(0, 40)
              .map((s, idx) => (
                <span
                  key={`${s}-${idx}`}
                  style={{
                    fontSize: 12,
                    padding: "6px 10px",
                    borderRadius: 999,
                    border: "1px solid var(--r-border)",
                    color: "var(--r-text)",
                    background: "color-mix(in srgb, var(--r-accent) 6%, var(--r-bg))",
                  }}
                >
                  {s}
                </span>
              ))}
          </div>
        </>
      )}

      {data.work?.length > 0 && (
        <>
          <SectionTitle>Experience</SectionTitle>
          {data.work
            .filter((w) => w.company.trim() || w.role.trim())
            .map((w) => (
              <div key={w.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontWeight: 950 }}>{safeJoin([w.role, w.company], " — ")}</div>
                  <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                    {safeJoin([w.startDate, w.endDate], " - ")}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "var(--r-muted)" }}>{w.location}</div>
                <BulletList items={w.bullets} />
              </div>
            ))}
        </>
      )}

      {data.education?.length > 0 && (
        <>
          <SectionTitle>Education</SectionTitle>
          {data.education
            .filter((e) => e.school.trim() || e.degree.trim())
            .map((e) => (
              <div key={e.id} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 900 }}>{safeJoin([e.degree, e.field], " — ")}</div>
                <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                  {safeJoin([e.school, e.location], ", ")} • {safeJoin([e.startDate, e.endDate], " - ")}
                </div>
              </div>
            ))}
        </>
      )}

      {/* keep HeaderLine import used in file for future extension */}
      <div style={{ display: "none" }}>
        <HeaderLine data={data} />
      </div>
    </div>
  );
}

