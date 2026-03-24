import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Github, Linkedin, Mail, ExternalLink, Globe,
  Briefcase, Sun, Moon, Eye, FileText, Link2,
  ArrowUpRight, MapPin, ChevronDown
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Scroll reveal hook 
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`
    }}>
      {children}
    </div>
  );
}

export default function Portfolio() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading]  = useState(true);
  const [dark, setDark]        = useState(() => localStorage.getItem('theme') === 'dark');
  const [navScrolled, setNavScrolled] = useState(false);
  const heroRef = useRef(null);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Nav shadow on scroll 
  useEffect(() => {
    const handler = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Fetch + view count 
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.post(`${API_URL}/portfolio/${username}/view`);
        setProfile(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [username]);

  // SEO meta 
  useEffect(() => {
    if (!profile) return;
    const d = profile.portfolioData || {};
    const url = window.location.href;
    document.title = `${d.fullName || username} — Portfolio`;

    const setMeta = (name, content, prop = false) => {
      const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let tag = document.querySelector(sel);
      if (!tag) {
        tag = document.createElement('meta');
        prop ? tag.setAttribute('property', name) : tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMeta('description', d.bio || `Portfolio of ${d.fullName}`);
    setMeta('og:title',       `${d.fullName} — ${d.title}`, true);
    setMeta('og:description', d.bio || '', true);
    setMeta('og:image',       d.profileImage || '', true);
    setMeta('og:url',         url, true);
    setMeta('og:type',        'profile', true);
    setMeta('twitter:card',        'summary_large_image');
    setMeta('twitter:title',       `${d.fullName} — ${d.title}`);
    setMeta('twitter:description', d.bio || '');
    setMeta('twitter:image',       d.profileImage || '');

    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [profile]);

  // Loading 
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a]">
      <div className="w-10 h-10 border-2 border-white/10 border-t-indigo-500 rounded-full animate-spin mb-4" />
      <p className="text-white/30 text-xs tracking-[0.3em] uppercase font-mono">Loading</p>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white/40 font-mono text-sm tracking-widest">
      404 — NOT FOUND
    </div>
  );

  const d = profile.portfolioData || {};
  const initials = d.fullName
    ? d.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : username?.slice(0, 2).toUpperCase();

  return (
    <>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: ${dark ? '#0c0c0f' : '#fafaf8'};
        }

        .font-display { font-family: 'DM Serif Display', serif; }
        .font-mono-dm { font-family: 'DM Mono', monospace; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 999px; }

        .skill-chip:hover { transform: translateY(-2px); }
        .project-card:hover .project-arrow { transform: translate(3px,-3px); }

        @keyframes float {
          0%,100% { transform: translateY(0px) rotate(3deg); }
          50%      { transform: translateY(-8px) rotate(3deg); }
        }
        .float { animation: float 5s ease-in-out infinite; }

        @keyframes blink {
          0%,100% { opacity: 1; } 50% { opacity: 0; }
        }
        .cursor { animation: blink 1s step-end infinite; }

        .nav-link { position: relative; }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 1px;
          background: currentColor;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }

        .gradient-text {
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        backgroundColor: dark ? '#0c0c0f' : '#fafaf8',
        color: dark ? '#e8e8e4' : '#1a1a2e',
        transition: 'background-color 0.3s, color 0.3s'
      }}>

        {/* Navebar */}
        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          padding: '0 2rem',
          height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: navScrolled
            ? (dark ? 'rgba(12,12,15,0.92)' : 'rgba(250,250,248,0.92)')
            : 'transparent',
          backdropFilter: navScrolled ? 'blur(16px)' : 'none',
          borderBottom: navScrolled
            ? `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
            : '1px solid transparent',
          transition: 'all 0.4s ease'
        }}>
          {/* Logo */}
          <div style={{
            width: 36, height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'DM Mono, monospace', fontWeight: 500, fontSize: 13,
            color: '#fff', letterSpacing: '0.05em'
          }}>
            {initials}
          </div>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {[
              d.bio        && { label: 'About',      href: '#about'      },
              d.skills?.filter(Boolean).length && { label: 'Skills', href: '#skills' },
              d.experience?.filter(e=>e.company).length && { label: 'Experience', href: '#experience' },
              d.projects?.filter(p=>p.name).length && { label: 'Work', href: '#work' },
              { label: 'Contact', href: '#contact' }
            ].filter(Boolean).map(({ label, href }) => (
              <a key={href} href={href} className="nav-link" style={{
                fontSize: 13, fontWeight: 500, letterSpacing: '0.02em',
                color: dark ? 'rgba(232,232,228,0.6)' : 'rgba(26,26,46,0.5)',
                textDecoration: 'none', transition: 'color 0.2s'
              }}
                onMouseEnter={e => e.target.style.color = dark ? '#fff' : '#1a1a2e'}
                onMouseLeave={e => e.target.style.color = dark ? 'rgba(232,232,228,0.6)' : 'rgba(26,26,46,0.5)'}
              >
                {label}
              </a>
            ))}

            {/* Dark mode toggle */}
            <button onClick={() => setDark(d => !d)} style={{
              width: 36, height: 36,
              borderRadius: 8, border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: dark ? '#e8e8e4' : '#1a1a2e',
              transition: 'all 0.2s'
            }}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section ref={heroRef} style={{
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          maxWidth: 1200, margin: '0 auto', padding: '120px 2rem 80px',
          position: 'relative'
        }}>
          {/* Background number */}
          <div style={{
            position: 'absolute', right: '5%', top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: 'DM Serif Display, serif',
            fontSize: 'clamp(180px, 25vw, 340px)',
            fontWeight: 400, lineHeight: 1,
            color: dark ? 'rgba(99,102,241,0.04)' : 'rgba(99,102,241,0.05)',
            userSelect: 'none', pointerEvents: 'none',
            letterSpacing: '-0.05em'
          }}>01</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
            {/* Text side */}
            <div style={{ flex: '1 1 400px', minWidth: 0 }}>
              {/* Status pill */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 14px', borderRadius: 999,
                border: `1px solid ${dark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)'}`,
                background: dark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)',
                marginBottom: '2rem'
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e',
                  boxShadow: '0 0 0 3px rgba(34,197,94,0.2)' }} />
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11,
                  color: dark ? '#a5b4fc' : '#6366f1', fontWeight: 500, letterSpacing: '0.05em' }}>
                  {profile.viewCount?.toLocaleString()} profile views
                </span>
              </div>

              {/* Name */}
              <h1 className="font-display" style={{
                fontSize: 'clamp(48px, 8vw, 96px)',
                fontWeight: 400, lineHeight: 1.0,
                letterSpacing: '-0.03em', margin: '0 0 1rem',
                color: dark ? '#f0f0ec' : '#0f0f1a'
              }}>
                {d.fullName || username}
              </h1>

              {/* Title */}
              <p style={{
                fontFamily: 'DM Mono, monospace', fontSize: 14,
                color: dark ? '#a5b4fc' : '#6366f1',
                fontWeight: 500, letterSpacing: '0.12em',
                textTransform: 'uppercase', marginBottom: '1.5rem'
              }}>
                {d.title || 'Portfolio'}
              </p>

              {/* Bio snippet */}
              {d.bio && (
                <p style={{
                  fontSize: 17, lineHeight: 1.75, fontWeight: 300,
                  color: dark ? 'rgba(232,232,228,0.55)' : 'rgba(26,26,46,0.55)',
                  maxWidth: 520, marginBottom: '2.5rem'
                }}>
                  {d.bio.length > 160 ? d.bio.slice(0, 160) + '…' : d.bio}
                </p>
              )}

              {/* CTA buttons */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="#work" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 24px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff', textDecoration: 'none',
                  fontSize: 14, fontWeight: 600, letterSpacing: '0.01em',
                  transition: 'opacity 0.2s, transform 0.2s',
                  boxShadow: '0 4px 24px rgba(99,102,241,0.35)'
                }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  View My Work <ArrowUpRight size={15} />
                </a>

                {d.resumeUrl && (
                  <a href={d.resumeUrl} target="_blank" rel="noreferrer" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '12px 24px', borderRadius: 10,
                    border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
                    background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                    color: dark ? '#e8e8e4' : '#1a1a2e', textDecoration: 'none',
                    fontSize: 14, fontWeight: 500, transition: 'all 0.2s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}
                  >
                    <FileText size={14} /> Resume
                  </a>
                )}
              </div>

              {/* Socials */}
              <div style={{ display: 'flex', gap: 10, marginTop: '2rem' }}>
                {[
                  { href: d.contact?.github,   icon: <Github   size={16} />, label: 'GitHub'   },
                  { href: d.contact?.linkedin, icon: <Linkedin size={16} />, label: 'LinkedIn' },
                  { href: d.contact?.website,  icon: <Globe    size={16} />, label: 'Website'  },
                  { href: d.contact?.email ? `mailto:${d.contact.email}` : null, icon: <Mail size={16} />, label: 'Email' },
                ].filter(s => s.href).map(({ href, icon, label }) => (
                  <a key={label} href={href} target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noreferrer" title={label} style={{
                      width: 38, height: 38, borderRadius: 9,
                      border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: dark ? 'rgba(232,232,228,0.6)' : 'rgba(26,26,46,0.5)',
                      textDecoration: 'none', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#6366f1';
                      e.currentTarget.style.color = '#6366f1';
                      e.currentTarget.style.background = dark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.06)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
                      e.currentTarget.style.color = dark ? 'rgba(232,232,228,0.6)' : 'rgba(26,26,46,0.5)';
                      e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)';
                    }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Photo side */}
            {d.profileImage && (
              <div className="float" style={{ flexShrink: 0 }}>
                <div style={{
                  width: 260, height: 320, borderRadius: 24,
                  overflow: 'hidden', transform: 'rotate(3deg)',
                  boxShadow: dark
                    ? '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)'
                    : '0 40px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
                  position: 'relative'
                }}>
                  <img src={d.profileImage} alt={d.fullName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {/* Indigo overlay strip */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: 4, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                  }} />
                </div>
              </div>
            )}
          </div>

          {/* Scroll hint */}
          <div style={{
            position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            opacity: 0.35
          }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9,
              letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
            <ChevronDown size={14} style={{ animation: 'float 2s ease-in-out infinite' }} />
          </div>
        </section>

        {/* About */}
        {d.bio && (
          <section id="about" style={{
            borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            padding: '120px 2rem'
          }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: '4rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <Reveal style={{ flex: '0 0 auto' }}>
                <div>
                  <span className="font-mono-dm" style={{
                    fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
                    color: '#6366f1', display: 'block', marginBottom: 12
                  }}>02 / About</span>
                  <h2 className="font-display" style={{
                    fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 400,
                    lineHeight: 1.1, letterSpacing: '-0.02em',
                    color: dark ? '#f0f0ec' : '#0f0f1a', margin: 0, maxWidth: 280
                  }}>
                    A little about me.
                  </h2>
                </div>
              </Reveal>

              <Reveal delay={150} style={{ flex: '1 1 400px' }}>
                <p style={{
                  fontSize: 19, lineHeight: 1.85, fontWeight: 300,
                  color: dark ? 'rgba(232,232,228,0.65)' : 'rgba(26,26,46,0.65)',
                  marginBottom: '2rem'
                }}>
                  {d.bio}
                </p>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Skills', value: d.skills?.filter(Boolean).length || 0 },
                    { label: 'Projects', value: d.projects?.filter(p=>p.name).length || 0 },
                    { label: 'Roles', value: d.experience?.filter(e=>e.company).length || 0 },
                    { label: 'Profile views', value: profile.viewCount || 0 },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="font-display" style={{
                        fontSize: 40, fontWeight: 400, lineHeight: 1,
                        color: dark ? '#f0f0ec' : '#0f0f1a', marginBottom: 4
                      }}>{value}</div>
                      <div style={{
                        fontFamily: 'DM Mono, monospace', fontSize: 10,
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                        color: dark ? 'rgba(232,232,228,0.35)' : 'rgba(26,26,46,0.35)'
                      }}>{label}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* Skills */}
        {d.skills?.filter(Boolean).length > 0 && (
          <section id="skills" style={{
            padding: '120px 2rem',
            background: dark
              ? 'linear-gradient(180deg, transparent, rgba(99,102,241,0.03), transparent)'
              : 'linear-gradient(180deg, transparent, rgba(99,102,241,0.02), transparent)'
          }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <Reveal>
                <span className="font-mono-dm" style={{
                  fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
                  color: '#6366f1', display: 'block', marginBottom: 12
                }}>03 / Skills</span>
                <h2 className="font-display" style={{
                  fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 400,
                  lineHeight: 1.1, letterSpacing: '-0.02em',
                  color: dark ? '#f0f0ec' : '#0f0f1a', margin: '0 0 3rem'
                }}>
                  What I bring<br /><em>to the table.</em>
                </h2>
              </Reveal>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {d.skills.filter(Boolean).map((skill, i) => (
                  <Reveal key={i} delay={i * 40}>
                    <div className="skill-chip" style={{
                      padding: '10px 20px', borderRadius: 999,
                      border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      background: dark ? 'rgba(255,255,255,0.04)' : '#fff',
                      fontSize: 14, fontWeight: 500,
                      color: dark ? '#e8e8e4' : '#1a1a2e',
                      cursor: 'default', transition: 'all 0.2s',
                      boxShadow: dark ? 'none' : '0 1px 4px rgba(0,0,0,0.04)'
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#6366f1';
                        e.currentTarget.style.background = dark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.05)';
                        e.currentTarget.style.color = '#6366f1';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
                        e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.04)' : '#fff';
                        e.currentTarget.style.color = dark ? '#e8e8e4' : '#1a1a2e';
                      }}
                    >
                      {skill}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Experience */}
        {d.experience?.filter(e => e.company).length > 0 && (
          <section id="experience" style={{
            padding: '120px 2rem',
            borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
          }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <Reveal>
                <span className="font-mono-dm" style={{
                  fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
                  color: '#6366f1', display: 'block', marginBottom: 12
                }}>04 / Experience</span>
                <h2 className="font-display" style={{
                  fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 400,
                  lineHeight: 1.1, letterSpacing: '-0.02em',
                  color: dark ? '#f0f0ec' : '#0f0f1a', margin: '0 0 4rem'
                }}>
                  Where I've<br /><em>worked.</em>
                </h2>
              </Reveal>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {d.experience.filter(e => e.company).map((exp, i) => (
                  <Reveal key={i} delay={i * 80}>
                    <div style={{
                      display: 'grid', gridTemplateColumns: '180px 1fr',
                      gap: '2rem', padding: '2rem 0',
                      borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                      alignItems: 'start'
                    }}>
                      <div>
                        <div className="font-mono-dm" style={{
                          fontSize: 11, letterSpacing: '0.1em',
                          color: dark ? 'rgba(232,232,228,0.35)' : 'rgba(26,26,46,0.35)',
                          textTransform: 'uppercase', lineHeight: 1.6
                        }}>
                          {exp.duration}
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                          <h3 style={{
                            fontFamily: 'DM Serif Display, serif', fontSize: 24,
                            fontWeight: 400, margin: 0,
                            color: dark ? '#f0f0ec' : '#0f0f1a'
                          }}>{exp.company}</h3>
                          <span style={{
                            fontFamily: 'DM Mono, monospace', fontSize: 11,
                            color: '#6366f1', letterSpacing: '0.1em',
                            textTransform: 'uppercase', fontWeight: 500
                          }}>{exp.role}</span>
                        </div>
                        {exp.description && (
                          <p style={{
                            fontSize: 15, lineHeight: 1.7, fontWeight: 300,
                            color: dark ? 'rgba(232,232,228,0.55)' : 'rgba(26,26,46,0.55)',
                            margin: 0
                          }}>{exp.description}</p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects */}
        {d.projects?.filter(p => p.name).length > 0 && (
          <section id="work" style={{
            padding: '120px 2rem',
            borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
          }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <Reveal>
                <span className="font-mono-dm" style={{
                  fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
                  color: '#6366f1', display: 'block', marginBottom: 12
                }}>05 / Work</span>
                <h2 className="font-display" style={{
                  fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 400,
                  lineHeight: 1.1, letterSpacing: '-0.02em',
                  color: dark ? '#f0f0ec' : '#0f0f1a', margin: '0 0 4rem'
                }}>
                  Selected<br /><em>projects.</em>
                </h2>
              </Reveal>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {d.projects.filter(p => p.name).map((p, i) => (
                  <Reveal key={i} delay={i * 60}>
                    <div className="project-card" style={{
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr auto',
                      gap: '2rem', padding: '2rem',
                      borderRadius: 16, cursor: 'default',
                      background: 'transparent',
                      border: `1px solid transparent`,
                      transition: 'all 0.3s ease',
                      alignItems: 'center'
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
                        e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                    >
                      {/* Index */}
                      <div className="font-display" style={{
                        fontSize: 48, fontWeight: 400, lineHeight: 1,
                        color: dark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)',
                        textAlign: 'center'
                      }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>

                      {/* Content */}
                      <div>
                        <h3 style={{
                          fontFamily: 'DM Serif Display, serif', fontSize: 22,
                          fontWeight: 400, margin: '0 0 8px',
                          color: dark ? '#f0f0ec' : '#0f0f1a'
                        }}>{p.name}</h3>

                        {p.description && (
                          <p style={{
                            fontSize: 14, lineHeight: 1.65, fontWeight: 300,
                            color: dark ? 'rgba(232,232,228,0.5)' : 'rgba(26,26,46,0.5)',
                            margin: '0 0 12px', maxWidth: 600
                          }}>{p.description}</p>
                        )}

                        {p.toolsUsed && (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {p.toolsUsed.split(',').map((t, idx) => (
                              <span key={idx} style={{
                                padding: '3px 10px', borderRadius: 999,
                                background: dark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)',
                                color: dark ? '#a5b4fc' : '#6366f1',
                                fontFamily: 'DM Mono, monospace',
                                fontSize: 10, fontWeight: 500,
                                letterSpacing: '0.08em', textTransform: 'uppercase'
                              }}>{t.trim()}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Links */}
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        {(p.projectLink || p.githubLink) && (
                          <a href={p.projectLink || p.githubLink} target="_blank" rel="noreferrer"
                            style={{
                              width: 38, height: 38, borderRadius: 9,
                              border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: dark ? 'rgba(232,232,228,0.5)' : 'rgba(26,26,46,0.4)',
                              textDecoration: 'none', transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; }}
                            onMouseLeave={e => {
                              e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
                              e.currentTarget.style.color = dark ? 'rgba(232,232,228,0.5)' : 'rgba(26,26,46,0.4)';
                            }}
                          ><Link2 size={14} /></a>
                        )}
                        {p.liveDemo && (
                          <a href={p.liveDemo} target="_blank" rel="noreferrer"
                            style={{
                              width: 38, height: 38, borderRadius: 9,
                              border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: dark ? 'rgba(232,232,228,0.5)' : 'rgba(26,26,46,0.4)',
                              textDecoration: 'none', transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; }}
                            onMouseLeave={e => {
                              e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
                              e.currentTarget.style.color = dark ? 'rgba(232,232,228,0.5)' : 'rgba(26,26,46,0.4)';
                            }}
                          ><ExternalLink size={14} /></a>
                        )}
                        <div className="project-arrow" style={{ transition: 'transform 0.25s ease' }}>
                          <ArrowUpRight size={14} style={{ color: dark ? 'rgba(232,232,228,0.2)' : 'rgba(26,26,46,0.15)' }} />
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Footer/Contact */}
        <section id="contact" style={{
          padding: '140px 2rem 80px',
          borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          background: dark
            ? 'linear-gradient(180deg, transparent, rgba(99,102,241,0.04))'
            : 'linear-gradient(180deg, transparent, rgba(99,102,241,0.02))'
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Reveal>
              <span className="font-mono-dm" style={{
                fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
                color: '#6366f1', display: 'block', marginBottom: 12
              }}>06 / Contact</span>
              <h2 className="font-display" style={{
                fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 400,
                lineHeight: 1.0, letterSpacing: '-0.03em',
                color: dark ? '#f0f0ec' : '#0f0f1a', margin: '0 0 0.5rem'
              }}>
                Let's work<br /><em>together.</em>
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <p style={{
                fontSize: 17, fontWeight: 300, lineHeight: 1.7,
                color: dark ? 'rgba(232,232,228,0.45)' : 'rgba(26,26,46,0.45)',
                marginBottom: '3rem', maxWidth: 480
              }}>
                Have a project in mind or want to collaborate? I'd love to hear from you.
              </p>

              {d.contact?.email && (
                <a href={`mailto:${d.contact.email}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  fontFamily: 'DM Serif Display, serif',
                  fontSize: 'clamp(18px, 3vw, 28px)', fontWeight: 400,
                  color: dark ? '#f0f0ec' : '#0f0f1a',
                  textDecoration: 'none',
                  borderBottom: '2px solid #6366f1',
                  paddingBottom: 4, transition: 'opacity 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  {d.contact.email} <ArrowUpRight size={20} />
                </a>
              )}
            </Reveal>

            {/* Bottom bar */}
            <div style={{
              marginTop: '6rem', paddingTop: '2rem',
              borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'DM Mono, monospace', fontSize: 10,
                  color: '#fff', fontWeight: 500
                }}>{initials}</div>
                <span className="font-mono-dm" style={{
                  fontSize: 11, letterSpacing: '0.1em',
                  color: dark ? 'rgba(232,232,228,0.3)' : 'rgba(26,26,46,0.3)'
                }}>
                  /{username}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { href: d.contact?.github,   icon: <Github   size={14} /> },
                  { href: d.contact?.linkedin, icon: <Linkedin size={14} /> },
                  { href: d.contact?.website,  icon: <Globe    size={14} /> },
                ].filter(s => s.href).map(({ href, icon }, i) => (
                  <a key={i} href={href} target="_blank" rel="noreferrer" style={{
                    color: dark ? 'rgba(232,232,228,0.3)' : 'rgba(26,26,46,0.3)',
                    textDecoration: 'none', transition: 'color 0.2s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
                    onMouseLeave={e => e.currentTarget.style.color = dark ? 'rgba(232,232,228,0.3)' : 'rgba(26,26,46,0.3)'}
                  >{icon}</a>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Eye size={12} style={{ color: dark ? 'rgba(232,232,228,0.25)' : 'rgba(26,26,46,0.25)' }} />
                <span className="font-mono-dm" style={{
                  fontSize: 11,
                  color: dark ? 'rgba(232,232,228,0.25)' : 'rgba(26,26,46,0.25)'
                }}>
                  {profile.viewCount?.toLocaleString()} views
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}