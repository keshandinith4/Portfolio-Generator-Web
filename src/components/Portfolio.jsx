import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Github, Linkedin, Mail, ExternalLink, Globe, Briefcase, User, Code, Terminal } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function Portfolio() {
  const { username } = useParams(); 
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/portfolio/${username}`); 
        setProfile(res.data);
        console.log("Fetched Profile:", res);
      } catch (err) { 
        console.error("Fetch Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, [username]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-black animate-pulse uppercase tracking-widest text-indigo-600 bg-white">
      Generating Portfolio...
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center text-red-500 font-black bg-white">
      404 - PORTFOLIO NOT FOUND
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 scroll-smooth">
      {/* Header / Hero */}
      <header className="max-w-6xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-12">
        <div className="w-56 h-56 rounded-[3.5rem] overflow-hidden shadow-2xl rotate-3 border-8 border-white bg-slate-100">
          <img 
            src={profile.profileImage || "https://via.placeholder.com/300"} 
            alt={profile.fullName} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-slate-900">{profile.fullName}</h1>
          <p className="text-2xl md:text-3xl text-indigo-600 font-bold mb-8 uppercase tracking-wide">{profile.title}</p>
          <div className="flex justify-center md:justify-start gap-4">
            {profile.contact?.github && (
              <a href={profile.contact.github} target="_blank" rel="noreferrer" className="p-4 bg-slate-50 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Github size={24}/></a>
            )}
            {profile.contact?.linkedin && (
              <a href={profile.contact.linkedin} target="_blank" rel="noreferrer" className="p-4 bg-slate-50 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Linkedin size={24}/></a>
            )}
            {profile.contact?.email && (
              <a href={`mailto:${profile.contact.email}`} className="p-4 bg-slate-50 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Mail size={24}/></a>
            )}
          </div>
        </div>
      </header>

      {/* About Me */}
      <section className="max-w-4xl mx-auto px-6 py-24 border-t border-slate-100">
        <h2 className="text-4xl font-black mb-10 flex items-center gap-4">
          <User className="text-indigo-600" size={36}/> Biography
        </h2>
        <p className="text-xl text-slate-500 leading-relaxed font-medium">{profile.bio}</p>
      </section>

      {/* Skills */}
      <section className="bg-slate-50 py-28">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.4em] mb-12">My Expertise</h2>
          <div className="flex flex-wrap justify-center gap-5">
            {profile.skills?.map((s, i) => (
              <div key={i} className="px-10 py-5 bg-white rounded-3xl font-black shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
                <Terminal size={18} className="text-indigo-500"/> {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      {profile.experience?.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-28">
          <h2 className="text-4xl font-black mb-16 flex items-center gap-4">
            <Briefcase className="text-indigo-600" size={36}/> Career Path
          </h2>
          <div className="space-y-16">
            {profile.experience.map((exp, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 relative pl-8 border-l-4 border-indigo-100 group">
                <div className="absolute w-5 h-5 bg-white border-4 border-indigo-600 rounded-full -left-[12px] top-0 group-hover:bg-indigo-600 transition-colors"></div>
                <div className="md:col-span-1 text-slate-400 font-black text-sm uppercase">{exp.duration}</div>
                <div className="md:col-span-3">
                  <h4 className="text-2xl font-black text-slate-900 mb-1">{exp.company}</h4>
                  <p className="text-indigo-600 font-black text-lg mb-4">{exp.role}</p>
                  <p className="text-slate-500 font-medium leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {profile.projects?.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-28 border-t border-slate-100">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl font-black flex items-center gap-4">
              <Code className="text-indigo-600" size={36}/> Showcase
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {profile.projects.map((p, i) => (
              <div key={i} className="p-12 bg-slate-50 rounded-[3.5rem] border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 group">
                <h4 className="text-3xl font-black mb-4 group-hover:text-indigo-600 transition-colors">{p.name}</h4>
                <p className="text-slate-500 mb-10 text-lg leading-relaxed font-medium">{p.description}</p>
                <div className="flex flex-wrap gap-2 mb-10">
                  {p.techStack?.split(',').map((t, idx) => (
                    <span key={idx} className="px-4 py-1.5 bg-white rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-slate-100">{t.trim()}</span>
                  ))}
                </div>
                <div className="flex gap-6 pt-8 border-t border-slate-100">
                  {p.githubLink && <a href={p.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-black text-sm hover:text-indigo-600"><Github size={18}/> Code</a>}
                  {p.liveDemo && <a href={p.liveDemo} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-black text-sm hover:text-indigo-600"><ExternalLink size={18}/> Demo</a>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 py-32 text-center text-white">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="text-5xl font-black mb-6 tracking-tighter">Available for Hiring</h3>
          <p className="text-slate-400 mb-12 text-lg font-medium uppercase tracking-wide">{profile.contact?.email}</p>
          <div className="flex justify-center gap-8">
            {profile.contact?.linkedin && <a href={profile.contact.linkedin} target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-all font-bold flex items-center gap-2"><Linkedin size={20}/> LinkedIn</a>}
            {profile.contact?.website && <a href={profile.contact.website} target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-all font-bold flex items-center gap-2"><Globe size={20}/> Website</a>}
          </div>
        </div>
      </footer>
    </div>
  );
}