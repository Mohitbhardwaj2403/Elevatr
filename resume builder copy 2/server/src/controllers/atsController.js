export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File not uploaded" });

    // Medium-level scoring logic
    const randomScore = Math.floor(50 + Math.random() * 50);

    const strengths = [
      "Clean readable formatting",
      "Good section separation",
      "File size is ATS compatible",
    ];

    const improvements = [
      "Add more measurable achievements",
      "Include more technical keywords",
    ];

    const keywords = ["React", "Node.js", "Agile", "Team Collaboration"];

    let message =
      randomScore >= 80
        ? "Excellent resume! Minor improvements recommended."
        : randomScore >= 60
        ? "Good resume but needs some refinements."
        : "Resume needs major improvements for ATS.";

    return res.json({
      score: randomScore,
      strengths,
      improvements,
      keywords,
      message,
    });
  } catch (err) {
    res.status(500).json({ error: "Error analyzing resume" });
  }
};
