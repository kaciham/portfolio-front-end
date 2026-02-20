import React, { useRef, useEffect, useState, useCallback } from 'react';
import Cal, { getCalApi } from "@calcom/embed-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
// import backgroundImg2 from '../assets/images/8550.webp';
// import backgroundImg2 from '../assets/images/flat-lay-blue-monday-paper-with-copy-space.webp';
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


// Composant Wave animé en SVG
const AnimatedWave = () => (
  <div className="wave-bg-container" aria-hidden="true">
    <svg className="wave-svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path
        d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,154.7C840,149,960,171,1080,186.7C1200,203,1320,213,1380,218.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        fill="#3b82f6"
        fillOpacity="0.5">
        <animate
          attributeName="d"
          dur="8s"
          repeatCount="indefinite"
          values="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,154.7C840,149,960,171,1080,186.7C1200,203,1320,213,1380,218.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z;
          M0,180L60,160C120,140,240,100,360,120C480,140,600,220,720,220C840,220,960,140,1080,120C1200,100,1320,140,1380,160L1440,180L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z;
          M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,154.7C840,149,960,171,1080,186.7C1200,203,1320,213,1380,218.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
      </path>
    </svg>
  </div>
);

const Home = () => {

  const apiUrl = API_BASE_URL;

  // Loading states management
  const {
    isLoading: isMultiLoading,
    getMessage,
    withLoading
  } = useMultipleLoading();

  // Network status detection
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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactSecondMail: '',
    text: '',
    emailContact: '',
  });
  const [showTopIcon, setShowTopIcon] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showOnlyAI, setShowOnlyAI] = useState(false);

  const handleScroll = useCallback((ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleScrollTopArrow = useCallback(() => {
    setShowTopIcon(window.scrollY > 100);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScrollTopArrow);
    return () => {
      window.removeEventListener('scroll', handleScrollTopArrow);
    };
  }, [handleScrollTopArrow]);

  useEffect(() => {
    let timer;
    if (successMessage || errorMessage) {
      timer = setTimeout(() => {
        setTimeout(() => {
          setSuccessMessage('');
          setErrorMessage('');
        }, 1000); // Delay hiding message completely to allow fade-out
      }, 3000); // Show message for 3 seconds
    }
    return () => clearTimeout(timer); // Clear timer on unmount or update
  }, [successMessage, errorMessage]);

  const handleScrollDisplay = () => {
    const elements = document.querySelectorAll('[data-scroll]');
    const windowHeight = window.innerHeight;

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top <= windowHeight * 0.9) {
        element.classList.add('opacity-100', 'translate-y-0');
        element.classList.remove('opacity-0', 'translate-y-10');
      }
    });
  };

  const handleInitialDisplay = () => {
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top <= window.innerHeight) {
        element.classList.add('opacity-100', 'translate-y-0');
        element.classList.remove('opacity-0', 'translate-y-10');
      }
    });
  };

  useEffect(() => {
    handleInitialDisplay();
    window.addEventListener('scroll', handleScrollDisplay);
    return () => {
      window.removeEventListener('scroll', handleScrollDisplay);
    };
  }, []);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const result = await withLoading('userData', async () => {
        const response = await getUserData();
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      }, 'Chargement des données...');

      // Extract the first portfolio from the portfolios array
      if (result.portfolios && result.portfolios.length > 0) {
        setUserData([result.portfolios[0]]);

        if (result.portfolios[0].jobs) {
          setJobs(result.portfolios[0].jobs.map((job) => job.title));
        } else {
          console.warn('Jobs data not found in portfolio');
        }
      } else {
        console.warn('No portfolios found in response');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Erreur lors du chargement des données');
    }
  }, [withLoading]);

  // Handle network status changes
  useEffect(() => {
    if (!isOnline) {
      setErrorMessage('No internet connection. Please check your network.');
    } else {
      // Retry fetching data when connection is restored
      if (userData.length === 0) {
        fetchProjects();
      }
    }
  }, [isOnline, userData.length, fetchProjects]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Preload critical skill images when userData is available
  useEffect(() => {
    if (userData.length > 0 && userData[0].skills) {
      const skillImageUrls = userData[0].skills
        .map(skill => skill.logo ? getOptimizedImageUrl(apiUrl, skill.logo, { width: 56, height: 56 }) : null)
        .filter(Boolean);
      
      if (skillImageUrls.length > 0) {
        preloadImages(skillImageUrls);
      }
    }
  }, [userData, apiUrl]);

  useEffect(() => {
    if (jobs.length === 0) return;

    const job = jobs[currentIndex];

    if (currentLetterIndex < job.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + job[currentLetterIndex]);
        setCurrentLetterIndex((prevIndex) => prevIndex + 1);
      }, 100);

      return () => clearTimeout(timer);
    } else {
      const nextWordTimer = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % jobs.length);
        setDisplayedText('');
        setCurrentLetterIndex(0);
      }, 1000);

      return () => clearTimeout(nextWordTimer);
    }
  }, [currentLetterIndex, currentIndex, jobs]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check network status first
    if (!isOnline) {
      setErrorMessage('No internet connection. Please check your network and try again.');
      contactRef.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.contactSecondMail.trim()) newErrors.contactSecondMail = "L'email de contact est requis";
    if (!formData.text) newErrors.text = 'Votre message est requis';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      contactRef.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    try {
      await withLoading('contactForm', async () => {
        const response = await sendContactForm(formData);
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      }, 'Envoi en cours...');

      setSuccessMessage('Votre message a bien été envoyé !');
      setErrorMessage('');
      setFormData({
        firstName: '',
        lastName: '',
        contactSecondMail: '',
        text: '',
        emailContact: 'kacihamroun@outlook.com',
      });
      setErrors({});
    } catch (error) {
      console.error("Oops ! Nous avons rencontré un problème dans l'envoi de votre message, veuillez recommencer s'il vous plaît", error);
      setErrorMessage("Oops ! Nous avons rencontré un problème dans l'envoi de votre message, veuillez recommencer s'il vous plaît");
      setSuccessMessage('');
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name !== 'text' ? value.trim() : value,
    }));
  }, []);

  // Generate dynamic SEO data based on user data
  const generateSEOData = useCallback(() => {
    if (userData.length === 0) return {};
    
    const data = userData[0];
    const fullName = `${data.firstName} ${data.lastName}`;
    const skills = data.skills?.map(skill => skill.name).join(', ') || '';
    
    return {
      title: `${fullName} - Développeur Full-Stack & Automatisation IA | Lille 59000`,
      description: `${fullName}, développeur full-stack spécialisé en automatisation IA à Lille. Expert en ${skills}. ${data.bio?.substring(0, 100)}...`,
      keywords: `développeur full-stack, automatisation IA, ${skills}, développeur web Lille, ${data.firstName} ${data.lastName}, freelance développeur Lille`,
      canonical: "https://www.kacihamroun.com",
      ogImage: data.profilePic ? (data.profilePic.startsWith('http') ? data.profilePic : `https://www.kacihamroun.com${data.profilePic}`) : "https://www.kacihamroun.com/images/kaci-hamroun-og.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": fullName,
        "givenName": data.firstName,
        "familyName": data.lastName,
        "jobTitle": "Développeur Full-Stack & Spécialiste Automatisation IA",
        "description": data.bio,
        "url": "https://www.kacihamroun.com",
        "image": data.profilePic ? (data.profilePic.startsWith('http') ? data.profilePic : `https://www.kacihamroun.com${data.profilePic}`) : "https://www.kacihamroun.com/images/kaci-hamroun-profile.jpg",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Lille",
          "postalCode": "59000",
          "addressRegion": "Hauts-de-France",
          "addressCountry": "FR"
        },
        "sameAs": [
          data.linkedinUrl,
          data.githubUrl
        ].filter(Boolean),
        "knowsAbout": data.skills?.map(skill => skill.name) || [],
        "worksFor": {
          "@type": "Organization",
          "name": "Freelance"
        }
      }
    };
  }, [userData]);

  const seoData = generateSEOData();

  const toTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className='w-full overflow-x-hidden bg-web3-dark relative'>
      <AnimatedWave />
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonical={seoData.canonical}
        ogImage={seoData.ogImage}
        jsonLd={seoData.jsonLd}
      />
      <Navbar handleScroll={handleScroll} refs={{ homeRef, aboutRef, projetRef, contactRef }} />
      <main className='w-full min-h-screen bg-midnight-gradient relative overflow-hidden'>
        <div
          ref={homeRef}
          className='flex flex-col justify-center items-center min-h-[100vh] sm:min-h-[90vh] opacity-0 translate-y-10 transition-transform duration-[1500ms] ease relative w-full max-w-none z-10'
          data-animate
        >
          <div className='my-12 md:my-12'>
            <h1
              className="text-center text-7xl md:text-5xl h-18 m-8 mainTitle bg-gradient-to-r from-web3-accent via-web3-purple to-web3-cyan bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]"
            >
              {userData.length > 0 ? (userData[0]?.firstName + ' ' + userData[0]?.lastName) : 'Chargement...'}
            </h1>
          </div>
          {isMultiLoading('userData') ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <Loader type="spinner" size="large" color="blue" />
              <p className="mt-4 text-lg text-gray-400">{getMessage('userData') || 'Chargement en cours...'}</p>
            </div>
          ) : userData.length > 0 ? userData.map((data) => (
            <div key={data._id}>
              <div className='flex items-center justify-center rounded-full p-1 m-3 gap-4 my-6'>
                <div className='bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-500 ease-in-out hover:-translate-y-1'>
                  <a href={data.linkedinUrl} target='_blank' rel='noreferrer' aria-label="Visit LinkedIn profile">
                    <ImageComponent src={linkedinLogo} className="w-8 mt-2" alt="LinkedIn" title="Profil LinkedIn" width={32} height={32} />
                  </a>
                </div>
                <div className='bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-500 ease-in-out hover:-translate-y-1'>
                  <a href={data.githubUrl} target='_blank' rel='noreferrer' aria-label="Visit GitHub profile">
                    <ImageComponent src={githubLogo} className="w-8 mt-2" alt="GitHub" title="Profil Github" width={32} height={32} />
                  </a>
                </div>
                <div className='bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-500 ease-in-out hover:-translate-y-1'>
                  <a href={getImageUrl(apiUrl, data.resumePdf)} target='_blank' rel='noreferrer' aria-label="Download resume">
                    <ImageComponent src={cvLogo} className="w-7 mt-2" alt="Resume" title="CV" width={28} height={28} />
                  </a>
                </div>
                <div className='bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-500 ease-in-out hover:-translate-y-1'>
                  <a href={data.scheduleUrl} target='_blank' rel='noreferrer' aria-label="Schedule a meeting">
                    <ImageComponent src={calendarLogo} className="w-7 mt-2" alt="Schedule appointment" title="Prenons Rendez-vous !" width={28} height={28} />
                  </a>
                </div>
                <div className='bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center cursor-pointer transition-transform duration-500 ease-in-out hover:-translate-y-1'>
                  <button onClick={() => handleScroll(contactRef)} aria-label="Scroll to contact section">
                    <span className='hidden'>Contact</span>
                    <ImageComponent src={contactLogo} className="w-7 mt-2" alt="Contact" title="Contact" width={28} height={28}/>
                  </button>
                </div>
              </div>
              <div className='h-56 lg:h-60'>
                <div className='flex flex-col justify-center items-center'>
                  <h2 className='text-3xl sm:text-4xl md:text-4xl font-bold my-6 subTitle text-white'>
                    {displayedText}
                  </h2>
                </div>
              </div>
              <div className="flex justify-center items-center h-10">
                <div className="animate-bounce cursor-pointer" onClick={()=> handleScroll(aboutRef)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" className="stroke-web3-accent" />
                  </svg>
                </div>
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <Loader type="spinner" size="large" color="blue" />
            </div>
          )}
        </div>
      </main>

      <div className="flex justify-center m-8" ref={aboutRef}>
          <h2 className="text-4xl font-medium sm:text-5xl text-center mt-28 mb-4 relative">
            <span className="text-white px-6 py-3 rounded-xl bg-web3-card border border-web3-accent/30 shadow-card hover:shadow-card-hover transition-all duration-300">
              À Propos
            </span>
          </h2>
        </div>
        <div
          className='bg-web3-card border border-web3-accent/20 rounded-3xl px-4 flex flex-col opacity-0 translate-y-10 transition-all duration-[1500ms] min-h-[50vh] ease-in-out justify-center items-center mx-4 sm:mx-auto w-auto max-w-7xl self-center backdrop-blur-sm'
          data-scroll
        >
          {isMultiLoading('userData') ? (
            <div className="flex flex-col items-center justify-center">
              <Loader type="dots" size="medium" />
              <p className="mt-4 text-gray-300">{getMessage('userData') || 'Chargement des informations...'}</p>
            </div>
          ) : userData.map((data) => (
            <div key={data._id} className='flex w-full max-w-7xl min-h-[40vh] flex-col sm:flex-row my-4 justify-around gap-10 items-center'>

              <div className='w-full sm:w-1/2 gap-4 md:px-4 flex flex-col justify-center items-center text-center'>
                <div>
                  <h2 className='text-sm sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-web3-accent to-web3-purple bg-clip-text text-transparent'>Bio</h2>
                </div>
                <div>
                  <p className='text-gray-300 px-4 text-sm sm:text-lg leading-relaxed'>{data.bio}</p>
                </div>
              </div>
              <div className='w-full sm:w-1/2 gap-4 flex flex-col justify-center items-center text-center'>
                <div>
                  <h2 className='px-4 text-sm sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-web3-cyan to-web3-accent bg-clip-text text-transparent'>Stack</h2>
                </div>
                <div className='flex flex-row flex-wrap gap-4 sm:gap-4 items-center justify-center px-8 sm:px-14'>
                  {data.skills.map((skillsData) => {
                    const optimizedImageUrl = skillsData.logo
                      ? getOptimizedImageUrl(apiUrl, skillsData.logo, { width: 56, height: 56 })
                      : null;
                    const fallbackImage = getSkillFallbackImage(skillsData.name);

                    return (
                      <div key={skillsData._id} className="relative group">
                        <ImageComponent
                          src={optimizedImageUrl || fallbackImage}
                          fallbackSrc={fallbackImage}
                          alt={`Logo de ${skillsData.name} - Compétence technique`}
                          className='w-10 h-10 sm:w-14 sm:h-14 shadow-lg transition-all duration-500 ease-in-out group-hover:scale-105'
                          title={skillsData.name}
                          width={56}
                          height={56}
                          loading="lazy"
                        />
                        {/* Tooltip on hover */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 z-10">
                          {skillsData.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          ref={projetRef}
          className='w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col min-h-[70vh] opacity-0 translate-y-10 transition-all duration-[1500ms] ease-in-out'
          data-scroll
        >
          <div className="flex flex-col justify-center items-center gap-6">
            <h2 className="text-4xl font-medium sm:text-5xl text-center mt-28 mb-4 relative">
              <span className="text-white px-6 py-3 rounded-xl bg-web3-card border border-web3-accent/30 shadow-card hover:shadow-card-hover transition-all duration-300">
                Projets
              </span>
            </h2>

            {/* AI Projects Filter Switch */}
            <div className="flex items-center gap-3 bg-web3-card border border-web3-accent/30 px-6 py-3 rounded-xl shadow-card backdrop-blur-sm">
              <span className="text-sm sm:text-base font-medium text-gray-300">
                Tous les projets
              </span>
              <button
                onClick={() => setShowOnlyAI(!showOnlyAI)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-web3-accent focus:ring-offset-2 focus:ring-offset-web3-dark ${
                  showOnlyAI ? 'bg-gradient-to-r from-web3-accent to-web3-purple' : 'bg-gray-600'
                }`}
                role="switch"
                aria-checked={showOnlyAI}
                aria-label="Filtrer les projets IA uniquement"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                    showOnlyAI ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm sm:text-base font-medium bg-gradient-to-r from-web3-accent to-web3-purple bg-clip-text text-transparent">
                Projets IA
              </span>
            </div>
          </div>
          {isMultiLoading('userData') ? (
            <div className="flex flex-col items-center justify-center min-h-[30vh]">
              <Loader type="pulse" size="large" />
              <p className="mt-4 text-lg text-gray-300">{getMessage('userData') || 'Chargement des projets...'}</p>
            </div>
          ) : userData.map((data) => {
            // Filter projects based on AI toggle
            const filteredProjects = showOnlyAI
              ? data.projects.filter(project => project.isAi === true)
              : data.projects;

            return (
            <div key={data._id}>
              {filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[30vh] my-12">
                  <p className="text-lg text-gray-300">Aucun projet IA trouvé</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
                  {filteredProjects.map((projectData) => (
                    <div
                      key={projectData._id}
                      className="flex flex-col rounded-2xl overflow-hidden bg-web3-card border border-web3-accent/20 shadow-card hover:shadow-card-hover hover:border-web3-accent/40 transition-all duration-500 hover:-translate-y-1 text-white opacity-0 translate-y-10 duration-[1500ms] ease-in-out"
                      data-scroll
                    >
                      {/* Image */}
                      <div className="relative aspect-video overflow-hidden group">
                        {projectData.projectUrl ? (
                          <a href={projectData.projectUrl} target="_blank" rel="noreferrer" className="w-full h-full block">
                            <ImageComponent
                              src={getImageUrl(apiUrl, projectData.imageUrl)}
                              alt={projectData.title}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              width={400}
                              height={225}
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-web3-dark/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </a>
                        ) : (
                          <>
                            <ImageComponent
                              src={getImageUrl(apiUrl, projectData.imageUrl)}
                              alt={projectData.title}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              width={400}
                              height={225}
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-web3-dark/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-5 gap-4">
                        <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-web3-accent via-web3-purple to-web3-cyan bg-clip-text text-transparent">
                          {projectData.title}
                        </h2>
                        <p className="text-sm text-gray-300 leading-relaxed line-clamp-4" dangerouslySetInnerHTML={{ __html: projectData.description }}></p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-web3-accent/10">
                          {projectData?.skills?.map((projectSkillsData) => {
                            const optimizedImageUrl = projectSkillsData.logo
                              ? getOptimizedImageUrl(apiUrl, projectSkillsData.logo, { width: 32, height: 32 })
                              : null;
                            const fallbackImage = getSkillFallbackImage(projectSkillsData.name);

                            return (
                              <div key={projectSkillsData._id} className="relative group">
                                <ImageComponent
                                  src={optimizedImageUrl || fallbackImage}
                                  fallbackSrc={fallbackImage}
                                  alt={`Logo de ${projectSkillsData.name}`}
                                  className="w-7 h-7 transition-all duration-500 ease-in-out group-hover:scale-110"
                                  title={projectSkillsData.name}
                                  width={28}
                                  height={28}
                                  loading="lazy"
                                />
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                                  {projectSkillsData.name}
                                </div>
                              </div>
                            );
                          })}
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
        <div
          className='flex flex-col justify-center my-4 min-h-[50vh] items-center gap-4 w-full max-w-7xl mx-auto px-4 sm:px-6 translate-y-10 transition-all duration-[2000ms] ease-in-out mt-4'
          data-scroll
          ref={contactRef}
        >
          <div className="flex justify-center">
            <h2 className="text-4xl font-medium sm:text-5xl text-center mt-28 mb-4 relative">
              <span className="text-white px-6 py-3 rounded-xl bg-web3-card border border-web3-accent/30 shadow-card hover:shadow-card-hover transition-all duration-300">
                Contact
              </span>
            </h2>
          </div>
          <div className='flex gap-18 justify-center items-center my-8 '>
            <h2 className='text-sm sm:text-sm font-normal leading-9 text-center px-4 text-white projet'>Un projet ? Une idée ? Prenons contact !</h2>
          </div>
          <div className='w-full max-w-4xl px-2 sm:px-0 my-8'>
            <Cal
              namespace="30min"
              calLink="kacihamroun/30min"
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
              config={{ layout: "month_view", useSlotsViewOnSmallScreen: "true" }}
            />
          </div>
          <div className='w-full max-w-4xl px-2 sm:px-0'>
            <form
              onSubmit={handleSubmit}
              className='bg-web3-card border border-web3-accent/20 flex flex-col gap-6 w-full max-w-4xl mx-auto shadow-card rounded-2xl p-6 sm:p-8 backdrop-blur-sm'
            >
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div className='flex flex-col'>
                  <label htmlFor='firstName' className='text-gray-300 text-sm sm:text-lg mb-1'>
                    Prénom
                  </label>
                  <input
                    value={formData.firstName}
                    onChange={handleChange}
                    className='bg-web3-darker border border-web3-accent/30 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-web3-accent focus:border-transparent transition-all duration-300'
                    type='text'
                    name='firstName'
                    placeholder='Entrez votre prénom'
                    id='firstName'
                  />
                  {errors.firstName && <p className='text-red-400 text-sm mt-1'>{errors.firstName}</p>}
                </div>
                <div className='flex flex-col'>
                  <label htmlFor='lastName' className='text-gray-300 text-sm sm:text-lg mb-1'>
                    Nom
                  </label>
                  <input
                    value={formData.lastName}
                    onChange={handleChange}
                    className='bg-web3-darker border border-web3-accent/30 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-web3-accent focus:border-transparent transition-all duration-300'
                    type='text'
                    name='lastName'
                    placeholder='Entrez votre nom'
                    id='lastName'
                  />
                  {errors.lastName && <p className='text-red-400 text-sm mt-1'>{errors.lastName}</p>}
                </div>
              </div>

              <div className='flex flex-col mt-4'>
                <label htmlFor='contactSecondMail' className='text-gray-300 text-sm sm:text-lg mb-1'>
                  Email de contact
                </label>
                <input
                  value={formData.contactSecondMail}
                  onChange={handleChange}
                  className='bg-web3-darker border border-web3-accent/30 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-web3-accent focus:border-transparent transition-all duration-300'
                  type='email'
                  name='contactSecondMail'
                  placeholder='Entrez votre email'
                  id='contactSecondMail'
                />
                {errors.contactSecondMail && <p className='text-red-400 text-sm mt-1'>{errors.contactSecondMail}</p>}
              </div>

              <div className='flex flex-col mt-4'>
                <label htmlFor='text' className='text-gray-300 text-sm sm:text-lg mb-1'>
                  Votre message
                </label>
                <textarea
                  value={formData.text}
                  onChange={handleChange}
                  className='bg-web3-darker border border-web3-accent/30 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-web3-accent focus:border-transparent transition-all duration-300'
                  name='text'
                  rows={5}
                  placeholder='Détaillez votre projet ici'
                  id='text'
                />
                {errors.text && <p className='text-red-400 text-sm mt-1'>{errors.text}</p>}
              </div>
              <div className='flex justify-center mt-6'>
                <button
                  className='bg-gradient-to-r from-web3-accent to-web3-purple text-center hover:from-web3-accentHover hover:to-web3-purple hover:shadow-neon w-full sm:w-1/3 h-12 flex justify-center items-center text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-web3-accent transition-all duration-300'
                  type='submit'
                  disabled={isMultiLoading('contactForm')}
                >
                  {isMultiLoading('contactForm') ? <Loader type="spinner" size="small" color="blue" /> : 'Envoyer'}
                </button>
              </div>

              {/* Display Success Message */}
              {successMessage && (
                <div className='mt-4 p-4 text-sm text-web3-green border border-web3-green rounded-lg bg-web3-green/10'>
                  <strong>Succès :</strong> {successMessage}
                </div>
              )}

              {/* Display Error Message */}
              {errorMessage && (
                <div className='mt-4 p-4 text-sm text-red-400 border border-red-500 rounded-lg bg-red-500/10'>
                  <strong>Erreur :</strong> {errorMessage}
                </div>
              )}
            </form>
          </div>
        </div>
        <Footer onCookieSettings={() => {}} />
   
{showTopIcon && (
        <div
          className='w-14 h-14 sm:w-18 sm:h-18 fixed bottom-5 rounded-full right-5 bg-web3-card border-2 border-web3-accent/30 hover:border-web3-accent p-2 shadow-neon cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-neon-lg  bg-white'
          onClick={toTop}
        >
          <TopIcon iconSource={upArrow} onClick={toTop} />
        </div>
      )}
    </div>
  );
};

export default Home;
