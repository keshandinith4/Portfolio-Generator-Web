import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Get an username using URL
import { 
  Github, Linkedin, Mail, ExternalLink, 
  Code, Briefcase 
} from 'lucide-react';

export default function Portfolio() {
  const { username } = useParams(); 
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // Call to Backend API 
        const response = await axios.get(`http://localhost:5000/api/portfolio/${username}`);
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        setError(true);
        setLoading(false);
      }
    };

    if (username) fetchPortfolio();
  }, [username]);

  // Loading Screen
  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Loading Portfolio...</div>;

  // Error Screen
  if (error || !profile) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">Portfolio Not Found!</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100">
      
      {/* HERO SECTION */}
      <header className="py-24 px-6 max-w-5xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold tracking-wide uppercase">
            Available for Projects
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900">
            I'm <span className="text-indigo-600">{profile.fullName}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-medium">
            {profile.title || "Full Stack Developer"}
          </p>
          <p className="text-gray-500 max-w-2xl leading-relaxed text-lg">
            {profile.bio}
          </p>
          
          <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
            <a href={`mailto:${profile.contact?.email}`} className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-xl active:scale-95">
              Hire Me <Mail size={18}/>
            </a>
            <div className="flex items-center gap-3 ml-4">
              <a href={profile.contact?.github} target="_blank" rel="noreferrer" className="p-3 bg-gray-100 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"><Github size={22}/></a>
              <a href={profile.contact?.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-gray-100 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"><Linkedin size={22}/></a>
            </div>
          </div>
        </div>
      </header>

      {/* SKILLS SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-10">
             <div className="h-px w-12 bg-indigo-600"></div>
             <h2 className="text-2xl font-black uppercase tracking-widest">My Expertise</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {profile.skills?.map((skill, index) => (
              <span key={index} className="px-6 py-3 bg-white border border-gray-200 rounded-2xl text-gray-700 font-bold shadow-sm hover:border-indigo-300 hover:shadow-md transition-all">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-black tracking-tight">Featured Projects</h2>
          <Briefcase className="text-indigo-600" size={32} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profile.projects?.map((project, index) => (
            <div key={index} className="group p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-opacity">
                <ExternalLink size={24} />
              </div>
              <Code className="mb-6 text-indigo-600" size={32} />
              <h3 className="text-2xl font-bold mb-3 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                {project.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-indigo-500 bg-indigo-50 w-fit px-4 py-1.5 rounded-full">
                {project.techStack}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 border-t border-gray-100 text-center">
        <p className="text-gray-400 font-medium">
          &copy; {new Date().getFullYear()} {profile.fullName}. Built with React & Tailwind.
        </p>
      </footer>

    </div>
  );
}