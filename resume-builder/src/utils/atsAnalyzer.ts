// ATS (Applicant Tracking System) Analysis Utility

export interface ATSAnalysisResult {
  score: number;
  strengths: string[];
  improvements: string[];
  keywords: string[];
  detailedBreakdown: {
    contactInfo: { score: number; maxScore: number; feedback: string };
    summary: { score: number; maxScore: number; feedback: string };
    experience: { score: number; maxScore: number; feedback: string };
    education: { score: number; maxScore: number; feedback: string };
    skills: { score: number; maxScore: number; feedback: string };
    formatting: { score: number; maxScore: number; feedback: string };
    keywords: { score: number; maxScore: number; feedback: string };
    length: { score: number; maxScore: number; feedback: string };
  };
}

// Common ATS keywords by industry
const INDUSTRY_KEYWORDS = {
  software: ['javascript', 'python', 'react', 'node.js', 'sql', 'git', 'agile', 'scrum', 'api', 'database'],
  marketing: ['seo', 'sem', 'google analytics', 'social media', 'content marketing', 'email marketing', 'crm', 'adobe creative suite'],
  finance: ['financial analysis', 'excel', 'vlookup', 'pivot tables', 'budgeting', 'forecasting', 'risk management', 'gaap'],
  healthcare: ['patient care', 'medical records', 'hipaa', 'clinical', 'healthcare', 'pharmaceutical', 'fda', 'medical terminology'],
  general: ['leadership', 'teamwork', 'communication', 'problem solving', 'project management', 'analytical', 'detail-oriented', 'results-driven']
};

// ATS-friendly section headers
const ATS_HEADERS = [
  'contact information', 'contact', 'personal information',
  'professional summary', 'summary', 'profile', 'objective',
  'work experience', 'experience', 'employment history', 'professional experience',
  'education', 'academic background', 'qualifications',
  'skills', 'technical skills', 'core competencies',
  'certifications', 'licenses', 'awards', 'achievements'
];

export class ATSAnalyzer {
  private text: string = '';
  private words: string[] = [];

  constructor(resumeText: string) {
    this.text = resumeText.toLowerCase();
    this.words = this.text.split(/\s+/);
  }

  analyze(): ATSAnalysisResult {
    const contactInfo = this.analyzeContactInfo();
    const summary = this.analyzeSummary();
    const experience = this.analyzeExperience();
    const education = this.analyzeEducation();
    const skills = this.analyzeSkills();
    const formatting = this.analyzeFormatting();
    const keywords = this.analyzeKeywords();
    const length = this.analyzeLength();

    const totalScore = contactInfo.score + summary.score + experience.score + 
                      education.score + skills.score + formatting.score + 
                      keywords.score + length.score;
    
    const maxScore = contactInfo.maxScore + summary.maxScore + experience.maxScore + 
                    education.maxScore + skills.maxScore + formatting.maxScore + 
                    keywords.maxScore + length.maxScore;

    const finalScore = Math.round((totalScore / maxScore) * 100);

    return {
      score: finalScore,
      strengths: this.generateStrengths(contactInfo, summary, experience, education, skills, formatting, keywords, length),
      improvements: this.generateImprovements(contactInfo, summary, experience, education, skills, formatting, keywords, length),
      keywords: this.suggestKeywords(),
      detailedBreakdown: {
        contactInfo,
        summary,
        experience,
        education,
        skills,
        formatting,
        keywords,
        length
      }
    };
  }

