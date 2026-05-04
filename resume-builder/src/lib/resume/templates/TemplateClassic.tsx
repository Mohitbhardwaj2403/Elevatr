import React from "react";
import type { ResumeData } from "../types";
import { BulletList, HeaderLine, SectionTitle, safeJoin } from "./shared";

export default function TemplateClassic({ data }: { data: ResumeData }) {
  return (
    <div style={{ background: "var(--r-bg)", color: "var(--r-text)" }}>
      <div style={{ textAlign: "center", paddingBottom: 12, borderBottom: "2px solid var(--r-accent)" }}>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 0.6 }}>
          {(data.basics.fullName || "YOUR NAME").toUpperCase()}
        </div>
        <div style={{ fontSize: 14, color: "var(--r-accent)", marginTop: 4 }}>
          {data.basics.headline || "Headline / Title"}
        </div>
        <HeaderLine data={data} />
      </div>

      {data.summary?.trim() && (
        <>
          <SectionTitle>Summary</SectionTitle>
          <div style={{ fontSize: 12, color: "var(--r-muted)", lineHeight: 1.6 }}>{data.summary}</div>
        </>
      )}

      {data.skills?.length > 0 && (
        <>
          <SectionTitle>Skills</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {data.skills
              .filter((g) => g.category?.trim() || (g.skills || []).some((s) => s.trim()))
              .map((g) => (
                <div key={g.id} style={{ fontSize: 12 }}>
                  <div style={{ fontWeight: 700, color: "var(--r-text)" }}>{g.category || "Skills"}</div>
                  <div style={{ color: "var(--r-muted)" }}>{safeJoin(g.skills, ", ")}</div>
                </div>
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
                  <div style={{ fontWeight: 800 }}>{w.role || "Role"}</div>
                  <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                    {safeJoin([w.startDate, w.endDate], " - ")}
                  </div>
                </div>
                <div style={{ color: "var(--r-accent)", fontWeight: 600, fontSize: 12 }}>
                  {safeJoin([w.company, w.location], ", ")}
                </div>
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
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontWeight: 800 }}>
                    {p.name}
                    {p.link?.trim() ? (
                      <span style={{ fontWeight: 500, color: "var(--r-muted)", fontSize: 12 }}>
                        {" "}
                        — {p.link}
                      </span>
                    ) : null}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                    {(p.tech || []).filter(Boolean).slice(0, 5).join(" • ")}
                  </div>
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
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontWeight: 800 }}>
                    {e.degree || "Degree"}
                    {e.field?.trim() ? <span style={{ fontWeight: 600 }}> — {e.field}</span> : null}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                    {safeJoin([e.startDate, e.endDate], " - ")}
                  </div>
                </div>
                <div style={{ color: "var(--r-accent)", fontWeight: 600, fontSize: 12 }}>
                  {safeJoin([e.school, e.location], ", ")}
                  {e.gpa?.trim() ? <span style={{ color: "var(--r-muted)" }}> • GPA: {e.gpa}</span> : null}
                </div>
                <BulletList items={e.highlights || []} />
              </div>
            ))}
        </>
      )}
    </div>
  );
}

