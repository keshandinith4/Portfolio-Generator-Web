import React from 'react'
import { SquarePen } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function Footer() {
    const navigate = useNavigate();

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%)"
        }}/>

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                Ready to Build Your Portfolio?
            </h2>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Stop struggling with complex website builders. Create a stunning 
                developer portfolio in minutes completely free.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate('/create')}
                    className="flex items-center gap-2 bg-white text-indigo-600 font-bold hover:bg-indigo-600 hover:text-white px-8 py-4 rounded-xl shadow-lg hover:bg-gray-50 transition-all active:scale-95 text-lg">
                    <SquarePen size={16} strokeWidth={3} />
                        Create Your Portfolio
                </button>
          
                <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/40 transition-all transition duration-700 active:scale-95 text-lg">
                    Learn More
                </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-white/80 font-medium">
                <span>Free forever</span>
                <span className="opacity-40">•</span>
                <span>Set up in 5 minutes</span>
            </div>
        
                {/* Bottom Section */}
            <div className="mt-5 border-t border-indigo-600 md:flex-row justify-between text-center">
                <p className="text-sm mt-5">
                    © 2026 Portfolio Generator. All rights reserved. <br /> Developed By Keshan Jayaweera
                </p>
            </div>
        </div>
    </section>
  )
}
