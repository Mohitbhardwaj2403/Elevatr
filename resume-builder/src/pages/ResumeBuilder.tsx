import React, { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Palette as PaletteIcon,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { ResumeDetailsForm } from "../component/ResumeDetailsForm";
import { PALETTES, getPalette, type PaletteId } from "../resume/palettes";
import type { ResumeData } from "../resume/types";
import { RESUME_TEMPLATES } from "../resume/templates";
import { resumeToText } from "../resume/text";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const STORAGE_KEY = "elevatr.resumeBuilder.v1";

const defaultData: ResumeData = {
  basics: {
    fullName: "",
    headline: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
  },
  skills: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  achievements: [],
};

const ResumeBuilder: React.FC = () => {
  const [step, setStep] = useState<"details" | "design" | "preview">("details");
  const [data, setData] = useState<ResumeData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ResumeData) : defaultData;
    } catch {
      return defaultData;
    }
  });
  const [templateId, setTemplateId] = useState<string>(RESUME_TEMPLATES[0].id);
  const [paletteId, setPaletteId] = useState<PaletteId>("blueBlack");
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const { token } = useAuth();

  const palette = useMemo(() => getPalette(paletteId), [paletteId]);
  const template = useMemo(
    () => RESUME_TEMPLATES.find((t) => t.id === templateId) ?? RESUME_TEMPLATES[0],
    [templateId],
  );

  const persist = (next: ResumeData) => {
    setData(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleDownloadResume = async () => {
    setIsDownloading(true);
    try {
      await generatePDF();
    } catch (e) {
      console.error(e);
      // fallback to text download
      const text = resumeToText(data);
      const blob = new Blob([text], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `resume_${template.name.toLowerCase().replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  const generatePDF = async () => {
    if (!resumeRef.current) throw new Error("Resume preview not ready.");
    const canvas = await html2canvas(resumeRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: resumeRef.current.scrollWidth,
      windowHeight: resumeRef.current.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save(`resume_${template.name.toLowerCase().replace(/\s+/g, "_")}.pdf`);
  };

  const saveToBackend = async () => {
    if (!token) {
      alert("Please login to save resumes.");
      return;
    }
    setIsSaving(true);
    try {
      const text = resumeToText(data);
      await apiFetch("/resume/create", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          title: `${data.basics.fullName || "Resume"} – ${template.name}`,
          resume_text: text,
          template: template.id,
        }),
      });
      alert("Saved to your account.");
    } catch (e) {
      console.error(e);
      alert("Failed to save resume.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <Link
                to="/resume-analysis"
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Analysis
              </Link>
              <div className="h-8 w-px bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  Resume Builder
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
                <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Step {step === "details" ? 1 : step === "design" ? 2 : 3} of 3
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <div className="flex items-center justify-center w-full">
              <div className="flex items-center space-x-8">
                {[
                  { step: "details", label: "Enter Details", completed: step !== "details" },
                  { step: "design", label: "Choose Design", completed: step === "preview" },
                  { step: "preview", label: "Preview & Download", completed: false },
                ].map((item, index) => (
                  <div key={item.step} className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-all duration-300 ${
                      item.completed 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white scale-110' 
                        : step === item.step 
                          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-110 shadow-blue-200' 
                          : 'bg-white text-gray-400 border-2 border-gray-200'
                    }`}>
                      {item.completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="text-lg">{index + 1}</span>
                      )}
                    </div>
                    <span className={`ml-3 text-sm font-semibold transition-colors ${
                      item.completed || step === item.step ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {item.label}
                    </span>
                    {index < 2 && (
                      <div className={`w-16 h-1 mx-6 rounded-full transition-all duration-300 ${
                        item.completed 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {step === "details" && (
          <>
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl mb-6">
                <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-gray-100 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4">
                Enter your resume details
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Fill your information once. We will automatically replace values in any selected template.
              </p>
            </div>
            <ResumeDetailsForm value={data} onChange={persist} />
            <div className="mt-10 flex justify-end">
              <button
                onClick={() => setStep("design")}
                className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold"
              >
                Next: Choose design
              </button>
            </div>
          </>
        )}

        {step === "design" && (
          <>
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl mb-6">
                <PaletteIcon className="w-10 h-10 text-purple-700" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-800 bg-clip-text text-transparent mb-4">
                Pick a template + color palette
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Choose from at least 10 designs. Then pick a palette like Black & White, Blue & Black, and more.
              </p>
            </div>

            <div className="bg-white/90 rounded-3xl border border-gray-200/50 p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Color palette</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {PALETTES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaletteId(p.id)}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                      paletteId === p.id ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{p.name}</div>
                      <div className="text-sm text-gray-600">Accent: {p.id}</div>
                    </div>
                    <div className="flex gap-2">
                      <div className={`w-6 h-6 rounded ${p.accentBg}`} />
                      <div className="w-6 h-6 rounded bg-gray-900" />
                      <div className="w-6 h-6 rounded bg-white border border-gray-200" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 bg-white/90 rounded-3xl border border-gray-200/50 p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Resume templates</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {RESUME_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplateId(t.id)}
                    className={`rounded-2xl border p-5 text-left hover:shadow-md transition ${
                      templateId === t.id ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200"
                    }`}
                  >
                    <div className="font-bold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{t.description}</div>
                    <div className="mt-3 text-xs text-gray-500">{t.id}</div>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setStep("details")}
                  className="px-6 py-3 rounded-2xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setStep("preview");
                    setShowPreview(true);
                  }}
                  className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold"
                >
                  Preview
                </button>
              </div>
            </div>
          </>
        )}

        {step === "preview" && (
          <div className="mt-6 bg-white/90 rounded-3xl border border-gray-200/50 p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Preview</h3>
                <p className="text-gray-600">
                  Template: <span className="font-semibold">{template.name}</span> • Palette:{" "}
                  <span className="font-semibold">{palette.name}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowPreview(true)}
                  className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold flex items-center"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Open full preview
                </button>
                <button
                  onClick={handleDownloadResume}
                  disabled={isDownloading}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold flex items-center disabled:opacity-50"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {isDownloading ? "Preparing..." : "Download PDF"}
                </button>
                <button
                  onClick={saveToBackend}
                  disabled={isSaving}
                  className="px-6 py-3 rounded-2xl border border-gray-300 text-gray-800 font-bold disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save to account"}
                </button>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-2xl p-4 overflow-auto">
              <div className="mx-auto bg-white shadow-lg" style={{ width: 794, minHeight: 1123 }}>
                <div ref={resumeRef} className="w-[794px] min-h-[1123px]">
                  <template.Component data={data} palette={palette} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-gray-100 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4">
              Why Choose Our AI Resume Builder?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the future of resume creation with our cutting-edge AI technology
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">AI-Powered Generation</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our advanced AI analyzes your content and creates optimized resumes tailored to your industry and career level
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">ATS-Optimized</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                All templates are designed to pass Applicant Tracking Systems and maximize your chances of getting noticed
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Download className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Instant Download</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Get your professional resume in PDF format ready to send to employers immediately
              </p>
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200/50">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
              <div>
                <div className="text-xl font-bold text-gray-900">Resume Preview</div>
                <div className="text-sm text-gray-600">
                  {template.name} • {palette.name}
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold"
              >
                Close
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)] bg-gray-50">
              <div className="mx-auto bg-white shadow-lg" style={{ width: 794, minHeight: 1123 }}>
                <div ref={resumeRef} className="w-[794px] min-h-[1123px]">
                  <template.Component data={data} palette={palette} />
                </div>
              </div>
              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={handleDownloadResume}
                  disabled={isDownloading}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold flex items-center disabled:opacity-50"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {isDownloading ? "Preparing..." : "Download PDF"}
                </button>
                <button
                  onClick={saveToBackend}
                  disabled={isSaving}
                  className="px-6 py-3 rounded-2xl border border-gray-300 text-gray-800 font-bold disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save to account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