  private analyzeContactInfo(): { score: number; maxScore: number; feedback: string } {
    let score = 0;
    const maxScore = 15;
    let feedback = '';

    // Check for email
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    if (emailRegex.test(this.text)) {
      score += 5;
      feedback += '✓ Professional email found. ';
    } else {
      feedback += '✗ Missing professional email address. ';
    }

    // Check for phone number
    const phoneRegex = /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/;
    if (phoneRegex.test(this.text)) {
      score += 5;
      feedback += '✓ Phone number found. ';
    } else {
      feedback += '✗ Missing phone number. ';
    }

    // Check for location
    const locationKeywords = ['city', 'state', 'address', 'location', 'based in', 'located'];
    const hasLocation = locationKeywords.some(keyword => this.text.includes(keyword));
    if (hasLocation) {
      score += 3;
      feedback += '✓ Location information present. ';
    } else {
      feedback += '✗ Consider adding location. ';
    }

    // Check for LinkedIn
    const linkedinRegex = /linkedin\.com\/in\/|linkedin\.com\/pub\//;
    if (linkedinRegex.test(this.text)) {
      score += 2;
      feedback += '✓ LinkedIn profile included. ';
    } else {
      feedback += '✗ Consider adding LinkedIn profile. ';
    }

    return { score, maxScore, feedback: feedback.trim() };
  }

  private analyzeSummary(): { score: number; maxScore: number; feedback: string } {
    let score = 0;
    const maxScore = 15;
    let feedback = '';

    // Check for summary section
    const summaryKeywords = ['summary', 'profile', 'objective', 'about'];
    const hasSummary = summaryKeywords.some(keyword => this.text.includes(keyword));
    
    if (hasSummary) {
      score += 5;
      feedback += '✓ Professional summary present. ';
      
      // Check summary length (should be 2-4 sentences)
      const summaryMatch = this.text.match(/(?:summary|profile|objective|about)[\s\S]*?(?=\n\n|\n[A-Z]|$)/i);
      if (summaryMatch) {
        const summaryText = summaryMatch[0];
        const sentences = summaryText.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length >= 2 && sentences.length <= 4) {
          score += 5;
          feedback += '✓ Summary length is appropriate. ';
        } else {
          feedback += '✗ Summary should be 2-4 sentences. ';
        }
      }

      // Check for action words
      const actionWords = ['developed', 'managed', 'led', 'created', 'implemented', 'achieved', 'improved', 'increased', 'reduced'];
      const hasActionWords = actionWords.some(word => this.text.includes(word));
      if (hasActionWords) {
        score += 5;
        feedback += '✓ Strong action words used. ';
      } else {
        feedback += '✗ Use more action words in summary. ';
      }
    } else {
      feedback += '✗ Missing professional summary section. ';
    }

