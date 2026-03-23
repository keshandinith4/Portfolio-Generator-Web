import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, User, AtSign } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function Auth_System() {
  const [view, setView] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    username: ''
  });

  useEffect(() => {
    toast.dismiss('username-status');

    if (usernameStatus === 'checking') {
      toast.loading('Checking availability...', { id: 'username-status' });
    } else if (usernameStatus === 'available') {
      toast.success('Username is available', { id: 'username-status' });
    } else if (usernameStatus === 'taken') {
      toast.error('Username already taken', { id: 'username-status' });
    } else if (usernameStatus === 'invalid') {
      toast.error('Only letters, numbers, and underscores allowed', { id: 'username-status' });
    }
  }, [usernameStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'username') {
      setUsernameStatus(null);
      if (value.length < 3) return;

      const isValid = /^[a-zA-Z0-9_]+$/.test(value);
      if (!isValid) return setUsernameStatus('invalid');

      setUsernameStatus('checking');
      clearTimeout(window._usernameTimer);
      window._usernameTimer = setTimeout(async () => {
        try {
          const res = await axios.get(`${API_URL}/auth/check-username?username=${value}`);
          setUsernameStatus(res.data.available ? 'available' : 'taken');
        } catch {
          setUsernameStatus(null);
        }
      }, 500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (view === 'signup' && (usernameStatus === 'taken' || usernameStatus === 'checking' || usernameStatus === 'invalid')) {
      toast.error('Please choose a valid and available username.');
      return;
    }

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
          username: formData.username,
          email: formData.email,
          password: formData.password
        });

        if (res.data?.token) {
          localStorage.setItem('user', JSON.stringify(res.data));
          localStorage.setItem('token', res.data.token);
          navigate('/create');
        } else {
          toast.success('Registration successful! Please login.');
          setView('login');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  const getUsernameBorderClass = () => {
    if (usernameStatus === 'taken' || usernameStatus === 'invalid') return 'border-red-400';
    if (usernameStatus === 'available') return 'border-green-400';
    return 'border-gray-200';
  };

  const UsernameHint = () => {
    if (usernameStatus === 'checking') return <p className="text-xs text-gray-400 mt-1 ml-1">Checking availability...</p>;
    if (usernameStatus === 'available') return <p className="text-xs text-green-500 mt-1 ml-1">✓ Username is available</p>;
    if (usernameStatus === 'taken')     return <p className="text-xs text-red-500 mt-1 ml-1">✗ Username already taken</p>;
    if (usernameStatus === 'invalid')   return <p className="text-xs text-red-500 mt-1 ml-1">✗ Only letters, numbers, and underscores allowed</p>;
    return null;
  };

  const isRegisterDisabled = isLoading || usernameStatus === 'taken' || usernameStatus === 'checking' || usernameStatus === 'invalid';

  return (
    <>
      {/* react-hot-toast container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            fontWeight: '500',
            fontSize: '14px',
          },
          success: {
            style: { background: '#22c55e', color: '#fff' },
            iconTheme: { primary: '#fff', secondary: '#22c55e' },
          },
          error: {
            style: { background: '#ef4444', color: '#fff' },
            iconTheme: { primary: '#fff', secondary: '#ef4444' },
          },
          loading: {
            style: { background: '#64748b', color: '#fff' },
            iconTheme: { primary: '#fff', secondary: '#64748b' },
          },
        }}
      />

      <div className="min-h-screen w-full flex items-center justify-center p-6 relative bg-slate-50 overflow-hidden">
        <div className="w-full max-w-[480px] relative z-10">
          <div className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[3rem] shadow-xl p-8 md:p-12 border-t-white">

            {/* Login */}
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
                      <input
                        name="email" type="email" autoComplete="off"
                        value={formData.email} onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 ml-1 uppercase">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                      <input
                        name="password" type={showPassword ? 'text' : 'password'}
                        value={formData.password} autoComplete="off" onChange={handleChange}
                        className="w-full pl-10 pr-12 py-3 bg-white/70 border border-gray-200 rounded-xl outline-none"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400 z-30">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button disabled={isLoading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50">
                    {isLoading ? 'Verifying...' : 'Sign In'}
                  </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                  New user?{' '}
                  <button onClick={() => setView('signup')} className="text-indigo-600 font-bold hover:underline">
                    Create Account
                  </button>
                </p>
              </div>

            ) : (
              /* Signup */
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex gap-3">
                    <div className="relative w-1/2">
                      <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                      <input
                        name="firstName" placeholder="First Name"
                        value={formData.firstName} onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl outline-none"
                        required
                      />
                    </div>
                    <input
                      name="lastName" placeholder="Last Name"
                      value={formData.lastName} onChange={handleChange}
                      className="w-1/2 px-4 py-3 bg-white/70 border border-gray-200 rounded-xl outline-none"
                      required
                    />
                  </div>

                  <div>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-3.5 text-gray-400" size={18} />
                      <input
                        name="username"
                        placeholder="Username (e.g. john_doe)"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 bg-white/70 border rounded-xl outline-none transition-colors ${getUsernameBorderClass()}`}
                        required
                      />
                    </div>
                    <UsernameHint />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input
                      name="email" type="email" placeholder="Email"
                      value={formData.email} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl outline-none"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input
                      name="password" type={showPassword ? 'text' : 'password'}
                      placeholder="Password" value={formData.password} onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/70 border border-gray-200 rounded-xl outline-none"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400 z-30">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <button
                    disabled={isRegisterDisabled}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Registering...' : 'Register Now'}
                  </button>
                </form>

                <button onClick={() => setView('login')} className="w-full text-center text-sm text-gray-500 font-bold">
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}