import React from "react";

import type { ResumeData, ResumeEducation, ResumeExperience, ResumeProject } from "../resume/types";

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

type Props = {
  value: ResumeData;
  onChange: (next: ResumeData) => void;
};

export const ResumeDetailsForm: React.FC<Props> = ({ value, onChange }) => {
  const setBasics = (patch: Partial<ResumeData["basics"]>) => {
    onChange({ ...value, basics: { ...value.basics, ...patch } });
  };

  const setSkillsText = (text: string) => {
    const skills = text
      .split(/[,\n]/g)
      .map((s) => s.trim())
      .filter(Boolean);
    onChange({ ...value, skills });
  };

  const updateExperience = (id: string, patch: Partial<ResumeExperience>) => {
    onChange({
      ...value,
      experience: value.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
  };

  const updateEducation = (id: string, patch: Partial<ResumeEducation>) => {
    onChange({
      ...value,
      education: value.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
  };

  const updateProject = (id: string, patch: Partial<ResumeProject>) => {
    onChange({
      ...value,
      projects: value.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  };

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Basic details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            value={value.basics.fullName}
            onChange={(e) => setBasics({ fullName: e.target.value })}
            className="border rounded-lg p-3"
            placeholder="Full name"
          />
          <input
            value={value.basics.headline}
            onChange={(e) => setBasics({ headline: e.target.value })}
            className="border rounded-lg p-3"
            placeholder="Headline (e.g., Full Stack Developer)"
          />
          <input
            value={value.basics.email}
            onChange={(e) => setBasics({ email: e.target.value })}
            className="border rounded-lg p-3"
            placeholder="Email"
          />
          <input
            value={value.basics.phone}
            onChange={(e) => setBasics({ phone: e.target.value })}
            className="border rounded-lg p-3"
            placeholder="Phone"
          />
          <input
            value={value.basics.location}
            onChange={(e) => setBasics({ location: e.target.value })}
            className="border rounded-lg p-3"
            placeholder="Location (City, Country)"
          />
          <input
            value={value.basics.linkedin}
            onChange={(e) => setBasics({ linkedin: e.target.value })}
            className="border rounded-lg p-3"
            placeholder="LinkedIn URL"
          />
          <input
            value={value.basics.github}
            onChange={(e) => setBasics({ github: e.target.value })}
            className="border rounded-lg p-3"
            placeholder="GitHub URL"
          />
          <input
            value={value.basics.website}
            onChange={(e) => setBasics({ website: e.target.value })}
            className="border rounded-lg p-3"
            placeholder="Portfolio / Website"
          />
        </div>
        <textarea
          value={value.basics.summary}
          onChange={(e) => setBasics({ summary: e.target.value })}
          className="mt-4 w-full border rounded-lg p-3"
          rows={4}
          placeholder="Professional summary (2–4 lines)."
        />
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Skills</h3>
        <p className="text-sm text-gray-600 mb-3">
          Add skills separated by commas or new lines.
        </p>
        <textarea
          value={value.skills.join(", ")}
          onChange={(e) => setSkillsText(e.target.value)}
          className="w-full border rounded-lg p-3"
          rows={3}
          placeholder="React, TypeScript, FastAPI, PostgreSQL, Docker..."
        />
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-bold text-gray-900">Work experience</h3>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...value,
                experience: [
                  ...value.experience,
                  {
                    id: uid("exp"),
                    company: "",
                    role: "",
                    location: "",
                    start: "",
                    end: "",
                    bullets: [""],
                  },
                ],
              })
            }
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold"
          >
            Add experience
          </button>
        </div>

        <div className="space-y-6">
          {value.experience.map((e) => (
            <div key={e.id} className="border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-gray-800">Experience</div>
                <button
                  type="button"
                  onClick={() =>
                    onChange({ ...value, experience: value.experience.filter((x) => x.id !== e.id) })
                  }
                  className="text-sm text-red-600"
                >
                  Remove
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={e.role}
                  onChange={(ev) => updateExperience(e.id, { role: ev.target.value })}
                  className="border rounded-lg p-2.5"
                  placeholder="Role"
                />
                <input
                  value={e.company}
                  onChange={(ev) => updateExperience(e.id, { company: ev.target.value })}
                  className="border rounded-lg p-2.5"
                  placeholder="Company"
                />
                <input
                  value={e.location}
                  onChange={(ev) => updateExperience(e.id, { location: ev.target.value })}
                  className="border rounded-lg p-2.5"
                  placeholder="Location"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={e.start}
                    onChange={(ev) => updateExperience(e.id, { start: ev.target.value })}
                    className="border rounded-lg p-2.5"
                    placeholder="Start (e.g., Jan 2024)"
                  />
                  <input
                    value={e.end}
                    onChange={(ev) => updateExperience(e.id, { end: ev.target.value })}
                    className="border rounded-lg p-2.5"
                    placeholder="End (e.g., Present)"
                  />
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-gray-700">Bullets</div>
                  <button
                    type="button"
                    onClick={() => updateExperience(e.id, { bullets: [...e.bullets, ""] })}
                    className="text-sm text-blue-600"
                  >
                    Add bullet
                  </button>
                </div>
                <div className="space-y-2">
                  {e.bullets.map((b, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        value={b}
                        onChange={(ev) => {
                          const next = [...e.bullets];
                          next[idx] = ev.target.value;
                          updateExperience(e.id, { bullets: next });
                        }}
                        className="flex-1 border rounded-lg p-2.5"
                        placeholder="Achievement bullet (use numbers if possible)"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = e.bullets.filter((_, i) => i !== idx);
                          updateExperience(e.id, { bullets: next.length ? next : [""] });
                        }}
                        className="px-3 border rounded-lg text-sm text-gray-600"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {value.experience.length === 0 && (
            <p className="text-sm text-gray-600">Add at least one experience entry (or internships).</p>
          )}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-bold text-gray-900">Education</h3>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...value,
                education: [
                  ...value.education,
                  { id: uid("edu"), school: "", degree: "", location: "", start: "", end: "", details: "" },
                ],
              })
            }
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold"
          >
            Add education
          </button>
        </div>
        <div className="space-y-4">
          {value.education.map((ed) => (
            <div key={ed.id} className="border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-gray-800">Education</div>
                <button
                  type="button"
                  onClick={() =>
                    onChange({ ...value, education: value.education.filter((x) => x.id !== ed.id) })
                  }
                  className="text-sm text-red-600"
                >
                  Remove
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={ed.school}
                  onChange={(e) => updateEducation(ed.id, { school: e.target.value })}
                  className="border rounded-lg p-2.5"
                  placeholder="School / College"
                />
                <input
                  value={ed.degree}
                  onChange={(e) => updateEducation(ed.id, { degree: e.target.value })}
                  className="border rounded-lg p-2.5"
                  placeholder="Degree"
                />
                <input
                  value={ed.location}
                  onChange={(e) => updateEducation(ed.id, { location: e.target.value })}
                  className="border rounded-lg p-2.5"
                  placeholder="Location"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={ed.start}
                    onChange={(e) => updateEducation(ed.id, { start: e.target.value })}
                    className="border rounded-lg p-2.5"
                    placeholder="Start"
                  />
                  <input
                    value={ed.end}
                    onChange={(e) => updateEducation(ed.id, { end: e.target.value })}
                    className="border rounded-lg p-2.5"
                    placeholder="End"
                  />
                </div>
              </div>
              <textarea
                value={ed.details}
                onChange={(e) => updateEducation(ed.id, { details: e.target.value })}
                className="mt-3 w-full border rounded-lg p-3"
                rows={2}
                placeholder="Details (GPA, coursework, etc.)"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-bold text-gray-900">Projects</h3>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...value,
                projects: [
                  ...value.projects,
                  { id: uid("proj"), name: "", link: "", tech: "", bullets: [""] },
                ],
              })
            }
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold"
          >
            Add project
          </button>
        </div>
        <div className="space-y-4">
          {value.projects.map((p) => (
            <div key={p.id} className="border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-gray-800">Project</div>
                <button
                  type="button"
                  onClick={() => onChange({ ...value, projects: value.projects.filter((x) => x.id !== p.id) })}
                  className="text-sm text-red-600"
                >
                  Remove
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={p.name}
                  onChange={(e) => updateProject(p.id, { name: e.target.value })}
                  className="border rounded-lg p-2.5"
                  placeholder="Project name"
                />
                <input
                  value={p.link}
                  onChange={(e) => updateProject(p.id, { link: e.target.value })}
                  className="border rounded-lg p-2.5"
                  placeholder="Link (optional)"
                />
                <input
                  value={p.tech}
                  onChange={(e) => updateProject(p.id, { tech: e.target.value })}
                  className="border rounded-lg p-2.5 md:col-span-2"
                  placeholder="Tech stack (e.g., React, FastAPI, Postgres)"
                />
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-gray-700">Bullets</div>
                  <button
                    type="button"
                    onClick={() => updateProject(p.id, { bullets: [...p.bullets, ""] })}
                    className="text-sm text-blue-600"
                  >
                    Add bullet
                  </button>
                </div>
                <div className="space-y-2">
                  {p.bullets.map((b, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        value={b}
                        onChange={(ev) => {
                          const next = [...p.bullets];
                          next[idx] = ev.target.value;
                          updateProject(p.id, { bullets: next });
                        }}
                        className="flex-1 border rounded-lg p-2.5"
                        placeholder="What did you build? what impact?"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = p.bullets.filter((_, i) => i !== idx);
                          updateProject(p.id, { bullets: next.length ? next : [""] });
                        }}
                        className="px-3 border rounded-lg text-sm text-gray-600"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

