import React, { useState } from 'react';
import { 
  User, Mail, Code, Briefcase, 
  Plus, Trash2, Send, ChevronRight, ChevronLeft, Rocket 
} from 'lucide-react';

export default function Create_Portfolio() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    title: '',
    bio: '',
    profileImage: '',
    contact: { email: '', linkedin: '', github: '', website: '' },
    skills: [''],
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
      alert("Portfolio Published Successfully!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 mt-10 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        
        {/* Progress Bar */}
        <div className="flex bg-gray-100 h-1.5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`flex-1 transition-all duration-500 ${step >= i ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Create Your Portfolio</h1>
            <p className="text-gray-500 font-medium">Step {step} of 4</p>
          </div>

          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-2">
                <User size={20} /> Personal Information
              </div>
              <input 
                type="text" name="username" placeholder="Unique Username"
                value={formData.username} onChange={handleInputChange}
                className={`w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors.username ? 'border-red-500' : 'border-gray-200'}`}
              />
              <input 
                type="text" name="fullName" placeholder="Full Name"
                value={formData.fullName} onChange={handleInputChange}
                className={`w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`}
              />
              <input 
                type="text" name="title" placeholder="Title (e.g. Full Stack Developer)"
                value={formData.title} onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea 
                name="bio" placeholder="Brief Bio"
                value={formData.bio} onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-xl h-28 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* STEP 2: Contact & Skills */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-2">
                  <Mail size={20} /> Contact & Skills
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {['email', 'linkedin', 'github'].map((f) => (
                   <input 
                     key={f} 
                     type={f === 'email' ? 'email' : 'text'} 
                     placeholder={f.charAt(0).toUpperCase() + f.slice(1)} 
                     name={f} 
                     value={formData.contact[f]} 
                     onChange={(e) => handleInputChange(e, 'contact')} 
                     className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border-gray-200" 
                    />
                  ))}
                </div>
              
                <div className="pt-4">
                  <h3 className="font-medium text-gray-700 mb-3">Skills</h3>
                 <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                        <input 
                          value={skill} 
                         onChange={(e) => {
                            const newSkills = [...formData.skills];
                            newSkills[index] = e.target.value;
                            setFormData({...formData, skills: newSkills});
                          }}
                          className="bg-transparent outline-none text-indigo-700 text-sm font-semibold w-20"
                        />
                       <Trash2 size={14} className="text-red-400 cursor-pointer hover:text-red-600" onClick={() => removeListItem(index, 'skills')} />
                      </div>
                    ))}
                    <button type="button" onClick={() => addListItem('skills', '')} className="text-indigo-600 text-sm font-bold hover:underline">+ Add Skill</button>
                  </div>
                </div>
              </div>
            )}

          {/* STEP 3: Projects & Experience */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold"><Code size={20}/> Projects</div>
                  <button type="button" onClick={() => addListItem('projects', { name: '', description: '', techStack: '', githubLink: '', liveDemo: '' })} className="bg-indigo-600 text-white p-1.5 rounded-lg hover:bg-indigo-700 shadow-md transition-all"><Plus size={18}/></button>
               </div>
               
               {formData.projects.map((p, i) => (
                 <div key={i} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl relative group transition-all hover:shadow-md">
                    <button onClick={() => removeListItem(i, 'projects')} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                    <input 
                      placeholder="Project Name" 
                      className="w-full mb-3 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                      value={p.name} 
                      onChange={(e) => {
                        const newP = [...formData.projects];
                        newP[i] = { ...newP[i], name: e.target.value }; // Correct way to update
                        setFormData({...formData, projects: newP});
                      }}
                    />
                    <textarea 
                      placeholder="Description" 
                      className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-20" 
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
          )}

          {/* STEP 4: Final Confirmation */}
          {step === 4 && (
            <div className="text-center py-10 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Send size={38} />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Ready to Publish!</h2>
              <p className="text-gray-500 mb-10 max-w-sm mx-auto">Please review your information. Once you click publish, your portfolio will be saved.</p>
              
              <button 
                onClick={handlePublish}
                disabled={isLoading}
                className={`flex items-center justify-center gap-3 mx-auto px-12 py-4 rounded-2xl font-bold text-white shadow-xl transition-all duration-300 ${isLoading ? 'bg-indigo-400 cursor-not-allowed scale-95' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-200'}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Rocket size={20} />
                    Publish Portfolio
                  </>
                )}
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12 flex justify-between pt-8 border-t border-gray-100">
            <button 
              type="button"
              onClick={prevStep} 
              className={`flex items-center gap-2 font-bold transition-colors ${step === 1 ? 'invisible' : 'text-gray-400 hover:text-gray-700'}`}
            >
              <ChevronLeft size={20}/> Previous
            </button>
            
            {step < 4 && (
              <button 
                type="button"
                onClick={nextStep} 
                className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95"
              >
                Next <ChevronRight size={20}/>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}