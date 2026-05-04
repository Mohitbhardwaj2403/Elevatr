import React from "react";
import type { ResumeData } from "../types";
import { BulletList, SectionTitle, safeJoin } from "./shared";

/**
 * LaTeX-inspired two-column: sections stacked with compact spacing.
 */
export default function TemplateLatexTwoColumn({ data }: { data: ResumeData }) {
  const links = (data.basics.links || []).filter((l) => l.url?.trim());

  return (
    <div style={{ background: "var(--r-bg)", color: "var(--r-text)", fontFamily: "ui-serif, Georgia, Cambria, Times New Roman, Times, serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "baseline" }}>
        <div>
          <div style={{ fontSize: 30, fontWeight: 900 }}>{data.basics.fullName || "Your Name"}</div>
          <div style={{ marginTop: 4, fontWeight: 800, color: "var(--r-accent)" }}>
            {data.basics.headline || "Headline / Title"}
          </div>
        </div>
        <div style={{ fontSize: 12, color: "var(--r-muted)", textAlign: "right", lineHeight: 1.5 }}>
          <div>{data.basics.email}</div>
          <div>{data.basics.phone}</div>
          <div>{data.basics.location}</div>
        </div>
      </div>
      <div style={{ borderTop: "2px solid var(--r-text)", marginTop: 10 }} />

      <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 18 }}>
        <div>
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
                      <div style={{ fontWeight: 900 }}>
                        {w.role || "Role"} — {w.company || "Company"}
                      </div>
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

          {data.projects?.length > 0 && (
            <>
              <SectionTitle>Projects</SectionTitle>
              {data.projects
                .filter((p) => p.name.trim())
                .map((p) => (
                  <div key={p.id} style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 900 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                      {safeJoin([p.link, (p.tech || []).filter(Boolean).slice(0, 8).join(", ")], " • ")}
                    </div>
                    <BulletList items={p.bullets} />
                  </div>
                ))}
            </>
          )}
        </div>

        <div>
          {data.skills?.length > 0 && (
            <>
              <SectionTitle>Skills</SectionTitle>
              {data.skills
                .filter((g) => (g.skills || []).some((s) => s.trim()))
                .map((g) => (
                  <div key={g.id} style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 900, fontSize: 12 }}>{g.category || "Skills"}</div>
                    <div style={{ fontSize: 12, color: "var(--r-muted)", lineHeight: 1.6 }}>
                      {safeJoin(g.skills, ", ")}
                    </div>
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
                    <div style={{ fontWeight: 900, fontSize: 12 }}>{safeJoin([e.degree, e.field], " — ")}</div>
                    <div style={{ fontSize: 12, color: "var(--r-muted)" }}>{e.school}</div>
                    <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                      {safeJoin([e.startDate, e.endDate], " - ")}
                      {e.gpa?.trim() ? ` • GPA: ${e.gpa}` : ""}
                    </div>
                  </div>
                ))}
            </>
          )}

          {links.length > 0 && (
            <>
              <SectionTitle>Links</SectionTitle>
              <div style={{ fontSize: 12, color: "var(--r-muted)", lineHeight: 1.6 }}>
                {links.map((l) => (
                  <div key={l.url}>
                    {l.label?.trim() ? <span style={{ fontWeight: 900 }}>{l.label}: </span> : null}
                    {l.url}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

