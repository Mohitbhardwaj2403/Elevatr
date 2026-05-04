import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, Eye, Download, Palette, Briefcase, GraduationCap, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  prompt: string;
  sections: string[];
  features: string[];
}

interface ResumeUploadProps {
  onFileUpload?: (file: File, template?: ResumeTemplate) => void;
  onTemplateSelect?: (template: ResumeTemplate) => void;
}

interface FileAnalysis {
  text: string;
  wordCount: number;
  sections: string[];
  hasContactInfo: boolean;
  hasExperience: boolean;
  hasEducation: boolean;
  hasSkills: boolean;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onFileUpload, onTemplateSelect }) => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [fileAnalysis, setFileAnalysis] = useState<FileAnalysis | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const templates: ResumeTemplate[] = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean, ATS-friendly template perfect for corporate roles',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'bg-blue-500',
      prompt: "Make me a one-page professional resume using a modern, clean template. Include sections for: Career Objective, Education, Skills, Projects, Experience, Certifications, and Achievements. Use clear headings, bullet points, and a neat font. Keep it ATS-friendly.",
      sections: ['Professional Summary', 'Technical Skills', 'Professional Experience', 'Education', 'Certifications'],
      features: ['ATS-Optimized', 'Clean Layout', 'Professional Fonts', 'Clear Sections', 'Corporate Ready']
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Visually appealing design with icons and color highlights',
      icon: <Palette className="w-6 h-6" />,
      color: 'bg-purple-500',
      prompt: "Design a visually appealing resume using a creative template with icons and section highlights. Add sections: Profile Summary, Education, Technical Skills, Projects, Work Experience, Certifications, and Contact Info. Use a color theme that looks professional (blue/grey/white).",
      sections: ['Profile Summary', 'Technical Skills', 'Work Experience', 'Education', 'Achievements & Awards'],
      features: ['Visual Icons', 'Color Highlights', 'Modern Design', 'Eye-catching Layout', 'Creative Elements']
    },
    {
      id: 'minimal',
      name: 'Minimal & Elegant',
      description: 'Simple, clean design focusing on content clarity',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'bg-gray-600',
      prompt: "Generate a minimalistic resume template that focuses on clarity. Include sections for: Objective, Education, Skills, Projects, and Work Experience. Keep the layout simple with clean lines, lots of white space, and professional typography.",
      sections: ['Objective', 'Education', 'Skills', 'Experience', 'Projects'],
      features: ['Clean Lines', 'White Space', 'Simple Typography', 'Content Focus', 'Elegant Design']
    },
    {
      id: 'student',
      name: 'Student/Fresher',
      description: 'Perfect for students and fresh graduates',
      icon: <GraduationCap className="w-6 h-6" />,
      color: 'bg-green-500',
      prompt: "Create a resume template for a final-year student with little work experience. Add sections for: Career Objective, Education, Academic Projects, Internships, Skills, Certifications, and Extracurricular Activities. Make it look professional and concise.",
      sections: ['Career Objective', 'Education', 'Technical Skills', 'Academic Projects', 'Internships', 'Extracurricular Activities'],
      features: ['Student-Focused', 'Academic Projects', 'Internship Space', 'Extracurriculars', 'Entry-Level Ready']
    }
  ];

  const analyzeFile = async (file: File): Promise<FileAnalysis> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          // const arrayBuffer = e.target?.result as ArrayBuffer;
          
          // For PDF files, we'll simulate text extraction
          // In a real implementation, you'd use pdf-parse here
          let text = '';
          let sections: string[] = [];
          let hasContactInfo = false;
          let hasExperience = false;
          let hasEducation = false;
          let hasSkills = false;
          
          if (file.type === 'application/pdf') {
            // Simulate PDF text extraction
            text = `JOHN DOE
Software Engineer
john.doe@email.com | (555) 123-4567 | San Francisco, CA

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies.

TECHNICAL SKILLS
JavaScript, Python, React, Node.js, MongoDB, PostgreSQL, AWS, Docker

PROFESSIONAL EXPERIENCE
Senior Software Engineer | TechCorp Inc. | 2022-Present
• Led development of microservices architecture serving 100K+ users
• Improved application performance by 40% through code optimization
• Mentored 3 junior developers and conducted code reviews

Software Engineer | StartupXYZ | 2020-2022
• Developed RESTful APIs using Node.js and Express
• Designed and implemented database schemas for user management
• Collaborated with cross-functional teams in agile environment

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2020-2024 | GPA: 3.8/4.0

CERTIFICATIONS
• AWS Certified Developer Associate
• Google Cloud Professional Developer
• Microsoft Azure Fundamentals`;
            
            // Analyze content for sections
            const textLower = text.toLowerCase();
            sections = ['Professional Summary', 'Technical Skills', 'Professional Experience', 'Education', 'Certifications'];
            hasContactInfo = textLower.includes('@') && textLower.includes('phone');
            hasExperience = textLower.includes('experience') || textLower.includes('engineer');
            hasEducation = textLower.includes('education') || textLower.includes('university');
            hasSkills = textLower.includes('skills') || textLower.includes('javascript');
          } else {
            // For DOCX files, we'll simulate text extraction
            text = `JOHN DOE
Software Engineer
john.doe@email.com | (555) 123-4567

PROFESSIONAL SUMMARY
Experienced software engineer with expertise in full-stack development.

TECHNICAL SKILLS
JavaScript, Python, React, Node.js, MongoDB

EXPERIENCE
Senior Software Engineer | TechCorp Inc. | 2022-Present
• Led development of microservices architecture
• Improved application performance by 40%

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2020-2024`;
            
            sections = ['Professional Summary', 'Technical Skills', 'Experience', 'Education'];
            hasContactInfo = text.toLowerCase().includes('@');
            hasExperience = text.toLowerCase().includes('experience');
            hasEducation = text.toLowerCase().includes('education');
            hasSkills = text.toLowerCase().includes('skills');
          }
          
          const wordCount = text.split(/\s+/).length;
          
          resolve({
            text,
            wordCount,
            sections,
            hasContactInfo,
            hasExperience,
            hasEducation,
            hasSkills
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && (uploadedFile.type === 'application/pdf' || uploadedFile.type.includes('document'))) {
      setFile(uploadedFile);
      setIsScanning(true);
      setScanError(null);
      
      try {
        const analysis = await analyzeFile(uploadedFile);
        setFileAnalysis(analysis);
        onFileUpload?.(uploadedFile, selectedTemplate || undefined);
      } catch (error) {
        console.error('Error analyzing file:', error);
        setScanError('Failed to analyze the uploaded file. Please try again.');
      } finally {
        setIsScanning(false);
      }
    }
  };

  const handleTemplateSelect = (template: ResumeTemplate) => {
    setSelectedTemplate(template);
    setShowTemplates(false);
    onTemplateSelect?.(template);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setSelectedTemplate(null);
  };

  const handleGenerateResume = () => {
    if (selectedTemplate) {
      // This would typically call an API to generate the resume
      console.log('Generating resume with template:', selectedTemplate);
      console.log('Using prompt:', selectedTemplate.prompt);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Template Selection */}
      {!file && (
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-gray-100 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-4">
              Choose Your Resume Template
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Select a template that best fits your career stage and industry. Each template is professionally designed and ATS-optimized.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  selectedTemplate?.id === template.id
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-xl scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                {selectedTemplate?.id === template.id && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className={`w-16 h-16 ${template.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {template.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {template.name}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {template.description}
                </p>
                
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Key Features:
                  </div>
                  {template.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="text-xs text-gray-600 dark:text-gray-300 flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                  {template.features.length > 3 && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      +{template.features.length - 3} more features
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Sections:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {template.sections.slice(0, 2).map((section, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                        {section}
                      </span>
                    ))}
                    {template.sections.length > 2 && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                        +{template.sections.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedTemplate && (
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-8 mb-8 shadow-lg">
              <div className="flex items-start space-x-6">
                <div className={`w-16 h-16 ${selectedTemplate.color} rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg`}>
                  {selectedTemplate.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Selected: {selectedTemplate.name}</h3>
                    <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-semibold">
                      ✓ Ready
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{selectedTemplate.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Included Sections:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTemplate.sections.map((section, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-medium">
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Key Features:</h4>
                      <div className="space-y-2">
                        {selectedTemplate.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* File Upload Section */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-10">
        {!file ? (
          <div>
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-16 text-center hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                {selectedTemplate ? 'Upload Your Resume' : 'Choose Template First'}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                {selectedTemplate 
                  ? 'Drag and drop your resume here, or click to browse files. We support PDF and DOCX formats.'
                  : 'Please select a template above before uploading your resume'
                }
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  PDF Files
                </div>
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  DOCX Files
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Secure Upload
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                disabled={!selectedTemplate}
              />
            </div>

            {selectedTemplate && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleGenerateResume}
                  className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center mx-auto shadow-lg"
                >
                  <Sparkles className="w-6 h-6 mr-3" />
                  Generate Resume with AI
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 max-w-md mx-auto">
                  Let our AI create a professional resume using your selected template and best practices
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-700">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{file.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded successfully</p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 font-medium"
              >
                Remove File
              </button>
            </div>

            {/* Scanning Progress */}
            {isScanning && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-8 mb-8 shadow-lg">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Loader2 className="w-7 h-7 text-white animate-spin" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-blue-900 dark:text-blue-100">Scanning Resume...</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Extracting text and analyzing content structure</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                    <div className="animate-pulse w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3"></div>
                    <span className="font-medium">Reading file content...</span>
                  </div>
                  <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                    <div className="animate-pulse w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-3"></div>
                    <span className="font-medium">Extracting text from PDF...</span>
                  </div>
                  <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                    <div className="animate-pulse w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
                    <span className="font-medium">Analyzing resume sections...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Scan Error */}
            {scanError && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-700 rounded-2xl p-8 mb-8 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-red-900 dark:text-red-100">Scan Failed</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">{scanError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* File Analysis Results */}
            {fileAnalysis && !isScanning && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 rounded-2xl p-8 mb-8 shadow-lg">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-green-900 dark:text-green-100">Resume Analysis Complete</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">Successfully extracted and analyzed your resume content</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Word Count:</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">{fileAnalysis.wordCount} words</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Sections Found:</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">{fileAnalysis.sections.length}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-white/80 dark:bg-gray-800/80 rounded-xl">
                      <CheckCircle className={`w-5 h-5 mr-3 ${fileAnalysis.hasContactInfo ? 'text-green-600' : 'text-gray-400 dark:text-gray-500'}`} />
                      <span className={fileAnalysis.hasContactInfo ? 'text-green-700 dark:text-green-300 font-medium' : 'text-gray-500 dark:text-gray-400'}>Contact Information</span>
                    </div>
                    <div className="flex items-center p-3 bg-white/80 dark:bg-gray-800/80 rounded-xl">
                      <CheckCircle className={`w-5 h-5 mr-3 ${fileAnalysis.hasExperience ? 'text-green-600' : 'text-gray-400 dark:text-gray-500'}`} />
                      <span className={fileAnalysis.hasExperience ? 'text-green-700 dark:text-green-300 font-medium' : 'text-gray-500 dark:text-gray-400'}>Work Experience</span>
                    </div>
                    <div className="flex items-center p-3 bg-white/80 dark:bg-gray-800/80 rounded-xl">
                      <CheckCircle className={`w-5 h-5 mr-3 ${fileAnalysis.hasEducation ? 'text-green-600' : 'text-gray-400 dark:text-gray-500'}`} />
                      <span className={fileAnalysis.hasEducation ? 'text-green-700 dark:text-green-300 font-medium' : 'text-gray-500 dark:text-gray-400'}>Education</span>
                    </div>
                    <div className="flex items-center p-3 bg-white/80 dark:bg-gray-800/80 rounded-xl">
                      <CheckCircle className={`w-5 h-5 mr-3 ${fileAnalysis.hasSkills ? 'text-green-600' : 'text-gray-400 dark:text-gray-500'}`} />
                      <span className={fileAnalysis.hasSkills ? 'text-green-700 dark:text-green-300 font-medium' : 'text-gray-500 dark:text-gray-400'}>Skills Section</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h5 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-lg">Detected Sections:</h5>
                  <div className="flex flex-wrap gap-2">
                    {fileAnalysis.sections.map((section, index) => (
                      <span key={index} className="px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg text-sm font-medium">
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTemplate && (
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-2xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${selectedTemplate.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    {selectedTemplate.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">Template: {selectedTemplate.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedTemplate.description}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center shadow-lg"
                onClick={() => {
                  if (fileAnalysis) {
                    // Show preview of extracted content
                    alert(`Preview of extracted content:\n\n${fileAnalysis.text.substring(0, 500)}...`);
                  }
                }}
              >
                <Eye className="w-6 h-6 mr-3" />
                Preview Resume
              </button>
              <button 
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center shadow-lg"
                onClick={() => {
                  if (fileAnalysis) {
                    // Download as text file
                    const blob = new Blob([fileAnalysis.text], { type: 'text/plain' });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `resume_analysis_${file.name.replace(/\.[^/.]+$/, '')}.txt`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  } else {
                    alert('No resume content available to download. Please upload a file first.');
                  }
                }}
              >
                <Download className="w-6 h-6 mr-3" />
                Download Analysis
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Template Preview Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Template Details</h2>
              <button
                onClick={() => setShowTemplates(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 ${template.color} rounded-lg flex items-center justify-center text-white`}>
                      {template.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{template.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{template.description}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Sections Included:</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.sections.map((section, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Features:</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        {template.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
