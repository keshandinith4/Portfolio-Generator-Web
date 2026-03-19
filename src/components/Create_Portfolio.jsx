import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Code, Briefcase, 
  Plus, Trash2, Send, ChevronRight, ChevronLeft, Rocket 
} from 'lucide-react';

export default function Create_Portfolio() {
  const [hasPortfolio, setHasPortfolio] = useState(false); 
  const [isEditing, setIsEditing] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    title: '',
    bio: '',
    profileImage: '',
    contact: { email: '', linkedin: '', github: '', website: '' },
    skills: ['React', 'JavaScript'],
    projects: [{ name: '', description: '', techStack: '', githubLink: '', liveDemo: '' }],
    experience: [{ company: '', role: '', duration: '', description: '' }]
  });

  const [errors, setErrors] = useState({});

  const validateStep = () => {
    let newErrors = {};
    if (step === 1) {
      if (!formData.username.trim()) newErrors.username = "Username is required";
      if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => { if (validateStep()) setStep(prev => prev + 1); };
  const prevStep = () => setStep(prev => prev - 1);

  const handleInputChange = (e, section = null) => {
    const { name, value } = e.target;
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addListItem = (listName, template) => {
    setFormData(prev => ({ ...prev, [listName]: [...prev[listName], template] }));
  };

  const removeListItem = (index, listName) => {
    setFormData(prev => ({ ...prev, [listName]: prev[listName].filter((_, i) => i !== index) }));
  };

  const handlePublish = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log("Final Submission:", formData);
      alert(hasPortfolio ? " Portfolio Updated Successfully!" : " Portfolio Created Successfully!");
      setHasPortfolio(true);
      setIsEditing(false); 
      setStep(1); 
    }, 2000);
  };

 
  if (!isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 text-center transition-all">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ${hasPortfolio ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
            {hasPortfolio ? <Briefcase size={48} /> : <Rocket size={48} />}
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            {hasPortfolio ? "Welcome Back!" : "Showcase Your Talent"}
          </h2>
          
          <p className="text-gray-500 mb-10 leading-relaxed">
            {hasPortfolio 
              ? "Your professional portfolio is currently live. Do you want to update your latest projects and skills?" 
              : "Create a stunning professional portfolio in minutes and share it with the world."}
          </p>
          
          <button 
            onClick={() => setIsEditing(true)}
            className={`w-full py-4 rounded-2xl font-bold text-white transition-all transform hover:-translate-y-1 shadow-lg active:scale-95 ${
              hasPortfolio ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' : 'bg-green-600 hover:bg-green-700 shadow-green-200'
            }`}
          >
            {hasPortfolio ? "Update Your Portfolio" : "Create Your Portfolio"}
          </button>
          
          {hasPortfolio && (
             <p className="mt-4 text-sm text-gray-400 font-medium cursor-pointer hover:text-indigo-500 transition-colors">
                View Live Portfolio
             </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans relative">
      {/* Back Button */}
      <button 
        onClick={() => setIsEditing(false)}
        className="absolute top-6 left-10 text-gray-500 font-semibold hover:text-indigo-600 flex items-center gap-1 transition-colors"
      >
        <ChevronLeft size={18} /> Exit Editor
      </button>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mt-10">
        
        {/* Step Indicator / Progress Bar */}
        <div className="flex bg-gray-100 h-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`flex-1 transition-all duration-700 ${step >= i ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        <div className="p-10">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
              {hasPortfolio ? "Update Portfolio" : "Create New Portfolio"}
            </h1>
            <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">STEP {step} OF 4</span>
                <span className="text-gray-400 text-sm italic">— {step === 1 ? 'Personal Info' : step === 2 ? 'Skills & Social' : step === 3 ? 'Projects' : 'Finish'}</span>
            </div>
          </div>

          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 text-gray-800 font-bold mb-2">
                <User size={20} className="text-indigo-600" /> Basic Details
              </div>
              <div className="grid grid-cols-1 gap-4">
                  <div className="relative">
                      <input 
                        type="text" name="username" placeholder="Unique Username (URL)"
                        value={formData.username} onChange={handleInputChange}
                        disabled={hasPortfolio} 
                        className={`w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${hasPortfolio ? 'bg-gray-50 cursor-not-allowed text-gray-400' : 'border-gray-200 focus:border-indigo-500'}`}
                      />
                      {hasPortfolio && <span className="absolute right-4 top-4 text-[10px] font-bold text-gray-400 uppercase">Locked</span>}
                  </div>
                  <input 
                    type="text" name="fullName" placeholder="Full Name"
                    value={formData.fullName} onChange={handleInputChange}
                    className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  <input 
                    type="text" name="title" placeholder="Professional Title (e.g. Senior UI Designer)"
                    value={formData.title} onChange={handleInputChange}
                    className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  <textarea 
                    name="bio" placeholder="Write a short, catchy bio about yourself..."
                    value={formData.bio} onChange={handleInputChange}
                    className="w-full p-4 border border-gray-200 rounded-2xl h-32 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
              </div>
            </div>
          )}

          {/* STEP 2: Contact & Skills */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center gap-2 text-gray-800 font-bold mb-2">
                 <Mail size={20} className="text-indigo-600" /> Social Presence
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['email', 'linkedin', 'github', 'website'].map((f) => (
                  <input 
                    key={f} 
                    type="text"
                    placeholder={f.charAt(0).toUpperCase() + f.slice(1)} 
                    name={f} 
                    value={formData.contact[f]} 
                    onChange={(e) => handleInputChange(e, 'contact')} 
                    className="p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                   />
                 ))}
               </div>

               <div className="pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">Core Skills</h3>
                  <div className="flex flex-wrap gap-3">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 group">
                        <input 
                          value={skill} 
                          onChange={(e) => {
                            const newSkills = [...formData.skills];
                            newSkills[index] = e.target.value;
                            setFormData({...formData, skills: newSkills});
                          }}
                          className="bg-transparent outline-none text-indigo-700 text-sm font-bold w-24"
                        />
                        <button onClick={() => removeListItem(index, 'skills')}>
                            <Trash2 size={14} className="text-indigo-300 hover:text-red-500 transition-colors" />
                        </button>
                      </div>
                    ))}
                    <button 
                        type="button" 
                        onClick={() => addListItem('skills', '')} 
                        className="px-4 py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm font-bold hover:border-indigo-300 hover:text-indigo-500 transition-all"
                    >
                        + Add Skill
                    </button>
                  </div>
                </div>
            </div>
          )}

          {/* STEP 3: Projects */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-800 font-bold"><Code size={20} className="text-indigo-600"/> Featured Projects</div>
                <button 
                    type="button" 
                    onClick={() => addListItem('projects', { name: '', description: '', techStack: '', githubLink: '', liveDemo: '' })} 
                    className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-90"
                >
                    <Plus size={20}/>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.projects.map((p, i) => (
                    <div key={i} className="p-6 bg-gray-50 border border-gray-100 rounded-3xl relative group transition-all hover:bg-white hover:shadow-xl hover:border-indigo-100">
                       <button onClick={() => removeListItem(i, 'projects')} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={20}/>
                       </button>
                       <input 
                          placeholder="Project Title" 
                          className="bg-transparent text-lg font-bold w-full mb-3 p-0 border-none outline-none focus:text-indigo-600" 
                          value={p.name} 
                          onChange={(e) => {
                             const newP = [...formData.projects];
                             newP[i] = { ...newP[i], name: e.target.value };
                             setFormData({...formData, projects: newP});
                          }} 
                       />
                       <textarea 
                          placeholder="What did you build? (Description)" 
                          className="w-full bg-transparent p-0 border-none outline-none text-gray-500 text-sm h-20 resize-none" 
                          value={p.description} 
                          onChange={(e) => {
                             const newP = [...formData.projects];
                             newP[i] = { ...newP[i], description: e.target.value };
                             setFormData({...formData, projects: newP});
                          }} 
                       />
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* STEP 4: Final Confirmation */}
          {step === 4 && (
            <div className="text-center py-10 animate-in zoom-in duration-500">
              <div className={`w-24 h-24 ${hasPortfolio ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl animate-bounce`}>
                {hasPortfolio ? <Briefcase size={45} /> : <Send size={45} />}
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-3">
                {hasPortfolio ? "Save Your Changes" : "Ready to Go Live!"}
              </h2>
              <p className="text-gray-500 mb-10 max-w-xs mx-auto">
                Double check everything. Once you hit the button below, your profile will be updated instantly.
              </p>
              
              <button 
                onClick={handlePublish} 
                disabled={isLoading} 
                className={`flex items-center justify-center gap-3 mx-auto px-14 py-5 rounded-2xl font-bold text-white shadow-2xl transition-all duration-300 transform ${isLoading ? 'bg-gray-400 cursor-not-allowed scale-95' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 hover:shadow-indigo-300'}`}
              >
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                    </div>
                ) : (
                    <>{hasPortfolio ? "Update My Portfolio" : "Publish Portfolio Now"}</>
                )}
              </button>
            </div>
          )}

          {/* Bottom Navigation Navigation */}
          <div className="mt-16 flex justify-between items-center pt-8 border-t border-gray-100">
            <button 
                type="button" 
                onClick={prevStep} 
                className={`flex items-center gap-2 font-bold transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-indigo-600'}`}
            >
              <ChevronLeft size={20}/> Previous
            </button>

            {step < 4 && (
              <button 
                type="button" 
                onClick={nextStep} 
                className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
              >
                Continue <ChevronRight size={20}/>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}