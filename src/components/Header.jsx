import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const sections = [
    { label: "Browse Portfolios", href: "#browse" },
    { label: "About", href: "#about" },
    { label: "Documentation", href: "#documentation" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      let current = "";

      sections.forEach((section) => {
        const element = document.querySelector(section.href);
        if (element) {
          const offsetTop = element.offsetTop;
          if (scrollPosition >= offsetTop) {
            current = section.label;
          }
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-16 py-5 bg-white border-b border-gray-100">
      {/* Logo Section */}
      <div className="flex items-center">
        <span className="font-bold text-3xl md:text-4xl text-[#2D3748] tracking-tight">
          Portfolio <span className="text-[#4A90E2]">Generator</span>
        </span>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex items-center gap-10">
        <div className="flex items-center gap-8 text-[16px] font-medium text-gray-500">
          {sections.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className={`transition duration-200 hover:text-gray-900 ${
                item.label === activeSection ? "text-indigo-600" : ""
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Action Button */}
        <a
          href="#build"
          className="bg-[#6366F1] hover:bg-[#5558E3] text-white font-bold text-[15px] px-7 py-3 rounded-lg transition duration-200 shadow-md"
        >
          Build My Portfolio
        </a>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden text-gray-700"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <nav className="absolute top-full left-0 w-full bg-white shadow-xl flex flex-col items-center gap-4 py-8 lg:hidden border-t">
          {sections.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="text-lg font-medium text-gray-600"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#build"
            className="mt-4 bg-[#6366F1] text-white font-bold px-8 py-3 rounded-lg"
            onClick={() => setMenuOpen(false)}
          >
            Build My Portfolio
          </a>
        </nav>
      )}
    </header>
  );
}