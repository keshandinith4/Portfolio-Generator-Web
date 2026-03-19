import { useState, useEffect } from "react";
import { Rocket, Eye, Check, Link2, SquarePen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 100% 50%, #e8e6f8 0%, #f3f2fc 40%), radial-gradient(ellipse at 0% 90%, #d4f5e2 0%, transparent 50%)",
      }}
    >
      {/* Background blobs */}
      <div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #a8f0c6 0%, transparent 70%)",
          filter: "blur(48px)",
          opacity: 0.6,
        }}
      />
      <div
        className="absolute top-10 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #c7c2f5 0%, transparent 70%)",
          filter: "blur(64px)",
          opacity: 0.5,
        }}
      />

      {/* Content */}
      <div 
        className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-28 pb-32 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        {/* LEFT */}
        <div
          className="flex-1 flex flex-col gap-6 max-w-xl"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-indigo-100 backdrop-blur-sm shadow-sm text-sm font-medium text-indigo-600">
              <Rocket 
                size={16} 
                className="text-indigo-500" 
                fill="currentColor"
              />
            No coding required
          </div>

          {/* Heading */}
          <h1
            className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight text-gray-900"
            style={{ fontFamily: "sans-serif " }}
          >
            Build Your
            <br />
            Developer{" "}
            <span className="text-indigo-500 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Portfolio</span>
            <br />
            in Minutes
          </h1>

          {/* Subtitle */}
          <p 
            className="text-gray-500 text-base sm:text-lg leading-relaxed">
              Create a stunning, professional portfolio website without writing a
              single line of code. Just fill out your details and get a shareable
              link instantly.
          </p>

          {/* Buttons */}
          <div 
            className="flex flex-wrap items-center gap-4 mt-2">
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200">
                <SquarePen size={16} strokeWidth={3} />
                  Create Portfolio Free
              </button>

              <button 
                className="flex items-center gap-2 border-2 border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-600 font-semibold px-6 py-3 rounded-xl transition-all duration-200 bg-white/60 backdrop-blur-sm">
                <Eye size={16} />
                  View Examples
              </button>
          </div>
        </div>

        {/* RIGHT Mockup */}
        <div
          className="flex-1 relative flex justify-center lg:justify-end"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
          }}
        >
          {/* Image frame */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            style={{ width: "100%", maxWidth: 520, aspectRatio: "16/10" }}
          >
            <img
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=80"
              alt="Portfolio builder preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* S-Curve Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="relative block w-full h-[80px] lg:h-[120px]"
        >
          <path
            d="M0,80 C360,-80 1080,250 1440,80 L1440,160 L0,160 Z"
            fill="#f8fafc" 
          />
        </svg>
      </div>
  </section>
  );
}