import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function Auth_System() {
  const [view, setView] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (view === 'login') {
        const res = await axios.post(`${API_URL}/auth/login`, {
          email: formData.email,
          password: formData.password
        });
        
        localStorage.setItem('user', JSON.stringify(res.data));
        localStorage.setItem('token', res.data.token); 

        if (res.data.hasPortfolio) {
          navigate(`/portfolio/${res.data.username}`); 
        } else {
          navigate('/create'); 
        }

      } else if (view === 'signup') {
        const res = await axios.post(`${API_URL}/auth/register`, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        });
        
        if (res.data && res.data.token) {
          localStorage.setItem('user', JSON.stringify(res.data));
          localStorage.setItem('token', res.data.token);
          navigate('/create'); 
        } else {
          alert("Registration Success! Please Login.");
          setView('login');
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative bg-slate-50 overflow-hidden">
      <div className="w-full max-w-[480px] relative z-10">
        <div className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[3rem] shadow-xl p-8 md:p-12 border-t-white">
          
          {view === 'login' ? (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="text-center">
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
                <p className="text-gray-500 mt-2">Enter your credentials to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 ml-1 uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input name="email" type="email" autoComplete='new_email' value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl outline-none" required />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 ml-1 uppercase">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      value={formData.password}
                      autoComplete='new_password' 
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/70 border border-gray-200 rounded-xl outline-none" required 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400 z-30">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button disabled={isLoading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">
                  {isLoading ? "Verifying..." : "Sign In"}
                </button>
              </form>
              <p className="text-center text-sm text-gray-600">
                New user? <button onClick={() => setView('signup')} className="text-indigo-600 font-bold hover:underline">Create Account</button>
              </p>
            </div>
          ) : (
            /* Signup View */
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-3">
                  <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="w-1/2 px-4 py-3 bg-white/70 border border-gray-200 rounded-xl outline-none" required />
                  <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="w-1/2 px-4 py-3 bg-white/70 border border-gray-200 rounded-xl outline-none" required />
                </div>
                <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl outline-none" required />
                <div className="relative">
                  <input 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={handleChange}
                    className="w-full px-4 pr-12 py-3 bg-white/70 border border-gray-200 rounded-xl outline-none" required 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400 z-30">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <button disabled={isLoading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all">
                  {isLoading ? "Registering..." : "Register Now"}
                </button>
              </form>
              <button onClick={() => setView('login')} className="w-full text-center text-sm text-gray-500 font-bold">Back to Login</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}