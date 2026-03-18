import React from 'react'
import { Rocket } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function How_It_Works() {
    const navigate = useNavigate();
    const steps = [
    {
      number: "1",
      title: "Fill Out the Form",
      description: "Enter your personal information, skills, projects, and experience in our simple form."
    },
    {
      number: "2",
      title: "Preview Your Portfolio",
      description: "See exactly how your portfolio will look with our live preview feature."
    },
    {
      number: "3",
      title: "Share Your Link",
      description: "Publish your portfolio and get a unique URL to share with the world."
    }
  ];
  return (
    <section className="bg-[#eff2ff] py-20 px-4 font-sans text-center">
      {/* Header Section */}
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          How It <span className="text-indigo-600">Works</span>
        </h2>
        <p className="text-slate-500 text-lg">
          Creating your portfolio is as easy as 1–2–3. No technical skills required.
        </p>
      </div>

      {/* Steps Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connection Line (Desktop only) */}
        <div className="hidden md:block absolute top-12 left-10 right-10 h-1 bg-indigo-100 -z-0"></div>

        {steps.map((step, index) => (
          <div key={index} className="relative z-10 flex flex-col items-center">
            {/* Number Box */}
            <div className="w-20 h-20 bg-white hover:bg-indigo-600 text-indigo-600 hover:text-white transition duration-250 rounded-2xl shadow-xl flex items-center justify-center mb-6">
              <span className="text-4xl font-bold">{step.number}</span>
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-slate-800 mb-3">{step.title}</h3>
            <p className="text-slate-600 leading-relaxed max-w-xs">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="mt-16">
        <button 
            onClick={() => navigate('/create')}
            className="bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-2 text-white font-medium py-4 px-8 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center mx-auto gap-2">
            <Rocket size={20} fill="white" />
            Get Started Now
        </button>
      </div>
    </section>
  )
}
