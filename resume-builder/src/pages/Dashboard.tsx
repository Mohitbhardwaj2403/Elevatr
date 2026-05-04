import React, { useState } from 'react';
import { BarChart3, FileText, MessageCircle, Target, Download, TrendingUp, Award, Bot } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { useChatbot } from "../context/ChatbotContext";
import { Link } from 'react-router-dom';

interface RecentActivity {
    id: string;
    type: 'resume' | 'interview' | 'job';
    title: string;
    date: string;
    score ? : number;
    status: 'completed' | 'in-progress' | 'scheduled';
}

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const { toggleChatbot } = useChatbot();
    const [activeTab, setActiveTab] = useState('overview');

    const recentActivities: RecentActivity[] = [{
            id: '1',
            type: 'resume',
            title: 'Resume Analysis - Software Engineer',
            date: '2025-01-20',
            score: 87,
            status: 'completed'
        },
        {
            id: '2',
            type: 'interview',
            title: 'Mock Interview - Frontend Developer',
            date: '2025-01-19',
            score: 82,
            status: 'completed'
        },
        {
            id: '3',
            type: 'job',
            title: 'Job Matching - Data Analyst',
            date: '2025-01-18',
            status: 'completed'
        },
        {
            id: '4',
            type: 'interview',
            title: 'Technical Interview Practice',
            date: '2025-01-21',
            status: 'scheduled'
        }
    ];

    const stats = {
        resumeScans: 5,
        interviews: 3,
        jobMatches: 12,
        avgScore: 84
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'resume':
                return <FileText className = "w-5 h-5 text-blue-600 dark:text-blue-400" / > ;
            case 'interview':
                return <MessageCircle className = "w-5 h-5 text-green-600 dark:text-green-400" / > ;
            case 'job':
                return <Target className = "w-5 h-5 text-purple-600 dark:text-purple-400" / > ;
            default:
                return <BarChart3 className = "w-5 h-5 text-gray-600 dark:text-gray-400" / > ;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
            case 'in-progress':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
            case 'scheduled':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
        }
    };

    if (!user) {
        return ( 
            <div className = "min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center" >
            <div className = "text-center" >
            <h2 className = "text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4" > Please Login </h2>
            <p className = "text-gray-600 dark:text-gray-300 mb-6" > You need to be logged in to access your dashboard. </p> 
            <Link to = "/login"
            className = "bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors" >
            Login Now 
            </Link>
            </div>
            </div>
        );
    }

    return ( < div className = "min-h-screen bg-gray-50 dark:bg-gray-900 py-8" >
        <div className = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" > { /* Header */ }
        <div className = "mb-8" >
        <h1 className = "text-3xl font-bold text-gray-900 dark:text-gray-100" > Welcome back, { user.name }! </h1>
        <p className = "text-gray-600 dark:text-gray-300 mt-1" > Track your progress and
        continue your job preparation journey </p>
        </div>

        { /* Stats Overview */ }
        <div className = "grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8" >
        <div className = "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm" >
        <div className = "flex items-center justify-between" >
        <div >
        <p className = "text-sm font-medium text-gray-600 dark:text-gray-300" > Resume Scans </p>
        <p className = "text-2xl font-bold text-gray-900 dark:text-gray-100" > { stats.resumeScans } </p> 
        </div> 
        <div className = "w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center" >
        <FileText className = "w-6 h-6 text-blue-600 dark:text-blue-400" / >
        </div> 
        </div> 
        </div>

        <div className = "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm" >
        <div className = "flex items-center justify-between" >
        <div >
        <p className = "text-sm font-medium text-gray-600 dark:text-gray-300" > Mock Interviews </p> 
        <p className = "text-2xl font-bold text-gray-900 dark:text-gray-100" > { stats.interviews } </p> 
        </div> 
        <div className = "w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center" >
        <MessageCircle className = "w-6 h-6 text-green-600 dark:text-green-400" / >
        </div> </div> </div>

        <div className = "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm" >
        <div className = "flex items-center justify-between" >
        <div >
        <p className = "text-sm font-medium text-gray-600 dark:text-gray-300" > Job Matches </p> 
        <p className = "text-2xl font-bold text-gray-900 dark:text-gray-100" > { stats.jobMatches } </p>
        </div> 
        <div className = "w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center" >
        <Target className = "w-6 h-6 text-purple-600 dark:text-purple-400" / >
        </div> </div> </div>

        <div className = "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm" >
        <div className = "flex items-center justify-between" >
        <div >
        <p className = "text-sm font-medium text-gray-600 dark:text-gray-300" > Avg Score </p> 
        <p className = "text-2xl font-bold text-gray-900 dark:text-gray-100" > { stats.avgScore } % </p> 
        </div> 
        <div className = "w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center" >
        <Award className = "w-6 h-6 text-yellow-600 dark:text-yellow-400" / >
        </div> </div> </div> </div>

        { /* Tab Navigation */ } 
        <div className = "border-b border-gray-200 mb-6" >
        <nav className = "flex space-x-8" > {
            [
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'resume', name: 'Resume History', icon: FileText },
                { id: 'interviews', name: 'Interview History', icon: MessageCircle },
                { id: 'jobs', name: 'Job Applications', icon: Target }
            ].map((tab) => ( <
                button key = { tab.id }
                onClick = {
                    () => setActiveTab(tab.id) }
                className = { `py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${ activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }` } >
                <tab.icon className = "w-4 h-4" / >
                <span > { tab.name } </span>
                </button>
            ))
        }
        </nav>
        </div>

        <div className = "grid lg:grid-cols-3 gap-8" > { /* Main Content */ }
        <div className = "lg:col-span-2" > {
            activeTab === 'overview' && (
                <div className = "space-y-6" > { /* Performance Chart */ }
                <div className = "bg-white rounded-xl p-6 shadow-sm" >
                <h3 className = "text-lg font-semibold text-gray-900 mb-6" > Performance Trend </h3>
                <div className = "h-64 bg-gray-50 rounded-lg flex items-center justify-center" >
                <div className = "text-center" >
                <TrendingUp className = "w-12 h-12 text-gray-400 mx-auto mb-4" / >
                <p className = "text-gray-600" > Performance chart visualization </p>
                <p className = "text-sm text-gray-500 mt-1" > Shows your improvement over time </p>
                </div> </div> </div>

                { /* Recent Activity */ }
                <div className = "bg-white rounded-xl p-6 shadow-sm" >
                <h3 className = "text-lg font-semibold text-gray-900 mb-6" > Recent Activity </h3>
                <div className = "space-y-4" > {
                    recentActivities.slice(0, 4).map((activity) => (
                        <div key = { activity.id }
                        className = "flex items-center justify-between p-4 bg-gray-50 rounded-lg" >
                        <div className = "flex items-center space-x-3" > { getActivityIcon(activity.type) }
                        <div >
                        <p className = "font-medium text-gray-900" > { activity.title } </p>
                        <p className = "text-sm text-gray-600" > { activity.date } </p>
                        </div> </div> <div className = "flex items-center space-x-2" > {
                            activity.score && ( <
                                span className = "text-sm font-semibold text-green-600" > { activity.score } % </span>
                            )
                        } 
                        <span className = { `px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}` } > { activity.status } 
                        </span> 
                        </div> 
                        </div>
                    ))
                }
                </div>
                </div>
                </div>
            )
        }

        {
            activeTab === 'resume' && (
                <div className = "bg-white rounded-xl p-6 shadow-sm" >
                <div className = "flex items-center justify-between mb-6" >
                <h3 className = "text-lg font-semibold text-gray-900" > Resume Analysis History </h3>
                <Link to = "/resume-analysis"
                className = "bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors" >
                New Analysis 
                </Link>
                </div>
                <div className = "space-y-4" > {
                    recentActivities
                    .filter(a => a.type === 'resume')
                    .map((activity) => ( 
                        <div key = { activity.id }
                        className = "border border-gray-200 rounded-lg p-4" >
                        <div className = "flex items-center justify-between mb-2" >
                        <h4 className = "font-medium text-gray-900" > { activity.title } </h4> 
                        <span className = "text-2xl font-bold text-green-600" > { activity.score } % </span> 
                        </div>
                        <p className = "text-sm text-gray-600 mb-3" > { activity.date } </p>
                        <div className = "flex space-x-2" >
                        <button className = "bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors" >
                        View Details 
                        </button>
                        <button className = "bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors flex items-center" >
                        <Download className = "w-3 h-3 mr-1" / >
                        Download Report
                        </button>
                        </div>
                        </div>
                    ))
                }
                </div>
                </div>
            )
        }

        {
            activeTab === 'interviews' && (
                <div className = "bg-white rounded-xl p-6 shadow-sm" >
                <div className = "flex items-center justify-between mb-6" >
                <h3 className = "text-lg font-semibold text-gray-900" > Interview History </h3> 
                <Link to = "/mock-interview"
                className = "bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors" >
                Start Interview
                </Link>
                </div>
                <div className = "space-y-4" > {
                    recentActivities
                    .filter(a => a.type === 'interview')
                    .map((activity) => (
                        <div key = { activity.id }
                        className = "border border-gray-200 rounded-lg p-4" >
                        <div className = "flex items-center justify-between mb-2" >
                        <h4 className = "font-medium text-gray-900" > { activity.title } </h4> {
                            activity.score && ( 
                                <span className = "text-2xl font-bold text-green-600" > { activity.score } % </span>
                            )
                        }
                        </div>
                        <p className = "text-sm text-gray-600 mb-3" > { activity.date } </p>
                        <div className = "flex space-x-2" >
                        <button className = "bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors" >
                        View Feedback 
                        </button> {
                            activity.status === 'completed' && (
                                <button className = "bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors" >
                                Retry Interview 
                                </button>
                            )
                        } 
                        </div> 
                        </div>
                    ))
                } 
                </div> 
                </div>
            )
        }

        {
            activeTab === 'jobs' && (
                <div className = "bg-white rounded-xl p-6 shadow-sm" >
                <div className = "flex items-center justify-between mb-6" >
                <h3 className = "text-lg font-semibold text-gray-900" > Job Applications </h3> 
                <Link to = "/job-matching"
                className = "bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors" >
                Find Jobs 
                </Link>
                </div>
                <div className = "text-center py-12" >
                <Target className = "w-12 h-12 text-gray-400 mx-auto mb-4" / >
                <p className = "text-gray-600 mb-2" > No job applications yet </p>
                <p className = "text-sm text-gray-500" > Start by finding matching jobs based on your profile </p>
                </div>
                </div>
            )
        }
        </div>

        { /* Sidebar */ } 
        <div className = "space-y-6" > { /* Quick Actions */ }
        <div className = "bg-white rounded-xl p-6 shadow-sm" >
        <h3 className = "text-lg font-semibold text-gray-900 mb-4" > Quick Actions </h3>
        <div className = "space-y-3" >
        <Link to = "/resume-analysis"
        className = "w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center" >
        <FileText className = "w-4 h-4 mr-2" / >
        Scan Resume
        </Link>
        <Link to = "/mock-interview"
        className = "w-full bg-green-600 text-white p-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center" >
        <MessageCircle className = "w-4 h-4 mr-2" / >
        Practice Interview
        </Link>
        <Link to = "/job-matching"
        className = "w-full bg-purple-600 text-white p-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center" >
        <Target className = "w-4 h-4 mr-2" / >
        Find Jobs
        </Link>
        </div>
        </div>

        { /* Account Status */ } 
        <div className = "bg-white rounded-xl p-6 shadow-sm" >
        <h3 className = "text-lg font-semibold text-gray-900 mb-4" > Account Status </h3>
        <div className = "space-y-3" >
        <div className = "flex items-center justify-between" >
        <span className = "text-sm text-gray-600" > Plan </span>
        <span className = "text-sm font-medium text-blue-600 capitalize" > { user.plan } </span>
        </div>
        <div className = "flex items-center justify-between" >
        <span className = "text-sm text-gray-600" > Resume Scans </span>
        <span className = "text-sm font-medium text-gray-900" > { user.plan === 'free' ? '1/1' : 'Unlimited' }
        </span>
        </div>
        <div className = "flex items-center justify-between" >
        <span className = "text-sm text-gray-600" > Mock Interviews </span>
        <span className = "text-sm font-medium text-gray-900" > { user.plan === 'free' ? '0/0' : 'Unlimited' }
        </span>
        </div> {
            user.plan === 'free' && (
                <Link to = "/pricing"
                className = "w-full bg-gradient-to-r from-blue-600 to-green-600 text-white p-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-center block mt-4" >
                Upgrade to Pro 
                </Link>
            )
        } 
        </div>
        </div>

        { /* AI Assistant */ } 
        <div className = "bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6" >
        <div className = "flex items-center mb-4" >
        <div className = "w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-3" >
        <Bot className = "w-6 h-6 text-white" / >
        </div>
        <div >
        <h3 className = "text-lg font-semibold text-gray-900" > AI Assistant</h3>
        <p className = "text-sm text-gray-600" > Get instant career help</p>
        </div>
        </div>
        <p className = "text-sm text-gray-700 mb-4" >
        Ask me anything about resumes, interviews, job searching, or career development. I'm here to help 24/7!
        </p>
        <button 
        onClick = {toggleChatbot}
        className = "w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center" >
        <MessageCircle className = "w-4 h-4 mr-2" / >
        Start Chat
        </button>
        </div>

        { /* Tips & Recommendations */ } 
        <div className = "bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6" >
        <h3 className = "text-lg font-semibold text-gray-900 mb-4" > 💡Today 's Tip</h3>
        <p className = "text-sm text-gray-700 mb-4" >
        Use the STAR method(Situation, Task, Action, Result) when answering behavioral interview questions to structure your responses effectively.
        </p>
        <button className = "text-blue-600 text-sm font-medium hover:text-blue-700" >
        Learn more→
        </button>
        </div>
        </div>
        </div>
        </div>
        </div>
    );
};

export default Dashboard;