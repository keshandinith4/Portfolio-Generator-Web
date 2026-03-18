import { useState, useEffect } from "react";
import { Rocket, Eye, Check, Link2, SquarePen } from "lucide-react";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 100% 50%, #e8e6f8 0%, #f3f2fc 40%, #ffffff 70%), radial-gradient(ellipse at 0% 90%, #d4f5e2 0%, transparent 50%)",
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

        {/* ── LEFT ── */}
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
            <span className="text-indigo-500">Portfolio</span>
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
                className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200">
                <SquarePen size={16} strokeWidth={3} />
                  Create Portfolio Free
              </button>

              <button 
                className="flex items-center gap-2 border-2 border-gray-300 hover:border-indigo-400 text-gray-700 hover:text-indigo-600 font-semibold px-6 py-3 rounded-xl transition-all duration-200 bg-white/60 backdrop-blur-sm">
                <Eye size={16} />
                  View Examples
              </button>
          </div>
        </div>

        {/* ── RIGHT — Mockup ── */}
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

          {/* Floating badge — Portfolio Created */}
          <div
            className="absolute top-6 left-2 lg:-left-6 flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-xl border border-gray-100"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-16px)",
              transition: "opacity 0.6s ease 0.45s, transform 0.6s ease 0.45s",
            }}
          >
            <div 
              className="flex-shrink-0 w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                <Check size={14} className="text-green-600" strokeWidth={3} />
            </div>
            <div>
              <p 
                className="text-xs font-bold text-gray-800 leading-tight">Portfolio Created!</p>
              <p className="text-xs text-gray-400 leading-tight">Your site is ready</p>
            </div>
          </div>

          {/* Floating badge — Shareable Link */}
          <div
            className="absolute bottom-6 right-2 lg:-right-6 flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-xl border border-gray-100"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(16px)",
              transition: "opacity 0.6s ease 0.6s, transform 0.6s ease 0.6s",
            }}
          >
            <div 
              className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                <Link2 size={13} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 leading-tight">Shareable Link</p>
              <p className="text-xs text-indigo-500 leading-tight">yoursite.com/portfolio</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Wave Curve ── */}
      <div 
        className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 80"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-16 sm:h-20"
          >
            <path
              d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
              fill="#ffffff"
            />
          </svg>
      </div>
    </section>
  );
}