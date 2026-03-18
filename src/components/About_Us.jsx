import React from 'react';
import { User, Code, Folder, Briefcase, Link as LinkIcon, Share2 } from 'lucide-react';

export default function About_Us() {
  const FeatureCard = ({ icon: Icon, title, description, iconBg }) => (
    <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2 cursor-default">
      <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="text-gray-700" size={24} />
      </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-500 leading-relaxed">
                {description}
            </p>
    </div>
  );

  const features = [
    {
      icon: User,
      iconBg: "bg-indigo-100",
      title: "Personal Profile",
      description: "Showcase your name, title, bio, and profile image to make a strong first impression on recruiters."
    },
    {
      icon: Code,
      iconBg: "bg-green-100",
      title: "Skills & Tech Stack",
      description: "Display your technical skills, programming languages, frameworks, and tools in a beautiful format."
    },
    {
      icon: Folder,
      iconBg: "bg-purple-100",
      title: "Project Showcase",
      description: "Highlight your best projects with descriptions, tech stack, GitHub links, and live demos."
    },
    {
      icon: Briefcase,
      iconBg: "bg-yellow-100",
      title: "Work Experience",
      description: "Present your professional experience, internships, and volunteer work in a structured timeline."
    },
    {
      icon: LinkIcon,
      iconBg: "bg-pink-100",
      title: "Contact & Social",
      description: "Make it easy for employers to reach you with email, LinkedIn, GitHub, and personal website links."
    },
    {
      icon: Share2,
      iconBg: "bg-cyan-100",
      title: "Unique Shareable URL",
      description: "Get a custom URL to share your portfolio with recruiters, peers, and the world."
    }
  ];

  return (
    <section 
        id="About_Us"
        className="py-20 px-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Everything You Need to <span className="text-indigo-600">Stand Out</span>
          </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Our platform gives you all the tools to create a professional developer portfolio 
                that showcases your skills and gets you hired.
            </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}