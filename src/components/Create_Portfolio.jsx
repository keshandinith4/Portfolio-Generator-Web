import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  User, Mail, Plus, Send, Trash2, Globe,
  Link2, Rocket, Briefcase, Star, BookOpen,
  Upload, FileText, X, ImageIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL        = import.meta.env.VITE_API_BASE_URL;
const CLOUD_NAME     = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET  = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const PROFESSION_SUGGESTIONS = [
 
];

export default function Create_Portfolio() {
  const navigate = useNavigate();
  const imageInputRef  = useRef(null);
  const resumeInputRef = useRef(null);

  const [hasPortfolio,    setHasPortfolio]    = useState(false);
  const [isEditing,       setIsEditing]       = useState(false);
  const [step,            setStep]            = useState(1);
  const [isLoading,       setIsLoading]       = useState(false);
  const [loggedInUser,    setLoggedInUser]    = useState(null);

  // Upload states 
  const [imageUploading,  setImageUploading]  = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [imagePreview,    setImagePreview]    = useState(null);
  const [resumeFileName,  setResumeFileName]  = useState('');

  const [formData, setFormData] = useState({
    fullName:     '',
    title:        '',
    bio:          '',
    profileImage: '',   // Cloudinary URL
    resumeUrl:    '',   // Cloudinary URL
    contact:  { email: '', linkedin: '', github: '', website: '' },
    skills:   [''],
    projects: [{ name: '', description: '', toolsUsed: '', projectLink: '', liveDemo: '' }],
    experience: [{ company: '', role: '', duration: '', description: '' }]
  });

  // Load user from localStorage 
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("Loaded user from localStorage:", user);
    console.log("User Id:", user?._id);
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

  // Cloudinary upload helper
  const uploadToCloudinary = async (file, folder = 'portfolios') => {
    const data = new FormData();
    data.append('file',            file);
    data.append('upload_preset',   UPLOAD_PRESET);
    data.append('folder',          folder);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      data
    );
    return res.data.secure_url;
  };

  // Profile image upload 
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type and size (max 5MB)
    if (!file.type.startsWith('image/')) {
      return alert("Please select an image file.");
    }
    if (file.size > 5 * 1024 * 1024) {
      return alert("Image must be under 5MB.");
    }

    // Show local preview immediately
    setImagePreview(URL.createObjectURL(file));
    setImageUploading(true);

    try {
      const url = await uploadToCloudinary(file, 'portfolios/images');
      setFormData(prev => ({ ...prev, profileImage: url }));
    } catch {
      alert("Image upload failed. Please try again.");
      setImagePreview(null);
    } finally {
      setImageUploading(false);
    }
  };

  // Resume PDF upload 
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      return alert("Please select a PDF file.");
    }
    if (file.size > 10 * 1024 * 1024) {
      return alert("Resume PDF must be under 10MB.");
    }

    setResumeFileName(file.name);
    setResumeUploading(true);

    try {
      const url = await uploadToCloudinary(file, 'portfolios/resumes');
      setFormData(prev => ({ ...prev, resumeUrl: url }));
    } catch {
      alert("Resume upload failed. Please try again.");
      setResumeFileName('');
    } finally {
      setResumeUploading(false);
    }
  };

  // Remove uploaded files 
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

  // Form helpers 
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const addItem = (field, defaultValue) =>
    setFormData(prev => ({ ...prev, [field]: [...prev[field], defaultValue] }));

  const removeItem = (field, index) => {
    const list = [...formData[field]];
    list.splice(index, 1);
    setFormData(prev => ({ ...prev, [field]: list }));
  };

  // Publish 
  const handlePublish = async () => {
    if (imageUploading || resumeUploading) {
      return alert("Please wait for uploads to finish.");
    }
    if (!formData.fullName || !formData.title) {
      return alert("Full name and title are required.");
    }

    setIsLoading(true);
    try {
      const user  = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      console.log("Form data to publish:", formData);

      console.log("Publishing portfolio for user:", user?.username);
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
        alert("Portfolio Published Successfully!");
        navigate(`/portfolio/${user.username}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Publish Failed!");
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

              {/* Username — read only */}
              <div className="w-full p-4 bg-slate-100 rounded-2xl border border-slate-200 flex items-center gap-3">
                <span className="text-gray-400 text-sm font-bold">Username</span>
                <span className="text-indigo-600 font-black">@{loggedInUser?.username}</span>
                <span className="ml-auto text-xs text-gray-400 italic">cannot be changed</span>
              </div>

              {/* Profile Image Upload */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Profile Photo</p>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* No image yet,show upload button */}
                {!imagePreview ? (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current.click()}
                    disabled={imageUploading}
                    className="w-full p-6 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center gap-2 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-slate-400 hover:text-indigo-500"
                  >
                    <ImageIcon size={32} />
                    <span className="font-bold text-sm">
                      {imageUploading ? "Uploading..." : "Click to upload profile photo"}
                    </span>
                    <span className="text-xs">JPG, PNG, WEBP (max 5MB)</span>
                  </button>
                ) : (
                  /* Image preview with remove button */
                  <div className="relative w-fit mx-auto">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-[1.5rem] object-cover border-4 border-white shadow-xl"
                    />
                    {/* Uploading overlay */}
                    {imageUploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-[1.5rem] flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Uploading...</span>
                      </div>
                    )}
                    {/* Remove button */}
                    {!imageUploading && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md"
                      >
                        <X size={14} />
                      </button>
                    )}
                    {/* Change photo button */}
                    {!imageUploading && (
                      <button
                        type="button"
                        onClick={() => imageInputRef.current.click()}
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 hover:text-indigo-600 shadow-sm whitespace-nowrap"
                      >
                        Change Photo
                      </button>
                    )}
                  </div>
                )}
              </div>

              <input
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-indigo-200 transition-all mt-6"
              />

              {/* Profession title with suggestions */}
              <div>
                <input
                  placeholder="Your Profession / Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-indigo-200 transition-all"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {PROFESSION_SUGGESTIONS.map(s => (
                    <button
                      key={s} type="button"
                      onClick={() => setFormData({ ...formData, title: s })}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all
                        ${formData.title === s
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300'
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                placeholder="Write a short bio about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full p-4 bg-slate-50 rounded-2xl h-32 outline-none border border-transparent focus:border-indigo-200 transition-all resize-none"
              />

              {/* Resume PDF Upload */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Resume / CV (PDF)</p>
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                />

                {!resumeFileName ? (
                  <button
                    type="button"
                    onClick={() => resumeInputRef.current.click()}
                    disabled={resumeUploading}
                    className="w-full p-5 border-2 border-dashed border-slate-300 rounded-2xl flex items-center gap-3 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-slate-400 hover:text-indigo-500"
                  >
                    <FileText size={24} />
                    <div className="text-left">
                      <p className="font-bold text-sm">
                        {resumeUploading ? "Uploading PDF..." : "Upload Resume / CV"}
                      </p>
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
                      <button
                        type="button"
                        onClick={removeResume}
                        className="text-red-400 hover:text-red-600 shrink-0"
                      >
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
                <input
                  key={field}
                  placeholder={placeholder}
                  value={formData.contact[field]}
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
                      <input
                        value={skill}
                        placeholder="e.g. Photoshop, Excel..."
                        onChange={(e) => {
                          const s = [...formData.skills];
                          s[i] = e.target.value;
                          setFormData({ ...formData, skills: s });
                        }}
                        className="bg-transparent outline-none text-sm font-bold w-32"
                      />
                      <button onClick={() => removeItem('skills', i)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
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
                  <button
                    onClick={() => addItem('experience', { company: '', role: '', duration: '', description: '' })}
                    className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                {formData.experience.map((exp, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-3xl mb-4 space-y-3 relative border border-slate-100">
                    <button onClick={() => removeItem('experience', i)} className="absolute top-4 right-4 text-red-400 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
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

          {/* Works / Projects */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-6">
                <span className="font-black text-xl text-gray-800 flex items-center gap-2">
                  <BookOpen className="text-indigo-600" size={22} /> Works & Projects
                </span>
                <button
                  onClick={() => addItem('projects', { name: '', description: '', toolsUsed: '', projectLink: '', liveDemo: '' })}
                  className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700"
                >
                  <Plus />
                </button>
              </div>

              <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2">
                {formData.projects.map((proj, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-[2.5rem] space-y-4 border border-slate-100 relative">
                    <button onClick={() => removeItem('projects', i)} className="absolute top-6 right-6 text-red-400">
                      <Trash2 size={18} />
                    </button>
                    <input placeholder="Work / Project Title" value={proj.name}
                      onChange={(e) => { const p = [...formData.projects]; p[i].name = e.target.value; setFormData({ ...formData, projects: p }); }}
                      className="w-full bg-transparent font-black text-lg outline-none"
                    />
                    {/* toolsUsed — not techStack */}
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
                        {/* projectLink — not githubLink */}
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

          {/* Confirm & Publish */}
          {step === 5 && (
            <div className="text-center py-10 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send size={48} />
              </div>
              <h2 className="text-3xl font-black mb-4 tracking-tight text-gray-900">Ready to Go Live?</h2>
              <p className="text-gray-500 mb-2">Your portfolio will be live at:</p>
              <p className="text-indigo-600 font-black text-lg mb-4">
                /portfolio/{loggedInUser?.username}
              </p>

              {/* Upload status warnings */}
              {(imageUploading || resumeUploading) && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-700 text-sm font-bold">
                   Please wait — uploads still in progress...
                </div>
              )}

              {/* Summary */}
              <div className="text-left bg-slate-50 rounded-2xl p-6 mb-8 space-y-2 text-sm text-gray-600">
                <p><span className="font-bold text-gray-800">Name:</span> {formData.fullName || '—'}</p>
                <p><span className="font-bold text-gray-800">Title:</span> {formData.title || '—'}</p>
                <p><span className="font-bold text-gray-800">Skills:</span> {formData.skills.filter(Boolean).join(', ') || '—'}</p>
                <p><span className="font-bold text-gray-800">Projects:</span> {formData.projects.filter(p => p.name).length}</p>
                <p><span className="font-bold text-gray-800">Experience:</span> {formData.experience.filter(e => e.company).length} entries</p>
                <p><span className="font-bold text-gray-800">Photo:</span> {formData.profileImage ? 'Uploaded' : 'Not uploaded'}</p>
                <p><span className="font-bold text-gray-800">Resume:</span> {formData.resumeUrl ? 'Uploaded' : 'Not uploaded'}</p>
              </div>

              <button
                onClick={handlePublish}
                disabled={isLoading || imageUploading || resumeUploading}
                className="px-16 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95"
              >
                {isLoading ? "Publishing..." : "Confirm & Publish"}
              </button>
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