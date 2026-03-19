import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, ShieldCheck, Eye, EyeOff, Github, Chrome } from 'lucide-react';

export default function Auth_System() {
  const [view, setView] = useState('login');
  const [showPassword, setShowPassword] = useState(false); // Password hide/show state
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  // Numbers (digits) 
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'password') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: onlyNums });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (view === 'login') {
      localStorage.setItem('token', 'sample-jwt-123');
      alert("Login Successful!");
      navigate('/create');
    } else {
      alert("Success!");
      setView('login');
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'login':
        return (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
              <p className="text-gray-500 mt-2">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input 
                    name="email" type="email" placeholder="email@example.com" 
                    value={formData.email} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wider">Password (Digits Only)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter numbers" 
                    value={formData.password} 
                    onChange={handleChange}
                    inputMode="numeric"
                    className="w-full pl-10 pr-12 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono" required 
                  />
                  {/* Show/Hide Button */}
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => setView('forgot')} className="text-sm font-semibold text-indigo-600 hover:underline">Forgot Password?</button>
              </div>

              <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 shadow-xl transition-all active:scale-95 transform">
                Sign In
              </button>
            </form>

            <p className="text-center text-sm text-gray-600">
              New user? <button onClick={() => setView('signup')} className="text-indigo-600 font-bold hover:underline">Create Account</button>
            </p>
          </div>
        );

      case 'signup':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
              <p className="text-gray-500 mt-2">Start building your profile</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3">
                <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="w-1/2 px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="w-1/2 px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
              <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
              
              <div className="relative">
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password (Digits only)" 
                  value={formData.password} 
                  onChange={handleChange}
                  inputMode="numeric"
                  className="w-full px-4 pr-12 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono" required 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400">
                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg transition-all active:scale-95">
                Register Now
              </button>
            </form>
            <button onClick={() => setView('login')} className="w-full text-center text-sm text-gray-500 font-bold hover:text-indigo-600">Back to Login</button>
          </div>
        );

      case 'forgot':
        return (
          <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-inner">
               <ShieldCheck className="text-indigo-600" size={36} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
            <p className="text-gray-500 text-sm px-6">We will send a numeric recovery code to your registered email address.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="email" type="email" placeholder="Your Email Address" onChange={handleChange} className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
              <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all">Send Reset Link</button>
            </form>
            <button onClick={() => navigate('/create-portfolio')} className="text-sm font-bold text-gray-400 hover:text-indigo-600">Return to Login</button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative bg-slate-50 overflow-hidden font-sans">
      {/* Soft Background Blurs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-100 rounded-full blur-[150px] opacity-60"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-50 rounded-full blur-[150px] opacity-60"></div>

      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-all font-bold z-20 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
      </button>

      {/* Auth Card */}
      <div className="w-full max-w-[480px] relative z-10">
        <div className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-12 overflow-hidden border-t-white">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}