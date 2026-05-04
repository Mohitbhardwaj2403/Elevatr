import React, { useState, useRef } from "react";
import { Upload, FileText, TrendingUp, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ATSAnalyzer } from "../utils/atsAnalyzer";
import { extractResumeText } from "../utils/extractResumeText";

const ResumeAnalysis: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
        AI Resume Analysis
      </h1>

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
        </div>
      )}
    </div>
  );
};

export default ResumeAnalysis;
