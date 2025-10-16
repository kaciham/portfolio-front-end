import React, { useRef, useEffect, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import axios from 'axios';
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
import { getUserData, sendContactForm } from '../api/apiCalls';
import { getSkillFallbackImage, getOptimizedImageUrl, preloadImages } from '../utils/imageHelpers';

const Home = () => {

  const apiUrl = process.env.REACT_APP_SERVER_PROD;
  
  // Loading states management
  const { 
    startLoading, 
    stopLoading, 
    isLoading: isMultiLoading, 
    getMessage, 
    withLoading 
  } = useMultipleLoading();

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

  const fetchProjects = useCallback(async () => {
    try {
      const result = await withLoading('userData', async () => {
        const response = await getUserData();
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      }, 'Chargement des données...');

      setUserData([result]);

      if (result.jobs) {
        setJobs(result.jobs.map((job) => job.title));
      } else {
        console.warn('Jobs data not found in response');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Erreur lors du chargement des données');
    }
  }, [withLoading]);

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
      const result = await withLoading('contactForm', async () => {
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
      ogImage: data.profilePic ? `https://www.kacihamroun.com${data.profilePic}` : "https://www.kacihamroun.com/images/kaci-hamroun-og.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": fullName,
        "givenName": data.firstName,
        "familyName": data.lastName,
        "jobTitle": "Développeur Full-Stack & Spécialiste Automatisation IA",
        "description": data.bio,
        "url": "https://www.kacihamroun.com",
        "image": data.profilePic ? `https://www.kacihamroun.com${data.profilePic}` : "https://www.kacihamroun.com/images/kaci-hamroun-profile.jpg",
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
    <div className='w-full overflow-x-hidden'>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonical={seoData.canonical}
        ogImage={seoData.ogImage}
        jsonLd={seoData.jsonLd}
      />
      <Navbar handleScroll={handleScroll} refs={{ homeRef, aboutRef, projetRef, contactRef }} />
      <div className='w-full min-h-screen'
        style={{
          background: 'linear-gradient(90deg,rgba(63, 111, 230, 0.5) 0%, rgba(255, 255, 255, 1) 100%)',
          filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#3F6FE6",endColorstr="#FFFFFF",GradientType=1)'
        }}
        >
        <div
          ref={homeRef}
          className='flex flex-col justify-center items-center bg-opacity-50 min-h-[100vh] sm:min-h-[90vh] opacity-0 translate-y-10 transition-transform duration-[1500ms] ease relative w-full max-w-none'
          data-animate
        >
          {isMultiLoading('userData') ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <Loader type="spinner" size="large" color="blue" />
              <p className="mt-4 text-lg text-gray-600">{getMessage('userData') || 'Chargement en cours...'}</p>
            </div>
          ) : userData.length > 0 ? userData.map((data) => (
            <div key={data._id}>
              <div className='my-12 md:my-12 '>
                <h1
                  className="text-center text-7xl md:text-5xl h-18 m-8 weo mainTitle"
                  class="mainTitle"
                >
                  {data.firstName + ' ' + data.lastName.toUpperCase()}
                </h1>
              </div>
              <div className='flex justify-center rounded-full p-1 m-3 gap-4 my-6'>
                <div className='bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-50 ease-in-out   hover:-translate-y-2'>
                  <a href={data.linkedinUrl} target='_blank' rel='noreferrer'>
                    <ImageComponent src={linkedinLogo} className="w-8" alt="logo LinkedIn" title="Profil LinkedIn" />
                  </a>
                </div>
                <div className='bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-50 ease-in-out  hover:-translate-y-2'>
                  <a href={data.githubUrl} target='_blank' rel='noreferrer'>
                    <ImageComponent src={githubLogo} className="w-8" alt="logo Github" title="Profil Github" />
                  </a>
                </div>
                <div className='bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-50 ease-in-out  hover:-translate-y-2'>
                  <a href={`${apiUrl}${data.resumePdf}`} target='_blank' rel='noreferrer'>
                    <ImageComponent src={cvLogo} className="w-7" alt="logo Resume" title="CV" />
                  </a>
                </div>
                <div className='bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-50 ease-in-out   hover:-translate-y-2'>
                  <a href={data.scheduleUrl} target='_blank' rel='noreferrer'>
                    <ImageComponent src={calendarLogo} className="w-7" alt="logo Appointment" title="Prenons Rendez-vous !" />
                  </a>
                </div>
                <div className='bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center  cursor-pointer transition-transform duration-50 ease-in-out   hover:-translate-y-2'>
                  <button onClick={() => handleScroll(contactRef)}>
                    <span className='hidden'>Contact</span>
                    <ImageComponent src={contactLogo} className="w-7" alt="logo Contact" title="Contact"/>
                  </button>
                </div>
              </div>
              <div className='h-56 lg:h-60'>
                <div className='flex flex-col justify-center items-center '>
                  <h2 className='text-3xl sm:text-4xl md:text-4xl font-bold my-6' class="subTitle">
                    {displayedText}
                  </h2> 
                </div>
              </div>
              <div class="flex justify-center items-center h-10">
                <div class="animate-bounce text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="black" viewBox="0 0 24 24" stroke="transparent" onClick={()=> handleScroll(aboutRef)}>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <Loader type="spinner" size="large" color="blue" />
          
            </div>
          )}
          <div></div>
        </div>


        <div className="flex justify-center m-8" ref={aboutRef}>
          <h2 className="text-4xl font-medium  sm:text-5xl text-black text-center mt-28 mb-4 bg-clip-text text-transparent  relative">
            <span className="  text-black px-4 py-2 rounded-xl shadow-md bg-opacity-50 bg-white">
              À Propos
            </span>
          </h2>
        </div>
        <div
          className='bg-[#3f6fe6] bg-opacity-80 px-4 flex flex-col opacity-0 translate-y-10 transition-all duration-[1500ms] min-h-[50vh] ease-in-out justify-center items-center sm:mx-auto w-full self-center'
          data-scroll
        >
          {isMultiLoading('userData') ? (
            <div className="flex flex-col items-center justify-center">
              <Loader type="dots" size="medium" />
              <p className="mt-4 text-white">{getMessage('userData') || 'Chargement des informations...'}</p>
            </div>
          ) : userData.map((data) => (
            <div key={data._id} className='flex w-full max-w-7xl min-h-[40vh] flex-col sm:flex-row my-4 justify-around  gap-10 items-center'>

              <div className='w-full sm:w-1/2 gap-4 md:px-4 flex flex-col justify-center items-center text-center'>
                <div>
                  <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-white'>Bio</h2>
                </div>
                <div>
                  <p className='text-white px-4 text-sm sm:text-lg'>{data.bio}</p>
                </div>
              </div>
              <div className='w-full sm:w-1/2 gap-4 flex flex-col justify-center items-center text-center'>
                <div>
                  <h2 className=' px-4 text-xl sm:text-2xl md:text-3xl font-bold text-white'>Stack</h2>
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
                          className='w-10 h-10 sm:w-14 sm:h-14 shadow-lg transition-transform duration-300 ease-in-out hover:delay-200 hover:-translate-y-2 hover:shadow-xl'
                          title={skillsData.name}
                          loading="lazy"
                        />
                        {/* Tooltip on hover */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
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
          <div className="flex justify-center" >
            <h2 className="text-4xl font-medium  sm:text-5xl text-black text-center mt-28 mb-4 bg-clip-text text-transparent  relative">
              <span className="  text-black px-4 py-2 rounded-xl shadow-md bg-opacity-80 bg-white">
                Projets            </span>
            </h2>
          </div>
          {isMultiLoading('userData') ? (
            <div className="flex flex-col items-center justify-center min-h-[30vh]">
              <Loader type="pulse" size="large" />
              <p className="mt-4 text-lg text-gray-600">{getMessage('userData') || 'Chargement des projets...'}</p>
            </div>
          ) : userData.map((data) => (
            <div key={data._id}>
              {data.projects.map((projectData, index) => (
                <div
                  key={projectData._id}
                  className={`relative w-full max-w-6xl mx-auto my-8 flex flex-col sm:flex-col md:flex-col items-center rounded-lg gap-8 justify-center py-8 overflow-hidden opacity-0 translate-y-10 transition-all duration-[1500ms] ease-in-out px-4 sm:px-6 ${index % 2 === 0 ? 'shadow-md' : 'text-white shadow-lg bg-[#3f6fe6] bg-opacity-80'
                    }`}
                  data-scroll
                >
                  {/* Title (always on top in both mobile and desktop view) */}
                  <div className='w-full text-center mb-4'>
                    <h2 className='text-xl sm:text-2xl md:text-3xl font-bold'>{projectData.title}</h2>
                  </div>

                  {/* Flex Container for Image and Description */}
                  <div className={`flex flex-col sm:flex-row w-full max-w-5xl gap-8 ${index % 2 === 0 ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
                    {/* Image (side by side with description on desktop) */}
                    <div className='relative flex items-center justify-center w-full md:min-h-[50vh] sm:max-h-[40vh] rounded-lg overflow-hidden shadow-lg border-8 group'>
                      <ImageComponent
                        src={`${apiUrl}${projectData.imageUrl}`}
                        alt={projectData.title}
                        className='w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110'
                      />
                    </div>
                    {/* Project link */}
                    {/* {projectData.projectUrl && (
                      <div className="flex justify-center items-center lg:w-1/3 md:w-1/2">
                        <a
                          href={projectData.projectUrl}
                          target='_blank'
                          rel='noreferrer'
                          className=' 
                          text-black hover:border border-black pl-4 pr-5 
                          hover:border-2 cursor-pointer text-[10px] font-semibold flex items-center justify-center gap-2 bg-white text-[#6793e0] m-2 rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-105 text-center s-m:w-1/2 w-full sm:h-10 h-8'
                        >
                          <span className='text-sm'>Lien vers le projet</span>
                        </a>
                      </div>
                    )} */}
                    {/* Description and Skills */}
                    <div className='flex flex-col gap-6 w-full sm:w-1/2 h-100 sm:mx-4 text-center justify-around'>
                      <div>
                         <h3 className='text-lg font-semibold my-2'>Description:</h3>
                        <p className='text-justify px-4 lg:px-10 text-sm my-2'>{projectData.description}</p>
                          {/* { projectData.problematic && (
                          <>
                            <h3 className='text-sm font-semibold my-2'>Problématique:</h3>
                            <p className='px-4 lg:px-10 text-sm my-2'>{projectData.problematic}</p>
                          </>
                        )}
                        {projectData.solution && (
                          <>
                            <h3 className='text-sm font-semibold my-2'>Solutions:</h3>
                            <p className='px-4 lg:px-10 text-sm my-2'>{projectData.solution}</p>
                          </>
                        )} */}
                      </div>
                      <div className='flex flex-wrap justify-center mx-2 sm:mx-0 gap-4'>
                        {projectData?.skills?.map((projectSkillsData) => {
                          const optimizedImageUrl = projectSkillsData.logo 
                            ? getOptimizedImageUrl(apiUrl, projectSkillsData.logo, { width: 48, height: 48 })
                            : null;
                          const fallbackImage = getSkillFallbackImage(projectSkillsData.name);
                          
                          return (
                            <div key={projectSkillsData._id} className="relative group">
                              <ImageComponent
                                src={optimizedImageUrl || fallbackImage}
                                fallbackSrc={fallbackImage}
                                alt={`Logo de ${projectSkillsData.name} - Technologie utilisée dans le projet`}
                                className='w-8 h-8 sm:w-12 sm:h-12 rounded-xl border-4 border-white shadow-md hover:animate-bounce transition-all duration-300'
                                title={projectSkillsData.name}
                                loading="lazy"
                              />
                              {/* Tooltip on hover */}
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                {projectSkillsData.name}
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
          ))}
        </div>
        <div
          className='flex flex-col justify-center my-4 min-h-[50vh] items-center gap-4 w-full max-w-7xl mx-auto px-4 sm:px-6 translate-y-10 transition-all duration-[2000ms] ease-in-out mt-4'
          data-scroll
          ref={contactRef}
        >
          <div className="flex justify-center" >
            <h2 className="text-4xl font-medium  sm:text-5xl text-black text-center mt-28 mb-4 bg-clip-text text-transparent  relative">
              <span className="  text-black px-4 py-2 rounded-xl shadow-md bg-opacity-50 bg-white">
                Contact</span>
            </h2>
          </div>
          <div className='flex gap-12 justify-center items-center my-2'>
            <h2 className='text-xl sm:text-xl font-semibold text-center px-4' class="projet">Un projet ? Une idée ? Prenons contact !</h2>
          </div>
          <div className='w-full max-w-lg px-2 sm:px-0'>
            <form
              onSubmit={handleSubmit}
              className='bg-[#3f6fe6] bg-opacity-80 flex flex-col gap-6 w-full max-w-lg mx-auto shadow-lg rounded-lg p-6 sm:p-8'
            >
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div className='flex flex-col'>
                  <label htmlFor='firstName' className='text-white text-sm sm:text-lg mb-1'>
                    Prénom
                  </label>
                  <input
                    value={formData.firstName}
                    onChange={handleChange}
                    className='border rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
                    type='text'
                    name='firstName'
                    placeholder='Entrez votre prénom'
                    id='firstName'
                  />
                  {errors.firstName && <p className='text-red-500 text-sm mt-1'>{errors.firstName}</p>}
                </div>
                <div className='flex flex-col'>
                  <label htmlFor='lastName' className='text-white text-sm sm:text-lg mb-1'>
                    Nom
                  </label>
                  <input
                    value={formData.lastName}
                    onChange={handleChange}
                    className='border rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
                    type='text'
                    name='lastName'
                    placeholder='Entrez votre nom'
                    id='lastName'
                  />
                  {errors.lastName && <p className='text-red-500 text-sm mt-1'>{errors.lastName}</p>}
                </div>
              </div>

              <div className='flex flex-col mt-4'>
                <label htmlFor='contactSecondMail' className='text-white text-sm sm:text-lg mb-1'>
                  Email de contact
                </label>
                <input
                  value={formData.contactSecondMail}
                  onChange={handleChange}
                  className='border rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
                  type='email'
                  name='contactSecondMail'
                  placeholder='Entrez votre email'
                  id='contactSecondMail'
                />
                {errors.contactSecondMail && <p className='text-red-500 text-sm mt-1'>{errors.contactSecondMail}</p>}
              </div>

              <div className='flex flex-col mt-4'>
                <label htmlFor='text' className='text-white text-sm sm:text-lg mb-1'>
                  Votre message
                </label>
                <textarea
                  value={formData.text}
                  onChange={handleChange}
                  className='border rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
                  name='text'
                  rows={5}
                  placeholder='Entrez votre message'
                  id='text'
                />
                {errors.text && <p className='text-red-500 text-sm mt-1'>{errors.text}</p>}
              </div>

              <div className='flex justify-end mt-6'>
                <button
                  className='bg-white text-center hover:bg-gray-200 focus:bg-gray-200 w-full sm:w-1/3 h-12 flex justify-center items-center text-[#6793e0] font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
                  type='submit'
                  disabled={isMultiLoading('contactForm')}
                >
                  {isMultiLoading('contactForm') ? <Loader type="spinner" size="small" color="blue" /> : 'Envoyer'}
                </button>
              </div>

              {/* Display Success Message */}
              {successMessage && (
                <div className='mt-4 p-4 text-sm text-green-600 border border-green-500 rounded-lg bg-green-100'>
                  <strong>Succès :</strong> {successMessage}
                </div>
              )}

              {/* Display Error Message */}
              {errorMessage && (
                <div className='mt-4 p-4 text-sm text-red-600 border border-red-500 rounded-lg bg-red-100'>
                  <strong>Erreur :</strong> {errorMessage}
                </div>
              )}
            </form>
          </div>
        </div>
        <Footer />
      </div>

      {showTopIcon && (
        <div
          className='w-14 h-14 sm:w-18 sm:h-18 fixed bottom-5 rounded-full right-5  bg-slate-200 opacity-90 border-4 p-2 shadow-custom cursor-pointer transition-transform duration-300 ease-in-out hover:delay-200 hover:-translate-y-2'
          onClick={toTop}
        >
          <TopIcon iconSource={upArrow} onClick={toTop} />
        </div>
      )}
    </div>
  );
};

export default Home;
