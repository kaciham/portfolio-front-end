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

// ─── Section Label Badge ───────────────────────────────────────────
const SectionLabel = ({ children, pulse }) => (
  <div className="inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent/5 px-5 py-2 mb-6">
    <span className={`h-2 w-2 rounded-full bg-accent ${pulse ? 'animate-pulse-dot' : ''}`} />
    <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent">{children}</span>
  </div>
);

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

  const handleScroll = useCallback((ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Scroll: top icon
  useEffect(() => {
    const onScroll = () => setShowTopIcon(window.scrollY > 100);
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
          el.classList.remove('opacity-0', 'translate-y-7');
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

  const inputClass = "w-full bg-white border border-border rounded-xl py-3 px-4 text-foreground placeholder-muted-fg/50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 text-sm";

  // Sanitize project description (authored content from own backend)
  const createDescriptionMarkup = (html) => ({ __html: html });

  return (
    <div className="w-full overflow-x-hidden bg-background text-foreground font-sans relative">
      <SEO title={seoData.title} description={seoData.description} keywords={seoData.keywords} canonical={seoData.canonical} ogImage={seoData.ogImage} jsonLd={seoData.jsonLd} />
      <Navbar handleScroll={handleScroll} refs={{ homeRef, aboutRef, projetRef, contactRef }} />

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section ref={homeRef} className="min-h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="glow-accent top-[-200px] left-1/2 -translate-x-1/2" />

        {isMultiLoading('userData') ? (
          <div className="flex flex-col items-center gap-4">
            <Loader type="spinner" size="large" color="blue" />
            <p className="text-sm text-muted-fg">{getMessage('userData') || 'Chargement...'}</p>
          </div>
        ) : userData.length > 0 ? userData.map((data) => (
          <div key={data._id} className="flex flex-col items-center gap-6 max-w-3xl relative z-10">
            {/* Name — Calistoga display */}
            <h1 className="font-display text-[2.75rem] sm:text-6xl md:text-[5.25rem] leading-[1.05] tracking-[-0.02em] text-center text-foreground">
              {data.firstName}{' '}
              <span className="relative">
                <span className="gradient-text">{data.lastName}</span>
                <span className="absolute bottom-[-0.25rem] md:bottom-[-0.5rem] left-0 h-3 md:h-4 w-full rounded-sm bg-gradient-to-r from-accent/15 to-accent-secondary/10" />
              </span>
            </h1>

            {/* Typing role */}
            <div className="h-10 flex items-center">
              <h2 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight text-center text-muted-fg">
                {displayedText}
                <span className="inline-block w-0.5 h-5 ml-1 bg-accent animate-pulse" />
              </h2>
            </div>

            {/* Social links — original SVG logos kept */}
            <div className="flex items-center justify-center rounded-full p-1 m-3 gap-4 my-6">
              <div className="bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-500 ease-in-out hover:-translate-y-1">
                <a href={data.linkedinUrl} target="_blank" rel="noreferrer" aria-label="Visit LinkedIn profile">
                  <ImageComponent src={linkedinLogo} className="w-8" alt="LinkedIn" title="Profil LinkedIn" width={32} height={32} />
                </a>
              </div>
              <div className="bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-500 ease-in-out hover:-translate-y-1">
                <a href={data.githubUrl} target="_blank" rel="noreferrer" aria-label="Visit GitHub profile">
                  <ImageComponent src={githubLogo} className="w-8" alt="GitHub" title="Profil Github" width={32} height={32} />
                </a>
              </div>
              <div className="bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-500 ease-in-out hover:-translate-y-1">
                <a href={getImageUrl(apiUrl, data.resumePdf)} target="_blank" rel="noreferrer" aria-label="Download resume">
                  <ImageComponent src={cvLogo} className="w-7" alt="Resume" title="CV" width={28} height={28} />
                </a>
              </div>
              <div className="bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-500 ease-in-out hover:-translate-y-1">
                <a href={data.scheduleUrl} target="_blank" rel="noreferrer" aria-label="Schedule a meeting">
                  <ImageComponent src={calendarLogo} className="w-7" alt="Schedule appointment" title="Prenons Rendez-vous !" width={28} height={28} />
                </a>
              </div>
              <div className="bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center cursor-pointer transition-transform duration-500 ease-in-out hover:-translate-y-1">
                <button onClick={() => handleScroll(contactRef)} aria-label="Scroll to contact section">
                  <span className="hidden">Contact</span>
                  <ImageComponent src={contactLogo} className="w-7" alt="Contact" title="Contact" width={28} height={28} />
                </button>
              </div>
            </div>

            {/* Scroll indicator */}
            <button onClick={() => handleScroll(aboutRef)} className="mt-16 text-muted-fg hover:text-accent transition-colors duration-200" aria-label="Défiler">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
              </svg>
            </button>
          </div>
        )) : (
          <div className="flex flex-col items-center gap-4"><Loader type="spinner" size="large" color="blue" /></div>
        )}
      </section>

      {/* ═══════════════════════ ABOUT ═══════════════════════ */}
      <section ref={aboutRef} className="py-28 md:py-44 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 opacity-0 translate-y-7 transition-all duration-700" data-scroll>
            <SectionLabel pulse>À propos</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl md:text-[3.25rem] leading-[1.15] text-foreground">
              Qui <span className="gradient-text">suis-je</span>
            </h2>
          </div>

          {isMultiLoading('userData') ? (
            <div className="flex flex-col items-center gap-4"><Loader type="dots" size="medium" /><p className="text-sm text-muted-fg">{getMessage('userData') || 'Chargement...'}</p></div>
          ) : userData.map((data) => (
            <div key={data._id} className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-0 translate-y-7 transition-all duration-700" data-scroll>
              {/* Bio */}
              <div className="bg-card border border-border rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300">
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent text-center mb-4 block">Bio</span>
                <p className="text-base text-muted-fg leading-relaxed">{data.bio}</p>
              </div>

              {/* Stack */}
              <div className="bg-card border border-border rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300">
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent text-center mb-4 block">Stack technique</span>
                <div className="flex flex-row flex-wrap gap-4 sm:gap-4 items-center justify-center px-8 sm:px-14 mt-2">
                  {data.skills.map((skill) => {
                    const imgUrl = skill.logo ? getOptimizedImageUrl(apiUrl, skill.logo, { width: 56, height: 56 }) : null;
                    const fallback = getSkillFallbackImage(skill.name);
                    return (
                      <div key={skill._id} className="relative group">
                        <ImageComponent
                          src={imgUrl || fallback}
                          fallbackSrc={fallback}
                          alt={`Logo de ${skill.name} - Compétence technique`}
                          className="w-10 h-10 sm:w-14 sm:h-14 shadow-lg transition-all duration-500 ease-in-out group-hover:scale-105"
                          title={skill.name}
                          width={56}
                          height={56}
                          loading="lazy"
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 z-10">
                          {skill.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ PROJECTS (Inverted Section) ═══════════════════════ */}
      <section ref={projetRef} className="py-28 md:py-44 px-6 bg-foreground text-white relative overflow-hidden dot-pattern">
        <div className="glow-accent top-[-100px] right-[-200px] opacity-20" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-8 opacity-0 translate-y-7 transition-all duration-700" data-scroll>
            <div className="inline-flex items-center gap-3 rounded-full border border-accent/40 bg-accent/10 px-5 py-2 mb-6">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse-dot" />
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent-secondary">Portfolio</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-[3.25rem] leading-[1.15] text-white">
              Mes <span className="gradient-text">Projets</span>
            </h2>
          </div>

          {/* AI Filter */}
          <div className="flex justify-center mb-12 opacity-0 translate-y-7 transition-all duration-700" data-scroll>
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 border border-white/10">
              <span className={`text-sm transition-colors duration-200 ${!showOnlyAI ? 'text-white' : 'text-white/50'}`}>Tous</span>
              <button
                onClick={() => setShowOnlyAI(!showOnlyAI)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-foreground ${showOnlyAI ? 'bg-accent' : 'bg-white/20'}`}
                role="switch" aria-checked={showOnlyAI} aria-label="Filtrer projets IA"
              >
                <span className={`block w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${showOnlyAI ? 'translate-x-[22px]' : 'translate-x-[3px]'}`} />
              </button>
              <span className={`text-sm transition-colors duration-200 ${showOnlyAI ? 'text-accent-secondary' : 'text-white/50'}`}>IA</span>
            </div>
          </div>

          {isMultiLoading('userData') ? (
            <div className="flex flex-col items-center gap-4 min-h-[30vh]"><Loader type="pulse" size="large" /><p className="text-sm text-white/60">{getMessage('userData') || 'Chargement...'}</p></div>
          ) : userData.map((data) => {
            const filteredProjects = showOnlyAI ? data.projects.filter(p => p.isAi === true) : data.projects;
            return (
              <div key={data._id}>
                {filteredProjects.length === 0 ? (
                  <div className="flex items-center justify-center min-h-[30vh]"><p className="text-white/60">Aucun projet IA trouvé</p></div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, i) => (
                      <div key={project._id} className="opacity-0 translate-y-7 transition-all duration-700" data-scroll style={{ transitionDelay: `${i * 100}ms` }}>
                        <div className="flex flex-col h-full bg-white/[0.07] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden hover:bg-white/[0.1] hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300 group">
                          {/* Image */}
                          <div className="relative aspect-video overflow-hidden">
                            {project.projectUrl ? (
                              <a href={project.projectUrl} target="_blank" rel="noreferrer" className="block w-full h-full">
                                <ImageComponent src={getImageUrl(apiUrl, project.imageUrl)} alt={project.title} className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500" containerClassName="relative w-full h-full" width={400} height={225} loading="lazy" />
                              </a>
                            ) : (
                              <ImageComponent src={getImageUrl(apiUrl, project.imageUrl)} alt={project.title} className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500" containerClassName="relative w-full h-full" width={400} height={225} loading="lazy" />
                            )}
                          </div>
                          {/* Content */}
                          <div className="flex flex-col flex-1 p-5 gap-3">
                            <h3 className="text-lg font-semibold tracking-tight text-white">{project.title}</h3>
                            {/* Project descriptions from own backend API */}
                            <p className={`text-sm text-white/60 leading-relaxed ${expandedDescriptions[project._id] ? '' : 'line-clamp-4'}`} dangerouslySetInnerHTML={createDescriptionMarkup(project.description)} />
                            <button onClick={() => setExpandedDescriptions(prev => ({ ...prev, [project._id]: !prev[project._id] }))} className="text-accent-secondary hover:text-accent text-sm font-medium self-start transition-colors duration-200">
                              {expandedDescriptions[project._id] ? 'Voir moins' : 'Voir plus'}
                            </button>
                            <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/[0.08]">
                              {project?.skills?.map((skill) => {
                                const imgUrl = skill.logo ? getOptimizedImageUrl(apiUrl, skill.logo, { width: 32, height: 32 }) : null;
                                const fallback = getSkillFallbackImage(skill.name);
                                return (
                                  <div key={skill._id} className="group/skill relative">
                                    <ImageComponent src={imgUrl || fallback} fallbackSrc={fallback} alt={skill.name} className="w-6 h-6 hover:scale-110 transition-transform duration-200" title={skill.name} width={24} height={24} loading="lazy" />
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-foreground text-xs px-2 py-1 rounded-lg opacity-0 group-hover/skill:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap shadow-md">
                                      {skill.name}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
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
      <section ref={contactRef} className="py-28 md:py-44 px-6 relative">
        <div className="glow-accent bottom-[-200px] left-[-100px]" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12 opacity-0 translate-y-7 transition-all duration-700" data-scroll>
            <SectionLabel pulse>Contact</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl md:text-[3.25rem] leading-[1.15] text-foreground">
              Travaillons <span className="gradient-text">ensemble</span>
            </h2>
            <p className="text-muted-fg text-base md:text-lg mt-4 max-w-xl mx-auto">Un projet ? Une idée ? Prenons contact !</p>
          </div>

          {/* Calendar */}
          <div className="mb-12 opacity-0 translate-y-7 transition-all duration-700" data-scroll>
            <div className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow-card">
              <Cal namespace="30min" calLink="kacihamroun/30min" style={{ width: "100%", height: "100%", overflow: "scroll" }} config={{ layout: "month_view", useSlotsViewOnSmallScreen: "true" }} />
            </div>
          </div>

          {/* Contact Form */}
          <div className="opacity-0 translate-y-7 transition-all duration-700" data-scroll>
            <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-card">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="firstName" className="text-sm font-medium text-foreground">Prénom</label>
                    <input value={formData.firstName} onChange={handleChange} className={inputClass} type="text" name="firstName" placeholder="Votre prénom" id="firstName" />
                    {errors.firstName && <p className="text-red-500 text-xs mt-0.5">{errors.firstName}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="lastName" className="text-sm font-medium text-foreground">Nom</label>
                    <input value={formData.lastName} onChange={handleChange} className={inputClass} type="text" name="lastName" placeholder="Votre nom" id="lastName" />
                    {errors.lastName && <p className="text-red-500 text-xs mt-0.5">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contactSecondMail" className="text-sm font-medium text-foreground">Email</label>
                  <input value={formData.contactSecondMail} onChange={handleChange} className={inputClass} type="email" name="contactSecondMail" placeholder="votre@email.com" id="contactSecondMail" />
                  {errors.contactSecondMail && <p className="text-red-500 text-xs mt-0.5">{errors.contactSecondMail}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="text" className="text-sm font-medium text-foreground">Message</label>
                  <textarea value={formData.text} onChange={handleChange} className={`${inputClass} resize-none`} name="text" rows={5} placeholder="Décrivez votre projet..." id="text" />
                  {errors.text && <p className="text-red-500 text-xs mt-0.5">{errors.text}</p>}
                </div>
                <div className="flex justify-center mt-2">
                  <button
                    className="bg-gradient-to-r from-accent to-accent-secondary text-white font-medium text-sm py-3 px-10 rounded-xl shadow-accent hover:shadow-accent-lg hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit" disabled={isMultiLoading('contactForm')}
                  >
                    {isMultiLoading('contactForm') ? <Loader type="spinner" size="small" color="blue" /> : 'Envoyer'}
                  </button>
                </div>
                {successMessage && <div className="mt-2 p-3 text-sm text-emerald-600 border border-emerald-200 rounded-xl bg-emerald-50">{successMessage}</div>}
                {errorMessage && <div className="mt-2 p-3 text-sm text-red-600 border border-red-200 rounded-xl bg-red-50">{errorMessage}</div>}
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer onCookieSettings={() => {}} />

      {/* Back to top */}
      {showTopIcon && (
        <button
          className="fixed bottom-5 right-5 w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-border hover:shadow-accent hover:-translate-y-0.5 transition-all duration-200 z-40"
          onClick={toTop} aria-label="Retour en haut"
        >
          <TopIcon iconSource={upArrow} onClick={toTop} />
        </button>
      )}
    </div>
  );
};

export default Home;