    return { score, maxScore, feedback: feedback.trim() };
  }

  private analyzeExperience(): { score: number; maxScore: number; feedback: string } {
    let score = 0;
    const maxScore = 20;
    let feedback = '';

    // Check for experience section
    const experienceKeywords = ['experience', 'employment', 'work history', 'professional'];
    const hasExperience = experienceKeywords.some(keyword => this.text.includes(keyword));
    
    if (hasExperience) {
      score += 5;
      feedback += '✓ Work experience section present. ';

      // Check for quantified achievements
      const quantifiers = /\d+%|\$\d+|\d+\+|\d+ years|\d+ months|\d+ people|\d+ projects/;
      if (quantifiers.test(this.text)) {
        score += 8;
        feedback += '✓ Quantified achievements found. ';
      } else {
        feedback += '✗ Add quantified achievements (numbers, percentages). ';
      }

      // Check for job titles and companies
      const jobTitlePattern = /(?:senior|junior|lead|principal|manager|director|analyst|engineer|developer|specialist|coordinator|assistant)/i;
      if (jobTitlePattern.test(this.text)) {
        score += 4;
        feedback += '✓ Clear job titles present. ';
      } else {
        feedback += '✗ Include clear job titles. ';
      }

      // Check for dates
      const datePattern = /\b(19|20)\d{2}\b|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}\b/i;
      if (datePattern.test(this.text)) {
        score += 3;
        feedback += '✓ Employment dates included. ';
      } else {
        feedback += '✗ Include employment dates. ';
      }
    } else {
      feedback += '✗ Missing work experience section. ';
    }

    return { score, maxScore, feedback: feedback.trim() };
  }

  private analyzeEducation(): { score: number; maxScore: number; feedback: string } {
    let score = 0;
    const maxScore = 10;
    let feedback = '';

    // Check for education section
    const educationKeywords = ['education', 'academic', 'degree', 'university', 'college', 'bachelor', 'master', 'phd'];
    const hasEducation = educationKeywords.some(keyword => this.text.includes(keyword));
    
    if (hasEducation) {
      score += 5;
      feedback += '✓ Education section present. ';

      // Check for degree information
      const degreePattern = /\b(bachelor|master|phd|associate|diploma|certificate|degree)\b/i;
      if (degreePattern.test(this.text)) {
        score += 3;
        feedback += '✓ Degree information included. ';
      } else {
        feedback += '✗ Include degree information. ';
      }

      // Check for graduation year
      const gradYearPattern = /\b(19|20)\d{2}\b/;
      if (gradYearPattern.test(this.text)) {
        score += 2;
        feedback += '✓ Graduation year included. ';
      } else {
        feedback += '✗ Consider adding graduation year. ';
      }
    } else {
      feedback += '✗ Missing education section. ';
    }

    return { score, maxScore, feedback: feedback.trim() };
  }

  private analyzeSkills(): { score: number; maxScore: number; feedback: string } {
    let score = 0;
    const maxScore = 15;
    let feedback = '';

    // Check for skills section
    const skillsKeywords = ['skills', 'technical skills', 'competencies', 'expertise'];
    const hasSkills = skillsKeywords.some(keyword => this.text.includes(keyword));
    
    if (hasSkills) {
      score += 5;
      feedback += '✓ Skills section present. ';

      // Count technical skills
      const technicalSkills = ['javascript', 'python', 'java', 'react', 'angular', 'vue', 'node.js', 'sql', 'excel', 'photoshop', 'word', 'powerpoint'];
      const foundSkills = technicalSkills.filter(skill => this.text.includes(skill));
      
      if (foundSkills.length >= 5) {
        score += 7;
        feedback += `✓ Strong technical skills (${foundSkills.length} found). `;
      } else if (foundSkills.length >= 3) {
        score += 5;
        feedback += `✓ Good technical skills (${foundSkills.length} found). `;
      } else {
        feedback += '✗ Add more technical skills. ';
      }

      // Check for soft skills
      const softSkills = ['leadership', 'communication', 'teamwork', 'problem solving', 'time management', 'adaptability'];
      const foundSoftSkills = softSkills.filter(skill => this.text.includes(skill));
      
      if (foundSoftSkills.length >= 3) {
        score += 3;
        feedback += '✓ Good soft skills included. ';
      } else {
        feedback += '✗ Consider adding soft skills. ';
      }
    } else {
      feedback += '✗ Missing skills section. ';
    }

    return { score, maxScore, feedback: feedback.trim() };
  }

  private analyzeFormatting(): { score: number; maxScore: number; feedback: string } {
    let score = 0;
    const maxScore = 10;
    let feedback = '';

    // Check for proper section headers
    const hasHeaders = ATS_HEADERS.some(header => this.text.includes(header));
    if (hasHeaders) {
      score += 3;
      feedback += '✓ Clear section headers present. ';
    } else {
      feedback += '✗ Use clear section headers. ';
    }

    // Check for bullet points
    const bulletPoints = (this.text.match(/[•·▪▫‣⁃]/g) || []).length;
    if (bulletPoints >= 5) {
      score += 4;
      feedback += '✓ Good use of bullet points. ';
    } else if (bulletPoints >= 2) {
      score += 2;
      feedback += '✓ Some bullet points used. ';
    } else {
      feedback += '✗ Use more bullet points for readability. ';
    }

    // Check for consistent formatting
    const lines = this.text.split('\n');
    const hasConsistentFormatting = lines.some(line => line.trim().length > 0);
    if (hasConsistentFormatting) {
      score += 3;
      feedback += '✓ Consistent formatting detected. ';
    } else {
      feedback += '✗ Ensure consistent formatting. ';
    }

    return { score, maxScore, feedback: feedback.trim() };
  }

  private analyzeKeywords(): { score: number; maxScore: number; feedback: string } {
    let score = 0;
    const maxScore = 10;
    let feedback = '';

    // Count industry keywords
    const allKeywords = Object.values(INDUSTRY_KEYWORDS).reduce<string[]>(
      (acc, arr) => acc.concat(arr),
      [],
    );
    const foundKeywords = allKeywords.filter(keyword => this.text.includes(keyword));
    
    if (foundKeywords.length >= 10) {
      score += 7;
      feedback += `✓ Excellent keyword density (${foundKeywords.length} keywords). `;
    } else if (foundKeywords.length >= 5) {
      score += 5;
      feedback += `✓ Good keyword usage (${foundKeywords.length} keywords). `;
    } else if (foundKeywords.length >= 2) {
      score += 3;
      feedback += `✓ Some relevant keywords (${foundKeywords.length} found). `;
    } else {
      feedback += '✗ Add more industry-relevant keywords. ';
    }

    // Check for action verbs
    const actionVerbs = ['managed', 'developed', 'created', 'implemented', 'led', 'achieved', 'improved', 'increased', 'reduced', 'optimized'];
    const foundActionVerbs = actionVerbs.filter(verb => this.text.includes(verb));
    
    if (foundActionVerbs.length >= 5) {
      score += 3;
      feedback += '✓ Strong action verbs used. ';
    } else if (foundActionVerbs.length >= 2) {
      score += 2;
      feedback += '✓ Some action verbs present. ';
    } else {
      feedback += '✗ Use more action verbs. ';
    }

    return { score, maxScore, feedback: feedback.trim() };
  }

  private analyzeLength(): { score: number; maxScore: number; feedback: string } {
    let score = 0;
    const maxScore = 5;
    let feedback = '';

    const wordCount = this.words.length;
    
    if (wordCount >= 300 && wordCount <= 500) {
      score += 5;
      feedback += '✓ Optimal resume length. ';
    } else if (wordCount >= 200 && wordCount <= 600) {
      score += 3;
      feedback += '✓ Good resume length. ';
    } else if (wordCount < 200) {
      feedback += '✗ Resume too short - add more details. ';
    } else {
      feedback += '✗ Resume too long - consider condensing. ';
    }

    return { score, maxScore, feedback: feedback.trim() };
  }

  private generateStrengths(...sections: any[]): string[] {
    const strengths: string[] = [];
    
    sections.forEach(section => {
      if (section.score / section.maxScore >= 0.8) {
        if (section === sections[0]) strengths.push('Strong contact information');
        if (section === sections[1]) strengths.push('Well-written professional summary');
        if (section === sections[2]) strengths.push('Comprehensive work experience');
        if (section === sections[3]) strengths.push('Complete education section');
        if (section === sections[4]) strengths.push('Strong skills section');
        if (section === sections[5]) strengths.push('Professional formatting');
        if (section === sections[6]) strengths.push('Good keyword optimization');
        if (section === sections[7]) strengths.push('Appropriate length');
      }
    });

    return strengths.length > 0 ? strengths : ['Resume shows potential with room for improvement'];
  }

  private generateImprovements(...sections: any[]): string[] {
    const improvements: string[] = [];
    
    sections.forEach(section => {
      if (section.score / section.maxScore < 0.6) {
        if (section === sections[0]) improvements.push('Add complete contact information including email and phone');
        if (section === sections[1]) improvements.push('Include a compelling professional summary');
        if (section === sections[2]) improvements.push('Enhance work experience with quantified achievements');
        if (section === sections[3]) improvements.push('Add education details including degree and graduation year');
        if (section === sections[4]) improvements.push('Expand skills section with technical and soft skills');
        if (section === sections[5]) improvements.push('Improve formatting with clear headers and bullet points');
        if (section === sections[6]) improvements.push('Add more industry-relevant keywords');
        if (section === sections[7]) improvements.push('Adjust resume length for optimal impact');
      }
    });

    return improvements.length > 0 ? improvements : ['Continue building on your strengths'];
  }

  private suggestKeywords(): string[] {
    const allKeywords = Object.values(INDUSTRY_KEYWORDS).reduce<string[]>(
      (acc, arr) => acc.concat(arr),
      [],
    );
    const missingKeywords = allKeywords.filter(keyword => !this.text.includes(keyword));
    
    // Return 5 random missing keywords
    return missingKeywords.sort(() => 0.5 - Math.random()).slice(0, 5);
  }
}
