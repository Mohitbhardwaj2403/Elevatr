import React from "react";
import type { ResumeData } from "../types";
import { BulletList, HeaderLine, SectionTitle, safeJoin } from "./shared";

export default function TemplateTimeline({ data }: { data: ResumeData }) {
  return (
    <div style={{ background: "var(--r-bg)", color: "var(--r-text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 950 }}>{data.basics.fullName || "Your Name"}</div>
          <div style={{ fontSize: 14, color: "var(--r-accent)", fontWeight: 800 }}>
            {data.basics.headline || "Headline / Title"}
          </div>
          <HeaderLine data={data} />
        </div>
        <div style={{ fontSize: 12, color: "var(--r-muted)" }}>{data.meta.title}</div>
      </div>

      {data.summary?.trim() && (
        <>
          <SectionTitle>Summary</SectionTitle>
          <div style={{ fontSize: 12, color: "var(--r-muted)", lineHeight: 1.65 }}>{data.summary}</div>
        </>
      )}

      {data.work?.length > 0 && (
        <>
          <SectionTitle>Experience</SectionTitle>
          <div style={{ position: "relative", paddingLeft: 14 }}>
            <div
              style={{
                position: "absolute",
                left: 6,
                top: 4,
                bottom: 4,
                width: 2,
                background: "color-mix(in srgb, var(--r-accent) 40%, var(--r-border))",
              }}
            />
            {data.work
              .filter((w) => w.company.trim() || w.role.trim())
              .map((w) => (
                <div key={w.id} style={{ marginBottom: 14, position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: -2,
                      top: 4,
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      background: "var(--r-accent)",
                    }}
                  />
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
          </div>
        </>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
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
                    <div style={{ fontSize: 12, color: "var(--r-muted)" }}>{safeJoin(g.skills, ", ")}</div>
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
                    <div style={{ fontSize: 12, color: "var(--r-muted)" }}>
                      {safeJoin([e.school, e.location], ", ")}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--r-muted)" }}>{safeJoin([e.startDate, e.endDate], " - ")}</div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

