import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  User, Mail, Plus, Send, Trash2, Globe,
  Link2, Rocket, Briefcase, Star, BookOpen,
  Upload, FileText, X, ImageIcon, Sun, Moon,
  Eye, Edit3, Github, ExternalLink, Download,
  MapPin, Award, Code2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL        = import.meta.env.VITE_API_BASE_URL;
const CLOUD_NAME     = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET  = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const PROFESSION_SUGGESTIONS = [];

/* Portfolio Preview Component */
function PortfolioPreview({ formData, darkMode }) {
  const dark = darkMode;

  return (
    <div
      className={`rounded-3xl overflow-hidden border transition-all duration-300 ${
        dark
          ? 'bg-gray-900 border-gray-700 text-white'
          : 'bg-white border-slate-200 text-gray-900'
      }`}
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      {/* Hero Section */}
      <div
        className={`relative px-8 py-10 flex flex-col items-center text-center gap-4 ${
          dark
            ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-indigo-950'
            : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
        }`}
      >
        {/* Decorative blobs */}
        <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 ${dark ? 'bg-indigo-500' : 'bg-purple-300'}`} />
        <div className={`absolute bottom-0 left-0 w-32 h-32 rounded-full blur-3xl opacity-20 ${dark ? 'bg-violet-500' : 'bg-indigo-200'}`} />

        {/* Profile Image */}
        {formData.profileImage ? (
          <img
            src={formData.profileImage}
            alt="Profile"
            className={`w-24 h-24 rounded-2xl object-cover shadow-2xl ring-4 ${dark ? 'ring-indigo-500/40' : 'ring-indigo-100'}`}
          />
        ) : (
          <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg ${dark ? 'bg-gray-700' : 'bg-indigo-100'}`}>
            <User size={40} className={dark ? 'text-indigo-400' : 'text-indigo-500'} />
          </div>
        )}

        <div className="relative z-10">
          <h1 className={`text-2xl font-black tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
            {formData.fullName || 'Your Name'}
          </h1>
          <p className={`text-sm font-bold mt-1 ${dark ? 'text-indigo-400' : 'text-indigo-600'}`}>
            {formData.title || 'Your Title'}
          </p>
          {formData.bio && (
            <p className={`text-xs mt-3 max-w-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              {formData.bio}
            </p>
          )}
        </div>

        {/* Contact links */}
        <div className="flex flex-wrap gap-2 justify-center relative z-10">
          {formData.contact.email && (
            <span className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium ${dark ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600 shadow-sm border border-slate-200'}`}>
              <Mail size={11} /> {formData.contact.email}
            </span>
          )}
          {formData.contact.linkedin && (
            <span className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium ${dark ? 'bg-blue-900/60 text-blue-300' : 'bg-blue-50 text-blue-600'}`}>
              <Link2 size={11} /> LinkedIn
            </span>
          )}
          {formData.contact.github && (
            <span className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium ${dark ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-600'}`}>
              <Github size={11} /> GitHub
            </span>
          )}
          {formData.contact.website && (
            <span className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium ${dark ? 'bg-purple-900/60 text-purple-300' : 'bg-purple-50 text-purple-600'}`}>
              <Globe size={11} /> Website
            </span>
          )}
        </div>

        {/* Resume badge */}
        {formData.resumeUrl && (
          <span className={`flex items-center gap-2 text-xs px-4 py-2 rounded-full font-bold relative z-10 ${dark ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            <Download size={12} /> Resume Available
          </span>
        )}
      </div>

      <div className="p-6 space-y-6">

        {/* Skills */}
        {formData.skills.filter(Boolean).length > 0 && (
          <div>
            <h3 className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-3 ${dark ? 'text-indigo-400' : 'text-indigo-600'}`}>
              <Award size={14} /> Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {formData.skills.filter(Boolean).map((skill, i) => (
                <span
                  key={i}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold ${
                    dark
                      ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-800'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {formData.experience.filter(e => e.company).length > 0 && (
          <div>
            <h3 className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-3 ${dark ? 'text-indigo-400' : 'text-indigo-600'}`}>
              <Briefcase size={14} /> Experience
            </h3>
            <div className="space-y-3">
              {formData.experience.filter(e => e.company).map((exp, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border-l-4 ${
                    dark
                      ? 'bg-gray-800 border-indigo-500'
                      : 'bg-slate-50 border-indigo-400'
                  }`}
                >
                  <p className={`font-black text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>{exp.company}</p>
                  <p className={`text-xs font-bold mt-0.5 ${dark ? 'text-indigo-400' : 'text-indigo-600'}`}>{exp.role}</p>
                  {exp.duration && (
                    <p className={`text-xs mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{exp.duration}</p>
                  )}
                  {exp.description && (
                    <p className={`text-xs mt-2 leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {formData.projects.filter(p => p.name).length > 0 && (
          <div>
            <h3 className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-3 ${dark ? 'text-indigo-400' : 'text-indigo-600'}`}>
              <Code2 size={14} /> Projects
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {formData.projects.filter(p => p.name).map((proj, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl ${
                    dark
                      ? 'bg-gray-800 border border-gray-700'
                      : 'bg-white border border-slate-200 shadow-sm'
                  }`}
                >
                  <p className={`font-black text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>{proj.name}</p>
                  {proj.toolsUsed && (
                    <p className={`text-xs font-bold mt-1 ${dark ? 'text-purple-400' : 'text-purple-600'}`}>{proj.toolsUsed}</p>
                  )}
                  {proj.description && (
                    <p className={`text-xs mt-2 leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{proj.description}</p>
                  )}
                  {(proj.projectLink || proj.liveDemo) && (
                    <div className="flex gap-2 mt-3">
                      {proj.projectLink && (
                        <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-bold ${dark ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-600'}`}>
                          <Link2 size={10} /> Source
                        </span>
                      )}
                      {proj.liveDemo && (
                        <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-bold ${dark ? 'bg-indigo-900/60 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                          <ExternalLink size={10} /> Live Demo
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


/* Main Component */
export default function Create_Portfolio() {
  const navigate = useNavigate();
  const imageInputRef  = useRef(null);
  const resumeInputRef = useRef(null);

  const [hasPortfolio,    setHasPortfolio]    = useState(false);
  const [isEditing,       setIsEditing]       = useState(false);
  const [step,            setStep]            = useState(1);
  const [isLoading,       setIsLoading]       = useState(false);
  const [loggedInUser,    setLoggedInUser]    = useState(null);
  const [previewDark,     setPreviewDark]     = useState(false); 

  const [imageUploading,  setImageUploading]  = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [imagePreview,    setImagePreview]    = useState(null);
  const [resumeFileName,  setResumeFileName]  = useState('');

  const [formData, setFormData] = useState({
    fullName:     '',
    title:        '',
    bio:          '',
    profileImage: '',
    resumeUrl:    '',
    contact:  { email: '', linkedin: '', github: '', website: '' },
    skills:   [''],
    projects: [{ name: '', description: '', toolsUsed: '', projectLink: '', liveDemo: '' }],
    experience: [{ company: '', role: '', duration: '', description: '' }]
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate('/login');
    setLoggedInUser(user);
    if (user.hasPortfolio && user.portfolioData) {
      setFormData(prev => ({ ...prev, ...user.portfolioData }));
      setHasPortfolio(true);
      if (user.portfolioData.profileImage) setImagePreview(user.portfolioData.profileImage);
      if (user.portfolioData.resumeUrl)    setResumeFileName('resume_uploaded.pdf');
    } else if (user.portfolioData?.fullName) {
      setFormData(prev => ({ ...prev, fullName: user.portfolioData.fullName }));
    }
  }, []);

  const uploadToCloudinary = async (file, folder = 'portfolios', resourceType = 'auto') => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', UPLOAD_PRESET);
    data.append('folder', folder);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      data
    );
    return res.data.secure_url;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/'))   return alert("Please select an image file.");
    if (file.size > 5 * 1024 * 1024)       return alert("Image must be under 5MB.");
    setImagePreview(URL.createObjectURL(file));
    setImageUploading(true);
    try {
      const url = await uploadToCloudinary(file, 'portfolios/images', 'image');
      setFormData(prev => ({ ...prev, profileImage: url }));
    } catch {
      alert("Image upload failed. Please try again.");
      setImagePreview(null);
    } finally { setImageUploading(false); }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf')   return alert("Please select a PDF file.");
    if (file.size > 10 * 1024 * 1024)     return alert("Resume PDF must be under 10MB.");
    setResumeFileName(file.name);
    setResumeUploading(true);
    try {
      const url = await uploadToCloudinary(file, 'portfolios/resumes', 'image');
      setFormData(prev => ({ ...prev, resumeUrl: url }));
    } catch {
      alert("Resume upload failed. Please try again.");
      setResumeFileName('');
    } finally { setResumeUploading(false); }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, profileImage: '' }));
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const removeResume = () => {
    setResumeFileName('');
    setFormData(prev => ({ ...prev, resumeUrl: '' }));
    if (resumeInputRef.current) resumeInputRef.current.value = '';
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const addItem = (field, defaultValue) =>
    setFormData(prev => ({ ...prev, [field]: [...prev[field], defaultValue] }));

  const removeItem = (field, index) => {
    const list = [...formData[field]];
    list.splice(index, 1);
    setFormData(prev => ({ ...prev, [field]: list }));
  };

  const handlePublish = async () => {
    if (imageUploading || resumeUploading) return alert("Please wait for uploads to finish.");
    if (!formData.fullName || !formData.title) return alert("Full name and title are required.");

    setIsLoading(true);
    try {
      const user  = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      const response = hasPortfolio
        ? await axios.put(`${API_URL}/portfolio/update/${user?.username}`, formData, {
            headers: { Authorization: `Bearer ${token}` }
          })
        : await axios.put(`${API_URL}/portfolio/create/${user?.username}`, formData, {
            headers: { Authorization: `Bearer ${token}` }
          });

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("user", JSON.stringify({
          ...user,
          portfolioData: formData,
          hasPortfolio:  true
        }));
        toast.success("Portfolio Published Successfully!");
        navigate(`/portfolio/${user.username}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Publish Failed!");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Landing screen
  if (!isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl text-center border border-gray-100">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            {hasPortfolio ? <Briefcase size={40} /> : <Rocket size={40} />}
          </div>
          <h2 className="text-3xl font-black mb-2">
            {hasPortfolio ? "Update Portfolio" : "Build Your Portfolio"}
          </h2>
          <p className="text-gray-500 mb-2">Showcase your work whatever your profession.</p>
          {loggedInUser && (
            <p className="text-sm text-indigo-500 font-bold mb-6">@{loggedInUser.username}</p>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
          >
            {hasPortfolio ? "Edit My Portfolio" : "Create New Portfolio"}
          </button>
        </div>
      </div>
    );
  }

  // Multi-step form
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
              <div className="flex items-center gap-2 font-black text-xl mb-6 text-gray-800">
                <User className="text-indigo-600" /> Personal Information
              </div>

              <div className="w-full p-4 bg-slate-100 rounded-2xl border border-slate-200 flex items-center gap-3">
                <span className="text-gray-400 text-sm font-bold">Username</span>
                <span className="text-indigo-600 font-black">@{loggedInUser?.username}</span>
                <span className="ml-auto text-xs text-gray-400 italic">cannot be changed</span>
              </div>

              {/* Profile Image Upload */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Profile Photo</p>
                <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                {!imagePreview ? (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current.click()}
                    disabled={imageUploading}
                    className="w-full p-6 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center gap-2 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-slate-400 hover:text-indigo-500"
                  >
                    <ImageIcon size={32} />
                    <span className="font-bold text-sm">{imageUploading ? "Uploading..." : "Click to upload profile photo"}</span>
                    <span className="text-xs">JPG, PNG, WEBP (max 5MB)</span>
                  </button>
                ) : (
                  <div className="relative w-fit mx-auto">
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 rounded-[1.5rem] object-cover border-4 border-white shadow-xl" />
                    {imageUploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-[1.5rem] flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Uploading...</span>
                      </div>
                    )}
                    {!imageUploading && (
                      <>
                        <button type="button" onClick={removeImage}
                          className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md">
                          <X size={14} />
                        </button>
                        <button type="button" onClick={() => imageInputRef.current.click()}
                          className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 hover:text-indigo-600 shadow-sm whitespace-nowrap">
                          Change Photo
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <input placeholder="Full Name" value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-indigo-200 transition-all mt-6"
              />

              <div>
                <input placeholder="Your Profession / Title" value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-indigo-200 transition-all"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {PROFESSION_SUGGESTIONS.map(s => (
                    <button key={s} type="button" onClick={() => setFormData({ ...formData, title: s })}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${formData.title === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <textarea placeholder="Write a short bio about yourself..." value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full p-4 bg-slate-50 rounded-2xl h-32 outline-none border border-transparent focus:border-indigo-200 transition-all resize-none"
              />

              {/* Resume PDF Upload */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Resume / CV (PDF)</p>
                <input ref={resumeInputRef} type="file" accept="application/pdf" onChange={handleResumeUpload} className="hidden" />
                {!resumeFileName ? (
                  <button type="button" onClick={() => resumeInputRef.current.click()} disabled={resumeUploading}
                    className="w-full p-5 border-2 border-dashed border-slate-300 rounded-2xl flex items-center gap-3 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-slate-400 hover:text-indigo-500">
                    <FileText size={24} />
                    <div className="text-left">
                      <p className="font-bold text-sm">{resumeUploading ? "Uploading PDF..." : "Upload Resume / CV"}</p>
                      <p className="text-xs">PDF only (max 10MB)</p>
                    </div>
                  </button>
                ) : (
                  <div className="w-full p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
                    <FileText size={20} className="text-green-600 shrink-0" />
                    <span className="text-sm font-bold text-green-700 flex-1 truncate">
                      {resumeUploading ? "Uploading..." : resumeFileName}
                    </span>
                    {!resumeUploading && (
                      <button type="button" onClick={removeResume} className="text-red-400 hover:text-red-600 shrink-0">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 font-black text-xl mb-6 text-gray-800">
                <Mail className="text-indigo-600" /> Contact & Links
              </div>
              {[
                { field: 'email',    placeholder: 'Contact Email' },
                { field: 'linkedin', placeholder: 'LinkedIn Profile URL' },
                { field: 'github',   placeholder: 'GitHub Profile URL (optional)' },
                { field: 'website',  placeholder: 'Personal Website URL' },
              ].map(({ field, placeholder }) => (
                <input key={field} placeholder={placeholder} value={formData.contact[field]}
                  onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, [field]: e.target.value } })}
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-indigo-200 transition-all"
                />
              ))}
            </div>
          )}

          {/* Skills & Experience */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              {/* Skills */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-black text-gray-800 flex items-center gap-2">
                    <Star className="text-indigo-600" size={20} /> Skills & Expertise
                  </span>
                  <button onClick={() => addItem('skills', '')} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-100 p-2 px-4 rounded-xl border border-slate-200">
                      <input value={skill} placeholder="e.g. Photoshop, Excel..."
                        onChange={(e) => { const s = [...formData.skills]; s[i] = e.target.value; setFormData({ ...formData, skills: s }); }}
                        className="bg-transparent outline-none text-sm font-bold w-32"
                      />
                      <button onClick={() => removeItem('skills', i)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-black text-gray-800 flex items-center gap-2">
                    <Briefcase className="text-indigo-600" size={20} /> Work Experience
                  </span>
                  <button onClick={() => addItem('experience', { company: '', role: '', duration: '', description: '' })}
                    className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                    <Plus size={18} />
                  </button>
                </div>
                {formData.experience.map((exp, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-3xl mb-4 space-y-3 relative border border-slate-100">
                    <button onClick={() => removeItem('experience', i)} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                    <input placeholder="Company / Organization / Client" value={exp.company}
                      onChange={(e) => { const ex = [...formData.experience]; ex[i].company = e.target.value; setFormData({ ...formData, experience: ex }); }}
                      className="w-full bg-transparent font-black outline-none text-gray-800"
                    />
                    <input placeholder="Your Role / Position" value={exp.role}
                      onChange={(e) => { const ex = [...formData.experience]; ex[i].role = e.target.value; setFormData({ ...formData, experience: ex }); }}
                      className="w-full text-sm outline-none font-bold text-indigo-600 bg-transparent"
                    />
                    <input placeholder="Duration (e.g. Jan 2022 – Present)" value={exp.duration}
                      onChange={(e) => { const ex = [...formData.experience]; ex[i].duration = e.target.value; setFormData({ ...formData, experience: ex }); }}
                      className="w-full text-xs outline-none text-gray-400 bg-transparent"
                    />
                    <textarea placeholder="Describe your responsibilities..." value={exp.description}
                      onChange={(e) => { const ex = [...formData.experience]; ex[i].description = e.target.value; setFormData({ ...formData, experience: ex }); }}
                      className="w-full text-sm outline-none text-gray-600 bg-transparent resize-none h-16"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-6">
                <span className="font-black text-xl text-gray-800 flex items-center gap-2">
                  <BookOpen className="text-indigo-600" size={22} /> Works & Projects
                </span>
                <button onClick={() => addItem('projects', { name: '', description: '', toolsUsed: '', projectLink: '', liveDemo: '' })}
                  className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700">
                  <Plus />
                </button>
              </div>
              <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2">
                {formData.projects.map((proj, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-[2.5rem] space-y-4 border border-slate-100 relative">
                    <button onClick={() => removeItem('projects', i)} className="absolute top-6 right-6 text-red-400"><Trash2 size={18} /></button>
                    <input placeholder="Work / Project Title" value={proj.name}
                      onChange={(e) => { const p = [...formData.projects]; p[i].name = e.target.value; setFormData({ ...formData, projects: p }); }}
                      className="w-full bg-transparent font-black text-lg outline-none"
                    />
                    <input placeholder="Tools Used (e.g. Figma, Lightroom, React)" value={proj.toolsUsed}
                      onChange={(e) => { const p = [...formData.projects]; p[i].toolsUsed = e.target.value; setFormData({ ...formData, projects: p }); }}
                      className="w-full bg-transparent text-sm text-indigo-600 font-bold outline-none"
                    />
                    <textarea placeholder="Describe this work..." value={proj.description}
                      onChange={(e) => { const p = [...formData.projects]; p[i].description = e.target.value; setFormData({ ...formData, projects: p }); }}
                      className="w-full bg-transparent text-sm outline-none h-20 resize-none"
                    />
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="flex-1 flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
                        <Link2 size={16} className="text-slate-400 shrink-0" />
                        <input placeholder="Source / Repo URL (optional)" value={proj.projectLink}
                          onChange={(e) => { const p = [...formData.projects]; p[i].projectLink = e.target.value; setFormData({ ...formData, projects: p }); }}
                          className="w-full outline-none text-xs"
                        />
                      </div>
                      <div className="flex-1 flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
                        <Globe size={16} className="text-slate-400 shrink-0" />
                        <input placeholder="Live / Demo URL (optional)" value={proj.liveDemo}
                          onChange={(e) => { const p = [...formData.projects]; p[i].liveDemo = e.target.value; setFormData({ ...formData, projects: p }); }}
                          className="w-full outline-none text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview & Publish */}
          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-4">

              {/* Header row */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 font-black text-xl text-gray-800">
                  <Eye className="text-indigo-600" size={22} /> Portfolio Preview
                </div>

                {/* Light / Dark toggle */}
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
                  <button
                    onClick={() => setPreviewDark(false)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                      !previewDark
                        ? 'bg-white shadow-md text-gray-800'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Sun size={15} /> Light
                  </button>
                  <button
                    onClick={() => setPreviewDark(true)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                      previewDark
                        ? 'bg-gray-900 shadow-md text-white'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Moon size={15} /> Dark
                  </button>
                </div>
              </div>

              {/* Upload warnings */}
              {(imageUploading || resumeUploading) && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-700 text-sm font-bold">
                  ⏳ Please wait — uploads still in progress...
                </div>
              )}

              {/* Preview card — scrollable */}
              <div className="max-h-[480px] overflow-y-auto rounded-3xl ring-1 ring-slate-200 shadow-inner mb-6">
                <PortfolioPreview formData={formData} darkMode={previewDark} />
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold border-2 border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                >
                  <Edit3 size={18} /> Edit Details
                </button>

                <button
                  onClick={handlePublish}
                  disabled={isLoading || imageUploading || resumeUploading}
                  className="flex-2 flex-grow flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95 text-lg"
                >
                  <Send size={20} />
                  {isLoading ? "Publishing..." : hasPortfolio ? "Update & Publish" : "Publish Portfolio"}
                </button>
              </div>

              <p className="text-center text-xs text-gray-400 mt-3">
                Your portfolio will be live at <span className="font-bold text-indigo-500">/portfolio/{loggedInUser?.username}</span>
              </p>
            </div>
          )}

          {/* Navigation */}
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