import React from "react";
import type { ResumeData } from "../types";
import { BulletList, SectionTitle, safeJoin } from "./shared";

/**
 * LaTeX-inspired single-column: tight spacing, strong hierarchy.
 */
export default function TemplateLatexClean({ data }: { data: ResumeData }) {
  return (
    <div style={{ background: "var(--r-bg)", color: "var(--r-text)", fontFamily: "ui-serif, Georgia, Cambria, Times New Roman, Times, serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "baseline" }}>
        <div style={{ fontSize: 30, fontWeight: 900 }}>{data.basics.fullName || "Your Name"}</div>
        <div style={{ fontSize: 12, color: "var(--r-muted)", textAlign: "right", lineHeight: 1.4 }}>
          <div>{safeJoin([data.basics.email, data.basics.phone], " • ")}</div>
          <div>{data.basics.location}</div>
        </div>
      </div>
      <div style={{ marginTop: 6, color: "var(--r-accent)", fontWeight: 800 }}>
        {data.basics.headline || "Headline / Title"}
      </div>
      <div style={{ borderTop: "2px solid var(--r-text)", marginTop: 10 }} />

      {data.summary?.trim() && (
        <>
          <SectionTitle>Summary</SectionTitle>
          <div style={{ fontSize: 12, color: "var(--r-muted)", lineHeight: 1.65 }}>{data.summary}</div>
        </>
      )}

      {data.work?.length > 0 && (
        <>
          <SectionTitle>Experience</SectionTitle>
          {data.work
            .filter((w) => w.company.trim() || w.role.trim())
            .map((w) => (
              <div key={w.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
                  <div style={{ fontWeight: 900 }}>{w.role || "Role"} — {w.company || "Company"}</div>
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

      {data.skills?.length > 0 && (
        <>
          <SectionTitle>Skills</SectionTitle>
          <div style={{ fontSize: 12, color: "var(--r-muted)", lineHeight: 1.7 }}>
            {data.skills
              .filter((g) => (g.skills || []).some((s) => s.trim()))
              .map((g) => `${g.category || "Skills"}: ${safeJoin(g.skills, ", ")}`)
              .join("  •  ")}
          </div>
        </>
      )}

      {data.projects?.length > 0 && (
        <>
          <SectionTitle>Projects</SectionTitle>
          {data.projects
            .filter((p) => p.name.trim())
            .map((p) => (
              <div key={p.id} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 900 }}>
                  {p.name}
                  {p.link?.trim() ? (
                    <span style={{ fontWeight: 600, color: "var(--r-muted)", fontSize: 12 }}> — {p.link}</span>
                  ) : null}
                </div>
                <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                  {(p.tech || []).filter(Boolean).slice(0, 8).join(", ")}
                </div>
                <BulletList items={p.bullets} />
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
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
                  <div style={{ fontWeight: 900 }}>{safeJoin([e.degree, e.field], " — ")}</div>
                  <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                    {safeJoin([e.startDate, e.endDate], " - ")}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                  {safeJoin([e.school, e.location], ", ")}{e.gpa?.trim() ? ` • GPA: ${e.gpa}` : ""}
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
}

