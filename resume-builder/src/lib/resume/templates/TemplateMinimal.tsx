import React from "react";
import type { ResumeData } from "../types";
import { BulletList, HeaderLine, SectionTitle, safeJoin } from "./shared";

export default function TemplateMinimal({ data }: { data: ResumeData }) {
  return (
    <div style={{ background: "var(--r-bg)", color: "var(--r-text)", fontFamily: "ui-sans-serif, system-ui" }}>
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 26, fontWeight: 300, letterSpacing: 2 }}>
          {(data.basics.fullName || "YOUR NAME").toUpperCase()}
        </div>
        <div style={{ fontSize: 13, color: "var(--r-muted)", marginTop: 4 }}>
          {data.basics.headline || "Headline / Title"}
        </div>
        <HeaderLine data={data} />
      </div>
      <div style={{ borderTop: "1px solid var(--r-border)", marginTop: 10 }} />

      {data.summary?.trim() && (
        <>
          <SectionTitle>Objective</SectionTitle>
          <div style={{ fontSize: 12, color: "var(--r-muted)", lineHeight: 1.7 }}>{data.summary}</div>
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
                  <div style={{ fontWeight: 700 }}>{safeJoin([e.degree, e.field], " — ")}</div>
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

      {data.skills?.length > 0 && (
        <>
          <SectionTitle>Skills</SectionTitle>
          <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
            {data.skills
              .flatMap((g) => g.skills)
              .map((s) => s.trim())
              .filter(Boolean)
              .join(" • ")}
          </div>
        </>
      )}

      {data.work?.length > 0 && (
        <>
          <SectionTitle>Experience</SectionTitle>
          {data.work
            .filter((w) => w.company.trim() || w.role.trim())
            .map((w) => (
              <div key={w.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontWeight: 700 }}>{safeJoin([w.role, w.company], " — ")}</div>
                  <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                    {safeJoin([w.startDate, w.endDate], " - ")}
                  </div>
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
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                  {safeJoin([p.link, (p.tech || []).filter(Boolean).join(", ")], " • ")}
                </div>
                <BulletList items={p.bullets} />
              </div>
            ))}
        </>
      )}
    </div>
  );
}

