import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Mail, Plus, Send, Trash2, Globe, 
  Link2, Rocket, Briefcase, Code, Image as ImageIcon 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function Create_Portfolio() {
  const navigate = useNavigate();
  const [hasPortfolio, setHasPortfolio] = useState(false); 
  const [isEditing, setIsEditing] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '', fullName: '', title: '', bio: '', profileImage: '', 
    contact: { email: '', linkedin: '', github: '', website: '' },
    skills: [''], 
    projects: [{ name: '', description: '', techStack: '', githubLink: '', liveDemo: '' }],
    experience: [{ company: '', role: '', duration: '', description: '' }]
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.portfolioData) {
      setFormData(user.portfolioData);
      setHasPortfolio(true);
    }
  }, []);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const addItem = (field, defaultValue) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], defaultValue] }));
  };

  const removeItem = (field, index) => {
    const list = [...formData[field]];
    list.splice(index, 1);
    setFormData(prev => ({ ...prev, [field]: list }));
  };

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token"); 

      const method = hasPortfolio ? 'put' : 'post';
      const endpoint = hasPortfolio ? `/portfolio/add${formData.username}` : '/portfolio/add';

      const response = await axios[method](`${API_URL}${endpoint}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("user", JSON.stringify({ ...user, portfolioData: formData, hasPortfolio: true }));
        alert("Portfolio Published Successfully!");
        navigate(`/portfolio/${formData.username}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Publish Failed!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl text-center border border-gray-100">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            {hasPortfolio ? <Briefcase size={40} /> : <Rocket size={40} />}
          </div>
          <h2 className="text-3xl font-black mb-2">{hasPortfolio ? "Update Profile" : "Start Building"}</h2>
          <p className="text-gray-500 mb-8 tracking-tight">Generate your public portfolio with a unique URL.</p>
          <button onClick={() => setIsEditing(true)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg">
            {hasPortfolio ? "Edit My Portfolio" : "Create New Portfolio"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
        
        {/* Progress Bar */}
        <div className="flex bg-gray-100 h-1.5">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`flex-1 transition-all duration-500 ${step >= i ? 'bg-indigo-600' : 'bg-transparent'}`} />
          ))}
        </div>

        <div className="p-8 md:p-12">
          
          {/* Personal Info */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 font-black text-xl mb-6 text-gray-800"><User className="text-indigo-600" /> Personal Information</div>
              <input placeholder="Username (unique, required)" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent focus:border-indigo-200 transition-all" />
              <input placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-indigo-200 transition-all" />
              <input placeholder="Job Title (e.g. MERN Stack Developer)" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-indigo-200 transition-all" />
              <input placeholder="Profile Image URL" value={formData.profileImage} onChange={(e) => setFormData({...formData, profileImage: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-indigo-200 transition-all" />
              <textarea placeholder="Bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl h-32 outline-none border border-transparent focus:border-indigo-200 transition-all" />
            </div>
          )}

          {/* Contact Details */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 font-black text-xl mb-6 text-gray-800"><Mail className="text-indigo-600" /> Contact Details</div>
              {['email', 'linkedin', 'github', 'website'].map(field => (
                <input 
                  key={field} 
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1) + " URL"} 
                  value={formData.contact[field]} 
                  onChange={(e) => setFormData({...formData, contact: {...formData.contact, [field]: e.target.value}})} 
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-indigo-200 transition-all" 
                />
              ))}
            </div>
          )}

          {/* Skills & Experience */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-black text-gray-800 flex items-center gap-2"><Code className="text-indigo-600" size={20}/> Skills</span>
                  <button onClick={() => addItem('skills', '')} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"><Plus size={18}/></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-100 p-2 px-4 rounded-xl border border-slate-200">
                      <input 
                        value={skill} 
                        placeholder="Skill Name"
                        onChange={(e) => {
                          const s = [...formData.skills]; s[i] = e.target.value; setFormData({...formData, skills: s});
                        }} 
                        className="bg-transparent outline-none text-sm font-bold w-24" 
                      />
                      <button onClick={() => removeItem('skills', i)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-black text-gray-800 flex items-center gap-2"><Briefcase className="text-indigo-600" size={20}/> Experience</span>
                  <button onClick={() => addItem('experience', { company: '', role: '', duration: '', description: '' })} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"><Plus size={18}/></button>
                </div>
                {formData.experience.map((exp, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-3xl mb-4 space-y-3 relative border border-slate-100">
                    <button onClick={() => removeItem('experience', i)} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                    <input placeholder="Company Name" value={exp.company} onChange={(e) => {
                      const ex = [...formData.experience]; ex[i].company = e.target.value; setFormData({...formData, experience: ex});
                    }} className="w-full bg-transparent font-black outline-none text-gray-800" />
                    <input placeholder="Your Role" value={exp.role} className="w-full text-sm outline-none font-bold text-indigo-600 bg-transparent" onChange={(e) => {
                      const ex = [...formData.experience]; ex[i].role = e.target.value; setFormData({...formData, experience: ex});
                    }}/>
                    <input placeholder="Duration (e.g. 2023 - Present)" value={exp.duration} className="w-full text-xs outline-none text-gray-400 bg-transparent" onChange={(e) => {
                      const ex = [...formData.experience]; ex[i].duration = e.target.value; setFormData({...formData, experience: ex});
                    }}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-6">
                <span className="font-black text-xl text-gray-800">Recent Projects</span>
                <button onClick={() => addItem('projects', { name: '', description: '', techStack: '', githubLink: '', liveDemo: '' })} className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700"><Plus/></button>
              </div>
              <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {formData.projects.map((proj, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-[2.5rem] space-y-4 border border-slate-100 relative">
                    <button onClick={() => removeItem('projects', i)} className="absolute top-6 right-6 text-red-400"><Trash2 size={18}/></button>
                    <input placeholder="Project Name" value={proj.name} onChange={(e) => {
                      const p = [...formData.projects]; p[i].name = e.target.value; setFormData({...formData, projects: p});
                    }} className="w-full bg-transparent font-black text-lg outline-none" />
                    <input placeholder="Tech Stack (e.g. React, Node.js, MongoDB)" value={proj.techStack} onChange={(e) => {
                      const p = [...formData.projects]; p[i].techStack = e.target.value; setFormData({...formData, projects: p});
                    }} className="w-full bg-transparent text-sm text-indigo-600 font-bold outline-none" />
                    <textarea placeholder="Brief Project Description" value={proj.description} onChange={(e) => {
                      const p = [...formData.projects]; p[i].description = e.target.value; setFormData({...formData, projects: p});
                    }} className="w-full bg-transparent text-sm outline-none h-24 resize-none" />
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="flex-1 flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
                        <Link2 size={16} className="text-slate-400"/> 
                        <input placeholder="GitHub URL" value={proj.githubLink} onChange={(e) => { 
                          const p = [...formData.projects]; p[i].githubLink = e.target.value; setFormData({...formData, projects: p}); 
                        }} className="w-full outline-none text-xs" />
                      </div>
                      <div className="flex-1 flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
                        <Globe size={16} className="text-slate-400"/> 
                        <input placeholder="Live Demo URL" value={proj.liveDemo} onChange={(e) => { 
                          const p = [...formData.projects]; p[i].liveDemo = e.target.value; setFormData({...formData, projects: p}); 
                        }} className="w-full outline-none text-xs" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final Preview & Publish */}
          {step === 5 && (
            <div className="text-center py-10 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Send size={48}/>
              </div>
              <h2 className="text-3xl font-black mb-4 tracking-tight text-gray-900">Ready to Launch?</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                Review your details carefully. Your professional portfolio will be live at: <br/>
                <span className="text-indigo-600 font-bold underline">/portfolio/{formData.username}</span> 
              </p>
              <button 
                onClick={handlePublish} 
                disabled={isLoading} 
                className="px-16 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl disabled:bg-gray-400 active:scale-95"
              >
                {isLoading ? "Publishing..." : "Confirm & Save Portfolio"}
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12 flex justify-between items-center pt-8 border-t border-slate-100">
            <button 
              onClick={prevStep} 
              className={`font-bold text-gray-400 hover:text-indigo-600 transition-colors ${step === 1 ? 'invisible' : ''}`}
            >
              Previous Step
            </button>
            {step < 5 && (
              <button 
                onClick={nextStep} 
                className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95"
              >
                Next Step
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}