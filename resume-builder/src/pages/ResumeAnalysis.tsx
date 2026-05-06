import React, { useState, useRef } from "react";
import { Upload, FileText, TrendingUp, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ATSAnalyzer } from "../utils/atsAnalyzer";
import { extractResumeText } from "../utils/extractResumeText";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const ResumeAnalysis: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobRole, setJobRole] = useState<"software_engineer" | "data_scientist">(
    "software_engineer",
  );
  const [mode, setMode] = useState<"local" | "ai">("local");
  const inputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
  };

  const analyzeResume = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const text = await extractResumeText(file);
      if (text.length < 80) {
        alert(
          "Could not read enough text from this file. Try a different PDF, or save your resume as .txt.",
        );
        setLoading(false);
        return;
      }

      if (mode === "ai") {
        if (!jobDescription.trim()) {
          throw new Error("Please paste a job description for AI ATS scoring.");
        }
        const aiPath = token ? "/resume/ats-score" : "/resume/ats-score-public";
        const ai = await apiFetch<any>(aiPath, {
          method: "POST",
          auth: Boolean(token),
          body: JSON.stringify({
            resume_text: text,
            job_description: jobDescription,
            job_role: jobRole,
          }),
        });
        const feedback = Array.isArray(ai.feedback) ? ai.feedback : [];
        const matchedKeywords = Array.isArray(ai.matched_keywords) ? ai.matched_keywords : [];
        const sectionsFound = Array.isArray(ai.sections_found) ? ai.sections_found : [];
        const strengths: string[] = [];
        if ((ai.keyword_match ?? 0) >= 70) {
          strengths.push(`Strong keyword match (${ai.keyword_match}%).`);
        }
        if (matchedKeywords.length > 0) {
          strengths.push(`Matched keywords: ${matchedKeywords.join(", ")}`);
        }
        if (sectionsFound.length > 0) {
          strengths.push(`Sections present: ${sectionsFound.join(", ")}`);
        }
        const improvements = feedback;
        setResult({
          score: ai.score,
          strengths: strengths.length ? strengths : ["Deterministic ATS analysis complete."],
          improvements: improvements.length ? improvements : ["No specific improvements reported."],
          keywords: ai.missing_keywords || [],
          message: ai.is_resume ? "Dataset ATS analysis complete." : "Uploaded file is not a valid resume.",
          keywordMatch: ai.keyword_match ?? 0,
          sectionsFound,
          missingSections: ai.missing_sections || [],
          contentQualityScore: ai.content_quality_score ?? 0,
          formattingScore: ai.formatting_score ?? 0,
          isResume: ai.is_resume ?? true,
          _raw: ai,
        });
      } else {
        const analysis = new ATSAnalyzer(text).analyze();
        const score = analysis.score;
        const message =
          score >= 80
            ? "Excellent resume! Minor improvements recommended."
            : score >= 60
              ? "Good resume but needs some refinements."
              : "Resume needs major improvements for ATS.";

        setResult({
          score,
          strengths: analysis.strengths,
          improvements: analysis.improvements,
          keywords: analysis.keywords,
          message,
        });
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error analyzing resume");
    }

    setLoading(false);
  };

  const getColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Back */}
      <Link to="/" className="flex items-center mb-6 text-blue-600">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </Link>

      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        AI Resume Analysis.
      </h1>

      {/* Mode */}
      <div className="max-w-3xl mx-auto mb-6 bg-white rounded-xl shadow p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-gray-800">Analysis mode</p>
            <p className="text-sm text-gray-600">
              Local mode works without login. Backend ATS mode uses deterministic dataset scoring and needs a job description.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("local")}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                mode === "local" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              Local (offline)
            </button>
            <button
              type="button"
              onClick={() => setMode("ai")}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                mode === "ai" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              Backend ATS (Dataset)
            </button>
          </div>
        </div>

        {mode === "ai" && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Target role</label>
            <select
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value as "software_engineer" | "data_scientist")}
              className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="software_engineer">Software Engineer</option>
              <option value="data_scientist">Data Scientist</option>
            </select>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Paste the job description here (required for AI ATS scoring)"
            />
            {!token && <p className="mt-2 text-sm text-blue-700">Using public ATS endpoint (no login required).</p>}
          </div>
        )}
      </div>

      {/* Upload box */}
      {!file && !result && (
        <div
          className="border-2 border-dashed p-10 rounded-xl text-center cursor-pointer bg-white"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-700">Click to upload your resume (PDF or plain text)</p>

          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept=".pdf,.txt"
            onChange={handleUpload}
          />
        </div>
      )}

      {/* Selected file */}
      {file && !result && (
        <div className="bg-white p-6 rounded-xl shadow mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-semibold">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            <button onClick={() => setFile(null)} className="text-red-500">
              Remove
            </button>
          </div>

          <button
            onClick={analyzeResume}
            disabled={loading}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 flex justify-center"
          >
            {loading ? (
              "Analyzing..."
            ) : (
              <>
                <TrendingUp className="w-5 h-5 mr-2" /> Analyze Resume
              </>
            )}
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-8 space-y-6">
          {/* Score */}
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h2 className="text-xl font-bold mb-2">ATS Score</h2>
            <p className={`text-5xl font-bold ${getColor(result.score)}`}>
              {result.score}
            </p>
            <p className="mt-3 text-gray-600">{result.message}</p>
            {mode === "ai" && result.isResume && (
              <div className="mt-4 text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <p>Keyword Match: <span className="font-semibold">{result.keywordMatch}%</span></p>
                <p>Content Quality: <span className="font-semibold">{result.contentQualityScore}%</span></p>
                <p>Formatting: <span className="font-semibold">{result.formattingScore}%</span></p>
              </div>
            )}
          </div>

          {/* Strengths */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-lg mb-3 text-green-600">Strengths</h3>
            <ul className="space-y-2">
              {result.strengths.map((s: string, i: number) => (
                <li key={i} className="text-gray-700">
                  • {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-lg mb-3 text-yellow-600">
              Improvements Needed
            </h3>
            <ul className="space-y-2">
              {result.improvements.map((im: string, i: number) => (
                <li key={i} className="text-gray-700">
                  • {im}
                </li>
              ))}
            </ul>
          </div>

          {/* Keywords */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-lg mb-3">Suggested Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {result.keywords.map((kw: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {mode === "ai" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-lg mb-3">Section Coverage</h3>
              <p className="text-sm text-green-700 mb-2">
                Found: {(result.sectionsFound || []).join(", ") || "None"}
              </p>
              <p className="text-sm text-red-700">
                Missing: {(result.missingSections || []).join(", ") || "None"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeAnalysis;
