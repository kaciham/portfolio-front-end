import React, { useRef, useEffect, useState, useCallback } from 'react';
import Cal, { getCalApi } from "@calcom/embed-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import githubLogo from '../assets/icons/github.svg';
import linkedinLogo from '../assets/icons/linkedin.svg';
import cvLogo from '../assets/icons/cv.svg';
import calendarLogo from '../assets/icons/calendar.svg';
import contactLogo from '../assets/icons/email.svg';
import upArrow from '../assets/icons/up-arrow.svg';
import ImageComponent from '../components/ImageComponent';
import TopIcon from '../components/TopIcon';
import Loader from '../components/Loader';
import { useMultipleLoading } from '../hooks/useLoading';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { getUserData, sendContactForm } from '../api/apiCalls';
import { getSkillFallbackImage, getOptimizedImageUrl, preloadImages, getImageUrl } from '../utils/imageHelpers';
import { API_BASE_URL } from '../config/apiConfig';

// ─── Ambient Background ────────────────────────────────────────────
const AmbientBackground = () => (
  <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0a0a0f_0%,#050506_50%,#020203_100%)]" />
    <div className="ambient-blob w-[900px] h-[1400px] top-[-20%] left-1/2 -translate-x-1/2 bg-[#5E6AD2] opacity-[0.08] animate-float-slow" />
    <div className="ambient-blob w-[600px] h-[800px] top-[10%] left-[-10%] bg-[#7c3aed] opacity-[0.05] animate-float-medium" />
    <div className="ambient-blob w-[500px] h-[700px] top-[20%] right-[-10%] bg-[#4f46e5] opacity-[0.04] animate-float-fast" />
    <div className="ambient-blob w-[400px] h-[400px] bottom-[10%] left-1/3 bg-[#5E6AD2] opacity-[0.06] animate-pulse-glow" />
    <div className="noise-overlay" />
    <div className="grid-overlay" />
  </div>
);

// ─── Section Label ─────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <span className="text-xs font-mono tracking-widest uppercase text-linear-accent/80 mb-4 block">
    {children}
  </span>
);

