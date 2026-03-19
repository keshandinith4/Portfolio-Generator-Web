import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Mail, Code, Briefcase, 
  Plus, Send, ChevronLeft, Rocket 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Create_Portfolio({ setPortfolioData }) {
  const navigate = useNavigate();

  // States
  const [hasPortfolio, setHasPortfolio] = useState(false); 
  const [isEditing, setIsEditing] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    title: '',
    bio: '',
    contact: { email: '', linkedin: '', github: '' },
    skills: ['React', 'JavaScript'],
    projects: [{ name: '', description: '', techStack: '' }]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.portfolioData) {
      setFormData(user.portfolioData);
      setHasPortfolio(true);
    }
  }, []);

  // Form Validation
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

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', techStack: '' }]
    }));
  };

  const handlePublish = async () => {
    setIsLoading(true);
    
    try {

      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      if (!token) {
        alert("කරුණාකර ප්‍රථමයෙන් Login වන්න!");
        navigate('/login');
        return;
      }

      const response = await axios.put(
        'http://localhost:5000/api/portfolio/update', 
        formData, 
        {
          headers: { token: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        setIsLoading(false);
        
        if (setPortfolioData) setPortfolioData(formData);

        const updatedUser = { ...user, portfolioData: formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        alert("Portfolio Published Successfully!");
        setHasPortfolio(true); 
        setIsEditing(false); 
        navigate('/view'); 
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      alert(err.response?.data?.message || "Publish කිරීමේදී දෝෂයක් ඇති විය.");
    }
  };


  // Landing View
  if (!isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl text-center border border-gray-100">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${hasPortfolio ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
            {hasPortfolio ? <Briefcase size={48} /> : <Rocket size={48} />}
          </div>
          <h2 className="text-3xl font-bold mb-3">{hasPortfolio ? "Welcome Back!" : "Get Started"}</h2>
          <p className="text-gray-500 mb-8">Build your professional identity in minutes.</p>
          <button 
            onClick={() => setIsEditing(true)}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${hasPortfolio ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {hasPortfolio ? "Update Portfolio" : "Create Portfolio"}
          </button>
        </div>
      </div>
    );
  }

  // Multi-step Editor View
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative">
      <button onClick={() => setIsEditing(false)} className="absolute top-6 left-10 text-gray-500 hover:text-indigo-600 flex items-center gap-1 font-bold">
        <ChevronLeft size={18} /> Back
      </button>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden mt-10 border border-gray-100">
        <div className="flex bg-gray-100 h-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`flex-1 transition-all duration-500 ${step >= i ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        <div className="p-10">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Step {step}</h1>
            <p className="text-gray-400 font-medium">Please fill in your professional details</p>
          </div>

          <div className="min-h-[300px]">
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-bold mb-4 text-gray-700"><User size={20} className="text-indigo-600" /> Basic Information</div>
                <input 
                  name="username" placeholder="Unique Username" value={formData.username} onChange={handleInputChange}
                  className={`w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors.username ? 'border-red-500' : 'border-gray-200'}`}
                />
                {errors.username && <p className="text-red-500 text-xs ml-2">{errors.username}</p>}
                
                <input 
                  name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <textarea 
                  name="bio" placeholder="Short Professional Bio" value={formData.bio} onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-2xl h-32 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-bold mb-4 text-gray-700"><Mail size={20} className="text-indigo-600" /> Contact Details</div>
                {['email', 'linkedin', 'github'].map((field) => (
                  <input 
                    key={field} name={field} placeholder={field.toUpperCase()}
                    value={formData.contact[field]} onChange={(e) => handleInputChange(e, 'contact')}
                    className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 font-bold text-gray-700"><Code size={20} className="text-indigo-600" /> Featured Projects</div>
                  <button onClick={addProject} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"><Plus size={20}/></button>
                </div>
                <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
                  {formData.projects.map((p, i) => (
                    <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 shadow-sm">
                      <input 
                        placeholder="Project Name" className="w-full bg-transparent font-bold outline-none text-gray-800" 
                        value={p.name} 
                        onChange={(e) => {
                          const newP = [...formData.projects];
                          newP[i].name = e.target.value;
                          setFormData({...formData, projects: newP});
                        }}
                      />
                      <input 
                        placeholder="Tech Stack (e.g. React, Node.js)" className="w-full bg-transparent text-sm outline-none text-indigo-600 font-semibold" 
                        value={p.techStack} 
                        onChange={(e) => {
                          const newP = [...formData.projects];
                          newP[i].techStack = e.target.value;
                          setFormData({...formData, projects: newP});
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">You're All Set!</h2>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Click the button below to publish your portfolio and see the live preview.</p>
                <button 
                  onClick={handlePublish} disabled={isLoading}
                  className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl active:scale-95"
                >
                  {isLoading ? "Publishing..." : "Confirm & Publish"}
                </button>
              </div>
            )}
          </div>

          <div className="mt-12 flex justify-between pt-6 border-t border-gray-100">
            <button onClick={prevStep} className={`font-bold text-gray-400 hover:text-gray-600 ${step === 1 ? 'invisible' : ''}`}>Previous</button>
            {step < 4 && (
              <button onClick={nextStep} className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-md active:scale-95">Next Step</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}