import React from "react";
import type { ResumeData } from "../types";
import { BulletList, HeaderLine, SectionTitle, safeJoin } from "./shared";

export default function TemplateExecutive({ data }: { data: ResumeData }) {
  return (
    <div style={{ background: "var(--r-bg)", color: "var(--r-text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 950 }}>{data.basics.fullName || "Your Name"}</div>
          <div style={{ marginTop: 4, fontWeight: 800, color: "var(--r-accent)" }}>
            {data.basics.headline || "Headline / Title"}
          </div>
          <HeaderLine data={data} />
        </div>
        <div style={{ width: 160, height: 10, background: "var(--r-accent)", borderRadius: 999, marginTop: 10 }} />
      </div>

      {data.summary?.trim() && (
        <>
          <SectionTitle>Executive Summary</SectionTitle>
          <div style={{ fontSize: 12, color: "var(--r-muted)", lineHeight: 1.7 }}>{data.summary}</div>
        </>
      )}

      {data.achievements?.some((a) => a.trim()) && (
        <>
          <SectionTitle>Key Achievements</SectionTitle>
          <BulletList items={data.achievements} />
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
                  <div style={{ fontWeight: 900 }}>{w.role || "Role"}</div>
                  <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                    {safeJoin([w.startDate, w.endDate], " - ")}
                  </div>
                </div>
                <div style={{ color: "var(--r-accent)", fontWeight: 800, fontSize: 12 }}>
                  {safeJoin([w.company, w.location], ", ")}
                </div>
                <BulletList items={w.bullets} />
              </div>
            ))}
        </>
      )}

      {data.skills?.length > 0 && (
        <>
          <SectionTitle>Core Skills</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {data.skills
              .filter((g) => (g.skills || []).some((s) => s.trim()))
              .map((g) => (
                <div key={g.id} style={{ fontSize: 12 }}>
                  <div style={{ fontWeight: 900 }}>{g.category || "Skills"}</div>
                  <div style={{ color: "var(--r-muted)" }}>{safeJoin(g.skills, ", ")}</div>
                </div>
              ))}
          </div>
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
                  {safeJoin([e.school, e.location], ", ")}{" "}
                  {safeJoin([e.startDate, e.endDate], " - ")}
                  {e.gpa?.trim() ? ` • GPA: ${e.gpa}` : ""}
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
}

