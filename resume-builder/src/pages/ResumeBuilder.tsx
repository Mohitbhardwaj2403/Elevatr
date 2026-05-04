import React, { useState, useRef } from 'react';
import { ArrowLeft, Sparkles, Download, Eye, FileText, X, CheckCircle, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResumeUpload from '../component/ResumeUpload';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

const ResumeBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'template' | 'upload' | 'generate' | 'preview'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null);
  const [, setUploadedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleTemplateSelect = (template: ResumeTemplate) => {
    setSelectedTemplate(template);
    setCurrentStep('upload');
  };

  const handleFileUpload = (file: File, template?: ResumeTemplate) => {
    setUploadedFile(file);
    if (template) {
      setSelectedTemplate(template);
    }
    setCurrentStep('generate');
  };

  const handleGenerateResume = async () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate a sample resume content based on the selected template
    const sampleResume = generateSampleResume(selectedTemplate);
    setGeneratedResume(sampleResume);
    setCurrentStep('preview');
    setIsGenerating(false);
  };

  const generateSampleResume = (template: ResumeTemplate): string => {
    const templates = {
      professional: `
        <div style="font-family: 'Arial', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: white; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #1f2937; font-size: 32px; margin: 0; font-weight: bold;">JOHN DOE</h1>
            <h2 style="color: #2563eb; font-size: 18px; margin: 5px 0; font-weight: normal;">Senior Software Engineer</h2>
            <div style="color: #6b7280; font-size: 14px; margin-top: 10px;">
              📧 john.doe@email.com | 📱 (555) 123-4567 | 🔗 linkedin.com/in/johndoe | 📍 San Francisco, CA
            </div>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px;">PROFESSIONAL SUMMARY</h3>
            <p style="color: #374151; line-height: 1.6; margin: 0;">
              Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions and leading cross-functional teams in agile environments.
            </p>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px;">TECHNICAL SKILLS</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
              <div><strong>Languages:</strong> JavaScript, Python, Java, TypeScript</div>
              <div><strong>Frameworks:</strong> React, Node.js, Express, Next.js</div>
              <div><strong>Databases:</strong> MongoDB, PostgreSQL, MySQL</div>
              <div><strong>Cloud:</strong> AWS, Docker, Kubernetes</div>
            </div>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px;">PROFESSIONAL EXPERIENCE</h3>
            
            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h4 style="color: #1f2937; font-size: 16px; margin: 0; font-weight: bold;">Senior Software Engineer</h4>
                <span style="color: #6b7280; font-size: 14px;">2022 - Present</span>
              </div>
              <div style="color: #2563eb; font-weight: 500; margin-bottom: 8px;">TechCorp Inc., San Francisco, CA</div>
              <ul style="color: #374151; margin: 0; padding-left: 20px;">
                <li>Led development of microservices architecture serving 100K+ users</li>
                <li>Improved application performance by 40% through code optimization</li>
                <li>Mentored 3 junior developers and conducted code reviews</li>
              </ul>
            </div>

            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h4 style="color: #1f2937; font-size: 16px; margin: 0; font-weight: bold;">Software Engineer</h4>
                <span style="color: #6b7280; font-size: 14px;">2020 - 2022</span>
              </div>
              <div style="color: #2563eb; font-weight: 500; margin-bottom: 8px;">StartupXYZ, San Francisco, CA</div>
              <ul style="color: #374151; margin: 0; padding-left: 20px;">
                <li>Developed RESTful APIs using Node.js and Express</li>
                <li>Designed and implemented database schemas for user management</li>
                <li>Collaborated with cross-functional teams in agile environment</li>
              </ul>
            </div>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px;">EDUCATION</h3>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h4 style="color: #1f2937; font-size: 16px; margin: 0; font-weight: bold;">Bachelor of Science in Computer Science</h4>
                <div style="color: #2563eb; font-weight: 500;">University of Technology</div>
              </div>
              <div style="text-align: right;">
                <div style="color: #6b7280; font-size: 14px;">2020 - 2024</div>
                <div style="color: #6b7280; font-size: 14px;">GPA: 3.8/4.0</div>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px;">CERTIFICATIONS</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
              <div>• AWS Certified Developer Associate</div>
              <div>• Google Cloud Professional Developer</div>
              <div>• Microsoft Azure Fundamentals</div>
              <div>• Certified Scrum Master (CSM)</div>
            </div>
          </div>
        </div>
      `,
      creative: `
        <div style="font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
          <div style="background: white; color: #1f2937; padding: 30px; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 120px; height: 120px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 48px; color: white; font-weight: bold;">JD</div>
              <h1 style="color: #1f2937; font-size: 36px; margin: 0; font-weight: bold;">JOHN DOE</h1>
              <h2 style="color: #667eea; font-size: 20px; margin: 10px 0; font-weight: normal;">✨ Creative Software Engineer ✨</h2>
              <div style="color: #6b7280; font-size: 14px; margin-top: 15px;">
                📧 john.doe@email.com | 📱 (555) 123-4567 | 🔗 linkedin.com/in/johndoe
              </div>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h3 style="color: #667eea; font-size: 20px; border-left: 4px solid #667eea; padding-left: 15px; margin-bottom: 15px;">🎯 PROFILE SUMMARY</h3>
              <p style="color: #374151; line-height: 1.8; margin: 0; font-style: italic;">
                "Passionate software engineer with a creative approach to problem-solving. I transform complex ideas into elegant, user-friendly applications that make a real impact."
              </p>
            </div>

            <div style="margin-bottom: 25px;">
              <h3 style="color: #667eea; font-size: 20px; border-left: 4px solid #667eea; padding-left: 15px; margin-bottom: 15px;">🛠️ TECHNICAL SKILLS</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 3px solid #667eea;">
                  <strong style="color: #667eea;">Frontend Magic</strong><br>
                  <span style="color: #6b7280; font-size: 14px;">React, Vue.js, TypeScript, CSS3</span>
                </div>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 3px solid #764ba2;">
                  <strong style="color: #764ba2;">Backend Power</strong><br>
                  <span style="color: #6b7280; font-size: 14px;">Node.js, Python, Express, FastAPI</span>
                </div>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 3px solid #667eea;">
                  <strong style="color: #667eea;">Data & Cloud</strong><br>
                  <span style="color: #6b7280; font-size: 14px;">MongoDB, PostgreSQL, AWS, Docker</span>
                </div>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 3px solid #764ba2;">
                  <strong style="color: #764ba2;">Tools & Design</strong><br>
                  <span style="color: #6b7280; font-size: 14px;">Figma, Git, Jest, Webpack</span>
                </div>
              </div>
            </div>

            <div style="margin-bottom: 25px;">
              <h3 style="color: #667eea; font-size: 20px; border-left: 4px solid #667eea; padding-left: 15px; margin-bottom: 15px;">💼 WORK EXPERIENCE</h3>
              
              <div style="margin-bottom: 20px; background: #f8fafc; padding: 20px; border-radius: 10px; border-left: 4px solid #667eea;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <h4 style="color: #1f2937; font-size: 18px; margin: 0; font-weight: bold;">🎨 Senior Frontend Engineer</h4>
                  <span style="color: #667eea; font-weight: bold; background: #e0e7ff; padding: 4px 12px; border-radius: 20px; font-size: 12px;">2022 - Present</span>
                </div>
                <div style="color: #667eea; font-weight: 600; margin-bottom: 10px;">CreativeTech Solutions, San Francisco, CA</div>
                <ul style="color: #374151; margin: 0; padding-left: 20px;">
                  <li>🎨 Designed and developed 15+ interactive web applications</li>
                  <li>⚡ Improved user engagement by 60% through creative UI/UX</li>
                  <li>🚀 Led a team of 4 designers and developers</li>
                </ul>
              </div>

              <div style="margin-bottom: 20px; background: #f8fafc; padding: 20px; border-radius: 10px; border-left: 4px solid #764ba2;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <h4 style="color: #1f2937; font-size: 18px; margin: 0; font-weight: bold;">💻 Full-Stack Developer</h4>
                  <span style="color: #764ba2; font-weight: bold; background: #f3e8ff; padding: 4px 12px; border-radius: 20px; font-size: 12px;">2020 - 2022</span>
                </div>
                <div style="color: #764ba2; font-weight: 600; margin-bottom: 10px;">InnovateLab, San Francisco, CA</div>
                <ul style="color: #374151; margin: 0; padding-left: 20px;">
                  <li>🔧 Built scalable APIs serving 50K+ users</li>
                  <li>🎯 Created responsive designs for mobile and desktop</li>
                  <li>🤝 Collaborated with product managers and designers</li>
                </ul>
              </div>
            </div>

            <div style="margin-bottom: 25px;">
              <h3 style="color: #667eea; font-size: 20px; border-left: 4px solid #667eea; padding-left: 15px; margin-bottom: 15px;">🎓 EDUCATION</h3>
              <div style="background: #f8fafc; padding: 20px; border-radius: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <h4 style="color: #1f2937; font-size: 18px; margin: 0; font-weight: bold;">Bachelor of Science in Computer Science</h4>
                    <div style="color: #667eea; font-weight: 600;">🎓 University of Creative Technology</div>
                  </div>
                  <div style="text-align: right;">
                    <div style="color: #6b7280; font-size: 14px;">2020 - 2024</div>
                    <div style="color: #6b7280; font-size: 14px;">GPA: 3.9/4.0</div>
                  </div>
                </div>
              </div>
            </div>

            <div style="margin-bottom: 25px;">
              <h3 style="color: #667eea; font-size: 20px; border-left: 4px solid #667eea; padding-left: 15px; margin-bottom: 15px;">🏆 ACHIEVEMENTS & AWARDS</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; margin-bottom: 8px;">🥇</div>
                  <div style="font-weight: bold; color: #1f2937;">Best UI Design</div>
                  <div style="color: #6b7280; font-size: 12px;">Tech Innovation Awards 2023</div>
                </div>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; margin-bottom: 8px;">🚀</div>
                  <div style="font-weight: bold; color: #1f2937;">Innovation Award</div>
                  <div style="color: #6b7280; font-size: 12px;">Startup Competition 2022</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      minimal: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 40px; background: white; color: #2c3e50; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 40px; border-bottom: 1px solid #ecf0f1; padding-bottom: 30px;">
            <h1 style="font-size: 28px; font-weight: 300; margin: 0; color: #2c3e50; letter-spacing: 2px;">JOHN DOE</h1>
            <div style="font-size: 16px; color: #7f8c8d; margin: 10px 0; font-weight: 300;">Software Engineer</div>
            <div style="font-size: 14px; color: #95a5a6; margin-top: 15px;">
              john.doe@email.com • (555) 123-4567 • San Francisco, CA
            </div>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 16px; font-weight: 600; color: #34495e; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Objective</h2>
            <p style="margin: 0; color: #7f8c8d; font-size: 15px;">
              Seeking a challenging software engineering position where I can leverage my technical skills and passion for clean, efficient code to contribute to innovative projects.
            </p>
          </div>

          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 16px; font-weight: 600; color: #34495e; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Education</h2>
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <strong style="color: #2c3e50;">Bachelor of Science in Computer Science</strong>
                <span style="color: #7f8c8d; font-size: 14px;">2020 - 2024</span>
              </div>
              <div style="color: #7f8c8d; font-size: 14px;">University of Technology • GPA: 3.8/4.0</div>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 16px; font-weight: 600; color: #34495e; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Skills</h2>
            <div style="color: #7f8c8d; font-size: 15px;">
              JavaScript • Python • React • Node.js • MongoDB • PostgreSQL • AWS • Docker • Git
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 16px; font-weight: 600; color: #34495e; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Experience</h2>
            
            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <strong style="color: #2c3e50;">Senior Software Engineer</strong>
                <span style="color: #7f8c8d; font-size: 14px;">2022 - Present</span>
              </div>
              <div style="color: #7f8c8d; font-size: 14px; margin-bottom: 8px;">TechCorp Inc.</div>
              <ul style="margin: 0; padding-left: 20px; color: #7f8c8d; font-size: 14px;">
                <li>Led development of microservices architecture</li>
                <li>Improved application performance by 40%</li>
                <li>Mentored junior developers</li>
              </ul>
            </div>

            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <strong style="color: #2c3e50;">Software Engineer</strong>
                <span style="color: #7f8c8d; font-size: 14px;">2020 - 2022</span>
              </div>
              <div style="color: #7f8c8d; font-size: 14px; margin-bottom: 8px;">StartupXYZ</div>
              <ul style="margin: 0; padding-left: 20px; color: #7f8c8d; font-size: 14px;">
                <li>Developed RESTful APIs using Node.js</li>
                <li>Designed database schemas</li>
                <li>Collaborated in agile environment</li>
              </ul>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 16px; font-weight: 600; color: #34495e; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Projects</h2>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #2c3e50;">E-Commerce Platform</strong>
              <div style="color: #7f8c8d; font-size: 14px; margin-top: 3px;">
                Full-stack application built with React and Node.js. Features include user authentication, payment processing, and real-time inventory management.
              </div>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #2c3e50;">Task Management App</strong>
              <div style="color: #7f8c8d; font-size: 14px; margin-top: 3px;">
                Collaborative tool with real-time updates, built using WebSocket technology and deployed on AWS.
              </div>
            </div>
          </div>
        </div>
      `,
      student: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f8f9fa; color: #212529;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 25px; border-radius: 10px;">
              <h1 style="font-size: 32px; margin: 0; font-weight: bold;">JOHN DOE</h1>
              <h2 style="font-size: 18px; margin: 10px 0; font-weight: normal; opacity: 0.9;">Computer Science Student</h2>
              <div style="font-size: 14px; margin-top: 15px; opacity: 0.8;">
                📧 john.doe@email.com | 📱 (555) 123-4567 | 🎓 University of Technology
              </div>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h3 style="color: #495057; font-size: 18px; border-bottom: 2px solid #dee2e6; padding-bottom: 8px; margin-bottom: 15px;">🎯 CAREER OBJECTIVE</h3>
              <p style="color: #6c757d; line-height: 1.6; margin: 0; font-size: 15px;">
                Recent Computer Science graduate with strong foundation in software development and eagerness to contribute to innovative projects. Seeking an entry-level position to apply my technical skills and passion for learning in a dynamic work environment.
              </p>
            </div>

            <div style="margin-bottom: 25px;">
              <h3 style="color: #495057; font-size: 18px; border-bottom: 2px solid #dee2e6; padding-bottom: 8px; margin-bottom: 15px;">🎓 EDUCATION</h3>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <h4 style="color: #212529; font-size: 16px; margin: 0; font-weight: bold;">Bachelor of Science in Computer Science</h4>
                  <span style="color: #6c757d; font-size: 14px; background: #e9ecef; padding: 4px 8px; border-radius: 4px;">2020 - 2024</span>
                </div>
                <div style="color: #667eea; font-weight: 600; margin-bottom: 5px;">University of Technology</div>
                <div style="color: #6c757d; font-size: 14px;">GPA: 3.8/4.0 | Relevant Coursework: Data Structures, Algorithms, Database Systems, Software Engineering</div>
              </div>
            </div>

            <div style="margin-bottom: 25px;">
              <h3 style="color: #495057; font-size: 18px; border-bottom: 2px solid #dee2e6; padding-bottom: 8px; margin-bottom: 15px;">💻 TECHNICAL SKILLS</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                  <strong style="color: #495057;">Programming Languages</strong><br>
                  <span style="color: #6c757d; font-size: 14px;">JavaScript, Python, Java, C++, HTML/CSS</span>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                  <strong style="color: #495057;">Frameworks & Tools</strong><br>
                  <span style="color: #6c757d; font-size: 14px;">React, Node.js, Git, VS Code, MySQL</span>
                </div>
              </div>
            </div>

            <div style="margin-bottom: 25px;">
              <h3 style="color: #495057; font-size: 18px; border-bottom: 2px solid #dee2e6; padding-bottom: 8px; margin-bottom: 15px;">📚 ACADEMIC PROJECTS</h3>
              
              <div style="margin-bottom: 20px; background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <h4 style="color: #212529; font-size: 16px; margin: 0; font-weight: bold;">🛒 E-Commerce Platform</h4>
                  <span style="color: #28a745; font-weight: bold; background: #d4edda; padding: 4px 8px; border-radius: 4px; font-size: 12px;">2023</span>
                </div>
                <div style="color: #6c757d; font-size: 14px; margin-bottom: 8px;">Full-stack web application</div>
                <ul style="color: #6c757d; margin: 0; padding-left: 20px; font-size: 14px;">
                  <li>Developed using React for frontend and Node.js for backend</li>
                  <li>Implemented user authentication and payment processing</li>
                  <li>Used MongoDB for data storage and JWT for security</li>
                </ul>
              </div>

              <div style="margin-bottom: 20px; background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <h4 style="color: #212529; font-size: 16px; margin: 0; font-weight: bold;">📋 Task Management App</h4>
                  <span style="color: #17a2b8; font-weight: bold; background: #d1ecf1; padding: 4px 8px; border-radius: 4px; font-size: 12px;">2023</span>
                </div>
                <div style="color: #6c757d; font-size: 14px; margin-bottom: 8px;">Collaborative web application</div>
                <ul style="color: #6c757d; margin: 0; padding-left: 20px; font-size: 14px;">
                  <li>Built with real-time updates using WebSocket technology</li>
                  <li>Integrated team collaboration features</li>
                  <li>Deployed on AWS with CI/CD pipeline</li>
                </ul>
              </div>
            </div>

            <div style="margin-bottom: 25px;">
              <h3 style="color: #495057; font-size: 18px; border-bottom: 2px solid #dee2e6; padding-bottom: 8px; margin-bottom: 15px;">💼 INTERNSHIPS</h3>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <h4 style="color: #212529; font-size: 16px; margin: 0; font-weight: bold;">Software Development Intern</h4>
                  <span style="color: #ffc107; font-weight: bold; background: #fff3cd; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Summer 2023</span>
                </div>
                <div style="color: #ffc107; font-weight: 600; margin-bottom: 8px;">TechStart Inc., San Francisco, CA</div>
                <ul style="color: #6c757d; margin: 0; padding-left: 20px; font-size: 14px;">
                  <li>Worked on frontend development using React and TypeScript</li>
                  <li>Participated in daily standups and code reviews</li>
                  <li>Assisted in debugging and testing new features</li>
                </ul>
              </div>
            </div>

            <div style="margin-bottom: 25px;">
              <h3 style="color: #495057; font-size: 18px; border-bottom: 2px solid #dee2e6; padding-bottom: 8px; margin-bottom: 15px;">🏆 EXTRACURRICULAR ACTIVITIES</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                  <strong style="color: #495057;">🎓 Computer Science Club</strong><br>
                  <span style="color: #6c757d; font-size: 14px;">President (2023-2024)</span>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                  <strong style="color: #495057;">🏆 Hackathons</strong><br>
                  <span style="color: #6c757d; font-size: 14px;">3 participated, 1st place winner</span>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                  <strong style="color: #495057;">🤝 Volunteering</strong><br>
                  <span style="color: #6c757d; font-size: 14px;">Coding bootcamp mentor</span>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                  <strong style="color: #495057;">📜 Certifications</strong><br>
                  <span style="color: #6c757d; font-size: 14px;">AWS Cloud Practitioner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    };
    
    return templates[template.id as keyof typeof templates] || templates.professional;
  };

  const handleDownloadResume = async () => {
    if (!generatedResume) {
      alert('No resume content available to download. Please generate a resume first.');
      return;
    }
    
    setIsDownloading(true);
    
    try {
      // Try PDF generation first
      await generatePDF();
    } catch (error) {
      console.error('PDF generation failed, falling back to text download:', error);
      // Fallback to text download
      downloadAsText();
    } finally {
      setIsDownloading(false);
    }
  };

  const generatePDF = async () => {
    // Create a temporary div to render the resume for PDF generation
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = generatedResume || '';
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '800px';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '20px';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.lineHeight = '1.6';
    tempDiv.style.color = '#333';
    
    // Add to DOM temporarily
    document.body.appendChild(tempDiv);
    
    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Convert HTML to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: tempDiv.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 800,
      windowHeight: tempDiv.scrollHeight
    });
    
    // Remove temporary div
    document.body.removeChild(tempDiv);
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Download the PDF
    const fileName = `resume_${selectedTemplate?.name.toLowerCase().replace(/\s+/g, '_') || 'professional'}.pdf`;
    pdf.save(fileName);
    
    console.log('PDF generated and downloaded successfully');
  };

  const downloadAsText = () => {
    // Extract text content from HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = generatedResume || '';
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Create and download text file
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume_${selectedTemplate?.name.toLowerCase().replace(/\s+/g, '_') || 'professional'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('Text file downloaded successfully');
  };

  const handlePreviewResume = () => {
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
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
                  AI Resume Builder
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
                <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Step {currentStep === 'template' ? 1 : currentStep === 'upload' ? 2 : currentStep === 'generate' ? 3 : 4} of 4
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
                  { step: 'template', label: 'Choose Template', completed: currentStep !== 'template' },
                  { step: 'upload', label: 'Upload Resume', completed: currentStep === 'generate' || currentStep === 'preview' },
                  { step: 'generate', label: 'Generate', completed: currentStep === 'preview' },
                  { step: 'preview', label: 'Preview & Download', completed: false }
                ].map((item, index) => (
                  <div key={item.step} className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-all duration-300 ${
                      item.completed 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white scale-110' 
                        : currentStep === item.step 
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
                      item.completed || currentStep === item.step ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {item.label}
                    </span>
                    {index < 3 && (
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
        {currentStep === 'template' && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl mb-6">
              <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-gray-100 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-6">
              Choose Your Resume Template
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Select from our AI-powered templates designed for different career stages and industries. 
              Each template is optimized for ATS systems and modern hiring practices.
            </p>
          </div>
        )}

        {currentStep === 'upload' && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-6">
              <Upload className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent mb-6">
              Upload Your Resume
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Upload your existing resume to get AI-powered improvements and template matching. 
              Our system will analyze your content and suggest optimizations.
            </p>
          </div>
        )}

        {currentStep === 'generate' && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl mb-6">
              <Sparkles className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-violet-800 bg-clip-text text-transparent mb-6">
              Generate Your Resume
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Let our AI create a professional resume using your selected template and uploaded content. 
              The process takes just a few moments and ensures ATS compatibility.
            </p>
          </div>
        )}

        {currentStep === 'preview' && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl mb-6">
              <Eye className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-green-800 bg-clip-text text-transparent mb-6">
              Your Resume is Ready!
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Preview, download, or make further adjustments to your AI-generated resume. 
              Your professional resume is now ready to impress employers.
            </p>
          </div>
        )}

        {/* Resume Upload Component */}
        <ResumeUpload
          onFileUpload={handleFileUpload}
          onTemplateSelect={handleTemplateSelect}
        />

        {/* Generate Button */}
        {currentStep === 'generate' && selectedTemplate && (
          <div className="mt-12 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 max-w-2xl mx-auto">
              <button
                onClick={handleGenerateResume}
                disabled={isGenerating}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center mx-auto shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Generating Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mr-3" />
                    Generate Resume with AI
                  </>
                )}
              </button>
              {isGenerating && (
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <div className="animate-pulse w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3"></div>
                    <span className="font-medium">Analyzing your content...</span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <div className="animate-pulse w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-3"></div>
                    <span className="font-medium">Applying template design...</span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <div className="animate-pulse w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
                    <span className="font-medium">Optimizing for ATS...</span>
                  </div>
                </div>
              )}
              {!isGenerating && (
                <p className="text-sm text-gray-500 mt-4">
                  Our AI will create a professional resume tailored to your industry
                </p>
              )}
            </div>
          </div>
        )}

        {/* Preview and Download Actions */}
        {currentStep === 'preview' && (
          <div className="mt-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl mb-6">
                  <FileText className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Resume Generated Successfully!</h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Your professional resume has been created using the <span className="font-semibold text-blue-600">{selectedTemplate?.name}</span> template. 
                  It's optimized for ATS systems and ready to impress employers.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
                <button
                  onClick={handlePreviewResume}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center shadow-lg"
                >
                  <Eye className="w-6 h-6 mr-3" />
                  Preview Resume
                </button>
                <button
                  onClick={handleDownloadResume}
                  disabled={isDownloading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center shadow-lg"
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6 mr-3" />
                      Download PDF
                    </>
                  )}
                </button>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setCurrentStep('template')}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors"
                >
                  Create Another Resume
                </button>
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

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between p-8 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Resume Preview</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Template: {selectedTemplate?.name}</p>
                </div>
              </div>
              <button
                onClick={closePreview}
                className="p-3 hover:bg-white/80 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 group"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[calc(95vh-140px)] bg-gray-50 dark:bg-gray-900">
              <div 
                ref={resumeRef}
                className="resume-preview bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mx-auto max-w-4xl"
                dangerouslySetInnerHTML={{ __html: generatedResume || '' }}
                style={{
                  fontFamily: 'inherit',
                  lineHeight: '1.6',
                  color: '#374151'
                }}
              />
            </div>
            <div className="flex items-center justify-between p-8 border-t border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-800">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <div className="font-semibold">Ready to Download</div>
                  <div>High-quality PDF format</div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={closePreview}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-semibold"
                >
                  Close Preview
                </button>
                <button
                  onClick={handleDownloadResume}
                  disabled={isDownloading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-200 flex items-center font-semibold shadow-lg"
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download PDF
                    </>
                  )}
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