// ─── Spotlight Card ────────────────────────────────────────────────
const SpotlightCard = ({ children, className = '' }) => {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] shadow-card hover:shadow-card-hover hover:border-white/[0.1] transition-all duration-300 group ${className}`}
      style={{ '--spotlight-x': '50%', '--spotlight-y': '50%' }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(300px circle at var(--spotlight-x) var(--spotlight-y), rgba(94,106,210,0.12), transparent 70%)' }}
      />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent rounded-t-2xl" />
      <div className="relative z-[2]">{children}</div>
    </div>
  );
};

// ─── Social Link Button ────────────────────────────────────────────
const SocialButton = ({ href, onClick, icon, label, title }) => {
  const base = "w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.06] hover:bg-white/[0.08] hover:border-linear-borderAccent hover:-translate-y-1 transition-all duration-200";
  if (onClick) {
    return <button onClick={onClick} aria-label={label} title={title} className={base}>{icon}</button>;
  }
  return <a href={href} target="_blank" rel="noreferrer" aria-label={label} title={title} className={base}>{icon}</a>;
};

// ─── Home ──────────────────────────────────────────────────────────
const Home = () => {
  const apiUrl = API_BASE_URL;
  const { isLoading: isMultiLoading, getMessage, withLoading } = useMultipleLoading();
  const isOnline = useNetworkStatus();

  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const projetRef = useRef(null);

  const [userData, setUserData] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ firstName: '', lastName: '', contactSecondMail: '', text: '', emailContact: '' });
  const [showTopIcon, setShowTopIcon] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showOnlyAI, setShowOnlyAI] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [heroScale, setHeroScale] = useState(1);

  const handleScroll = useCallback((ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Parallax hero + top icon
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / (window.innerHeight * 0.5), 1);
      setHeroOpacity(1 - progress);
      setHeroScale(1 - progress * 0.05);
      setShowTopIcon(scrollY > 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-dismiss messages
  useEffect(() => {
    if (!successMessage && !errorMessage) return;
    const timer = setTimeout(() => { setSuccessMessage(''); setErrorMessage(''); }, 4000);
    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  // Scroll reveal
  useEffect(() => {
    const reveal = () => {
      document.querySelectorAll('[data-scroll]').forEach(el => {
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.85) {
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-6');
        }
      });
    };
    reveal();
    window.addEventListener('scroll', reveal, { passive: true });
    return () => window.removeEventListener('scroll', reveal);
  }, []);

  // Cal.com
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  // Fetch data
  const fetchProjects = useCallback(async () => {
    try {
      const result = await withLoading('userData', async () => {
        const response = await getUserData();
        if (response.error) throw new Error(response.error);
        return response.data;
      }, 'Chargement des données...');
      if (result.portfolios?.length > 0) {
        setUserData([result.portfolios[0]]);
        if (result.portfolios[0].jobs) setJobs(result.portfolios[0].jobs.map(j => j.title));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Erreur lors du chargement des données');
    }
  }, [withLoading]);

  useEffect(() => {
    if (!isOnline) { setErrorMessage('Pas de connexion internet.'); }
    else if (userData.length === 0) { fetchProjects(); }
  }, [isOnline, userData.length, fetchProjects]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  // Preload skill images
  useEffect(() => {
    if (userData.length > 0 && userData[0].skills) {
      const urls = userData[0].skills.map(s => s.logo ? getOptimizedImageUrl(apiUrl, s.logo, { width: 56, height: 56 }) : null).filter(Boolean);
      if (urls.length > 0) preloadImages(urls);
    }
  }, [userData, apiUrl]);

  // Typing effect
  useEffect(() => {
    if (jobs.length === 0) return;
    const job = jobs[currentIndex];
    if (currentLetterIndex < job.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + job[currentLetterIndex]);
        setCurrentLetterIndex(prev => prev + 1);
      }, 80);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % jobs.length);
        setDisplayedText('');
        setCurrentLetterIndex(0);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [currentLetterIndex, currentIndex, jobs]);

  // Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOnline) { setErrorMessage('Pas de connexion internet.'); contactRef.current.scrollIntoView({ behavior: 'smooth' }); return; }
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.contactSecondMail.trim()) newErrors.contactSecondMail = "L'email est requis";
    if (!formData.text) newErrors.text = 'Votre message est requis';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) { contactRef.current.scrollIntoView({ behavior: 'smooth' }); return; }
    try {
      await withLoading('contactForm', async () => {
        const response = await sendContactForm(formData);
        if (response.error) throw new Error(response.error);
        return response.data;
      }, 'Envoi en cours...');
      setSuccessMessage('Votre message a bien été envoyé !');
      setErrorMessage('');
      setFormData({ firstName: '', lastName: '', contactSecondMail: '', text: '', emailContact: 'kacihamroun@outlook.com' });
      setErrors({});
    } catch (error) {
      setErrorMessage("Erreur lors de l'envoi. Veuillez réessayer.");
      setSuccessMessage('');
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name !== 'text' ? value.trim() : value }));
  }, []);

  // SEO
  const generateSEOData = useCallback(() => {
    if (userData.length === 0) return {};
    const data = userData[0];
    const fullName = `${data.firstName} ${data.lastName}`;
    const skills = data.skills?.map(s => s.name).join(', ') || '';
    return {
      title: `${fullName} - Développeur Full-Stack & Automatisation IA | Lille 59000`,
      description: `${fullName}, développeur full-stack spécialisé en automatisation IA à Lille. Expert en ${skills}. ${data.bio?.substring(0, 100)}...`,
      keywords: `développeur full-stack, automatisation IA, ${skills}, développeur web Lille, ${data.firstName} ${data.lastName}`,
      canonical: "https://www.kacihamroun.com",
      ogImage: data.profilePic ? (data.profilePic.startsWith('http') ? data.profilePic : `https://www.kacihamroun.com${data.profilePic}`) : "https://www.kacihamroun.com/images/kaci-hamroun-og.jpg",
      jsonLd: {
        "@context": "https://schema.org", "@type": "Person", "name": fullName, "givenName": data.firstName, "familyName": data.lastName,
        "jobTitle": "Développeur Full-Stack & Spécialiste Automatisation IA", "description": data.bio, "url": "https://www.kacihamroun.com",
        "image": data.profilePic ? (data.profilePic.startsWith('http') ? data.profilePic : `https://www.kacihamroun.com${data.profilePic}`) : "https://www.kacihamroun.com/images/kaci-hamroun-profile.jpg",
        "address": { "@type": "PostalAddress", "addressLocality": "Lille", "postalCode": "59000", "addressRegion": "Hauts-de-France", "addressCountry": "FR" },
        "sameAs": [data.linkedinUrl, data.githubUrl].filter(Boolean),
        "knowsAbout": data.skills?.map(s => s.name) || [],
        "worksFor": { "@type": "Organization", "name": "Freelance" }
      }
    };
  }, [userData]);

  const seoData = generateSEOData();
  const toTop = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), []);
  const inputClass = "w-full bg-[#0F0F12] border border-white/[0.1] rounded-lg py-3 px-4 text-linear-fg placeholder-gray-500 focus:outline-none focus:border-linear-accent focus:ring-1 focus:ring-linear-accent/30 transition-all duration-200 text-sm";

  // Sanitize project description (content comes from own backend API)
  const createDescriptionMarkup = (html) => ({ __html: html });

  return (
    <div className="w-full overflow-x-hidden bg-[#050506] text-linear-fg relative">
      <AmbientBackground />
      <SEO title={seoData.title} description={seoData.description} keywords={seoData.keywords} canonical={seoData.canonical} ogImage={seoData.ogImage} jsonLd={seoData.jsonLd} />
      <Navbar handleScroll={handleScroll} refs={{ homeRef, aboutRef, projetRef, contactRef }} />

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <main className="relative z-10">
        <section ref={homeRef} className="min-h-screen flex flex-col justify-center items-center px-4 relative" style={{ opacity: heroOpacity, transform: `scale(${heroScale})` }}>
          {isMultiLoading('userData') ? (
            <div className="flex flex-col items-center gap-4">
              <Loader type="spinner" size="large" color="blue" />
              <p className="text-sm text-linear-muted">{getMessage('userData') || 'Chargement...'}</p>
            </div>
          ) : userData.length > 0 ? userData.map((data) => (
            <div key={data._id} className="flex flex-col items-center gap-8 max-w-3xl">
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.03em] leading-none text-center gradient-text">
                {data.firstName} {data.lastName}
              </h1>
              <div className="h-12 flex items-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-center gradient-text-accent">
                  {displayedText}
                  <span className="inline-block w-0.5 h-6 ml-1 bg-linear-accent animate-pulse" />
                </h2>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <SocialButton href={data.linkedinUrl} icon={<ImageComponent src={linkedinLogo} className="w-5 h-5" alt="LinkedIn" width={20} height={20} />} label="LinkedIn" title="LinkedIn" />
                <SocialButton href={data.githubUrl} icon={<ImageComponent src={githubLogo} className="w-5 h-5" alt="GitHub" width={20} height={20} />} label="GitHub" title="GitHub" />
                <SocialButton href={getImageUrl(apiUrl, data.resumePdf)} icon={<ImageComponent src={cvLogo} className="w-5 h-5" alt="CV" width={20} height={20} />} label="CV" title="Télécharger le CV" />
                <SocialButton href={data.scheduleUrl} icon={<ImageComponent src={calendarLogo} className="w-5 h-5" alt="Calendrier" width={20} height={20} />} label="Rendez-vous" title="Prendre rendez-vous" />
                <SocialButton onClick={() => handleScroll(contactRef)} icon={<ImageComponent src={contactLogo} className="w-5 h-5" alt="Contact" width={20} height={20} />} label="Contact" title="Me contacter" />
              </div>
              <button onClick={() => handleScroll(aboutRef)} className="mt-12 text-linear-muted hover:text-linear-accent transition-colors duration-200" aria-label="Défiler vers la section suivante">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13l5 5 5-5M7 6l5 5 5-5" /></svg>
              </button>
            </div>
          )) : (
            <div className="flex flex-col items-center gap-4"><Loader type="spinner" size="large" color="blue" /></div>
          )}
        </section>

        {/* ═══════════════════════ ABOUT ═══════════════════════ */}
        <section ref={aboutRef} className="relative z-10 py-16 md:py-32 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 opacity-0 translate-y-6 transition-all duration-700" data-scroll>
              <SectionLabel>À propos</SectionLabel>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight gradient-text">Qui suis-je</h2>
            </div>
            {isMultiLoading('userData') ? (
              <div className="flex flex-col items-center gap-4"><Loader type="dots" size="medium" /><p className="text-sm text-linear-muted">{getMessage('userData') || 'Chargement...'}</p></div>
            ) : userData.map((data) => (
              <div key={data._id} className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-0 translate-y-6 transition-all duration-700" data-scroll>
                <SpotlightCard className="p-6 md:p-8">
                  <SectionLabel>Bio</SectionLabel>
                  <p className="text-base text-linear-muted leading-relaxed">{data.bio}</p>
                </SpotlightCard>
                <SpotlightCard className="p-6 md:p-8">
                  <SectionLabel>Stack technique</SectionLabel>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {data.skills.map((skill) => {
                      const imgUrl = skill.logo ? getOptimizedImageUrl(apiUrl, skill.logo, { width: 56, height: 56 }) : null;
                      const fallback = getSkillFallbackImage(skill.name);
                      return (
                        <div key={skill._id} className="group relative flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.06] hover:bg-white/[0.08] hover:border-linear-borderAccent transition-all duration-200">
                          <ImageComponent src={imgUrl || fallback} fallbackSrc={fallback} alt={skill.name} className="w-7 h-7" title={skill.name} width={28} height={28} loading="lazy" />
                          <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#0a0a0c] border border-white/[0.1] text-linear-fg text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap shadow-lg">{skill.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </SpotlightCard>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════ PROJECTS ═══════════════════════ */}
        <section ref={projetRef} className="relative z-10 py-16 md:py-32 px-4">
          <div className="section-divider mb-16 md:mb-32" />
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 opacity-0 translate-y-6 transition-all duration-700" data-scroll>
              <SectionLabel>Portfolio</SectionLabel>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight gradient-text">Projets</h2>
            </div>
            <div className="flex justify-center mb-12 opacity-0 translate-y-6 transition-all duration-700" data-scroll>
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.06]">
                <span className={`text-sm transition-colors duration-200 ${!showOnlyAI ? 'text-linear-fg' : 'text-linear-muted'}`}>Tous</span>
                <button onClick={() => setShowOnlyAI(!showOnlyAI)} className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-linear-accent/50 focus:ring-offset-2 focus:ring-offset-[#050506] ${showOnlyAI ? 'bg-linear-accent' : 'bg-white/[0.15]'}`} role="switch" aria-checked={showOnlyAI} aria-label="Filtrer projets IA">
                  <span className={`block w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${showOnlyAI ? 'translate-x-[22px]' : 'translate-x-[3px]'}`} />
                </button>
                <span className={`text-sm transition-colors duration-200 ${showOnlyAI ? 'text-linear-accent' : 'text-linear-muted'}`}>IA</span>
              </div>
            </div>
            {isMultiLoading('userData') ? (
              <div className="flex flex-col items-center gap-4 min-h-[30vh]"><Loader type="pulse" size="large" /><p className="text-sm text-linear-muted">{getMessage('userData') || 'Chargement...'}</p></div>
            ) : userData.map((data) => {
              const filteredProjects = showOnlyAI ? data.projects.filter(p => p.isAi === true) : data.projects;
              return (
                <div key={data._id}>
                  {filteredProjects.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[30vh]"><p className="text-linear-muted">Aucun projet IA trouvé</p></div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProjects.map((project, i) => (
                        <div key={project._id} className="opacity-0 translate-y-6 transition-all duration-700" data-scroll style={{ transitionDelay: `${i * 80}ms` }}>
                          <SpotlightCard className="flex flex-col h-full overflow-hidden">
                            <div className="relative aspect-video overflow-hidden">
                              {project.projectUrl ? (
                                <a href={project.projectUrl} target="_blank" rel="noreferrer" className="block w-full h-full">
                                  <ImageComponent src={getImageUrl(apiUrl, project.imageUrl)} alt={project.title} className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500" width={400} height={225} loading="lazy" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#050506]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </a>
                              ) : (
                                <>
                                  <ImageComponent src={getImageUrl(apiUrl, project.imageUrl)} alt={project.title} className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500" width={400} height={225} loading="lazy" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#050506]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </>
                              )}
                            </div>
                            <div className="flex flex-col flex-1 p-5 gap-3">
                              <h3 className="text-lg font-semibold tracking-tight gradient-text-accent">{project.title}</h3>
                              {/* Project descriptions are authored content from own backend */}
                              <p className={`text-sm text-linear-muted leading-relaxed ${expandedDescriptions[project._id] ? '' : 'line-clamp-4'}`} dangerouslySetInnerHTML={createDescriptionMarkup(project.description)} />
                              <button onClick={() => setExpandedDescriptions(prev => ({ ...prev, [project._id]: !prev[project._id] }))} className="text-linear-accent hover:text-linear-accentBright text-sm font-medium self-start transition-colors duration-200">
                                {expandedDescriptions[project._id] ? 'Voir moins' : 'Voir plus'}
                              </button>
                              <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/[0.06]">
                                {project?.skills?.map((skill) => {
                                  const imgUrl = skill.logo ? getOptimizedImageUrl(apiUrl, skill.logo, { width: 32, height: 32 }) : null;
                                  const fallback = getSkillFallbackImage(skill.name);
                                  return (
                                    <div key={skill._id} className="group relative">
                                      <ImageComponent src={imgUrl || fallback} fallbackSrc={fallback} alt={skill.name} className="w-6 h-6 hover:scale-110 transition-transform duration-200" title={skill.name} width={24} height={24} loading="lazy" />
                                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0a0a0c] border border-white/[0.1] text-linear-fg text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">{skill.name}</div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </SpotlightCard>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════ CONTACT ═══════════════════════ */}
        <section ref={contactRef} className="relative z-10 py-16 md:py-32 px-4">
          <div className="section-divider mb-16 md:mb-32" />
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 opacity-0 translate-y-6 transition-all duration-700" data-scroll>
              <SectionLabel>Contact</SectionLabel>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight gradient-text">Travaillons ensemble</h2>
              <p className="text-linear-muted text-base md:text-lg mt-4 max-w-xl mx-auto">Un projet ? Une idée ? Prenons contact !</p>
            </div>
            <div className="mb-12 opacity-0 translate-y-6 transition-all duration-700" data-scroll>
              <SpotlightCard className="p-4 md:p-6">
                <Cal namespace="30min" calLink="kacihamroun/30min" style={{ width: "100%", height: "100%", overflow: "scroll" }} config={{ layout: "month_view", useSlotsViewOnSmallScreen: "true" }} />
              </SpotlightCard>
            </div>
            <div className="opacity-0 translate-y-6 transition-all duration-700" data-scroll>
              <SpotlightCard className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="firstName" className="text-sm font-medium text-linear-muted">Prénom</label>
                      <input value={formData.firstName} onChange={handleChange} className={inputClass} type="text" name="firstName" placeholder="Votre prénom" id="firstName" />
                      {errors.firstName && <p className="text-red-400 text-xs mt-0.5">{errors.firstName}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="lastName" className="text-sm font-medium text-linear-muted">Nom</label>
                      <input value={formData.lastName} onChange={handleChange} className={inputClass} type="text" name="lastName" placeholder="Votre nom" id="lastName" />
                      {errors.lastName && <p className="text-red-400 text-xs mt-0.5">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contactSecondMail" className="text-sm font-medium text-linear-muted">Email</label>
                    <input value={formData.contactSecondMail} onChange={handleChange} className={inputClass} type="email" name="contactSecondMail" placeholder="votre@email.com" id="contactSecondMail" />
                    {errors.contactSecondMail && <p className="text-red-400 text-xs mt-0.5">{errors.contactSecondMail}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="text" className="text-sm font-medium text-linear-muted">Message</label>
                    <textarea value={formData.text} onChange={handleChange} className={`${inputClass} resize-none`} name="text" rows={5} placeholder="Décrivez votre projet..." id="text" />
                    {errors.text && <p className="text-red-400 text-xs mt-0.5">{errors.text}</p>}
                  </div>
                  <div className="flex justify-center mt-2">
                    <button className="bg-linear-accent hover:bg-linear-accentBright text-white font-semibold text-sm py-3 px-8 rounded-lg shadow-accent-glow hover:shadow-[0_0_0_1px_rgba(94,106,210,0.6),0_8px_20px_rgba(94,106,210,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" type="submit" disabled={isMultiLoading('contactForm')}>
                      {isMultiLoading('contactForm') ? <Loader type="spinner" size="small" color="blue" /> : 'Envoyer'}
                    </button>
                  </div>
                  {successMessage && <div className="mt-2 p-3 text-sm text-emerald-400 border border-emerald-500/30 rounded-lg bg-emerald-500/10">{successMessage}</div>}
                  {errorMessage && <div className="mt-2 p-3 text-sm text-red-400 border border-red-500/30 rounded-lg bg-red-500/10">{errorMessage}</div>}
                </form>
              </SpotlightCard>
            </div>
          </div>
        </section>
      </main>

      <Footer onCookieSettings={() => {}} />

      {showTopIcon && (
        <button className="fixed bottom-5 right-5 w-11 h-11 flex items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.06] hover:bg-white/[0.08] hover:border-linear-borderAccent shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 z-40 backdrop-blur-sm" onClick={toTop} aria-label="Retour en haut">
          <TopIcon iconSource={upArrow} onClick={toTop} />
        </button>
      )}
    </div>
  );
};

export default Home;
