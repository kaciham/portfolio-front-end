import React, { useRef, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import ImageComponent from '../components/ImageComponent';
import backgroundImg2 from '../assets/images/vecteezy_vector-blurred-gradient-background-in-blue-color_27204890.jpg';
import githubLogo from '../assets/icons/github.svg';
import linkedinLogo from '../assets/icons/linkedin.svg';
import cvLogo from '../assets/icons/cv.svg';
import calendarLogo from '../assets/icons/calendar.svg';
import contactLogo from '../assets/icons/email.svg';
import TopIcon from '../components/TopIcon';
import upArrow from '../assets/icons/up-arrow.svg';

const Home = () => {

const apiUrl = process.env.REACT_APP_SERVER_PROD;

  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const projetRef = useRef(null);

  const handleScroll = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

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
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false)

  const handleScrollTopArrow = () => {
    if (window.scrollY > 100) {
      setShowTopIcon(true);
    } else {
      setShowTopIcon(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScrollTopArrow);
    return () => {
      window.removeEventListener('scroll', handleScrollTopArrow);
    };
  }, []);

  useEffect(() => {
    let timer;
    if (successMessage || errorMessage) {
      setIsVisible(true); // Set visible when message appears

      timer = setTimeout(() => {
        setIsVisible(false); // Trigger fade-out transition
        setTimeout(() => {
          setSuccessMessage('');
          setErrorMessage('');
        }, 1000); // Delay hiding message completely to allow fade-out
      }, 3000); // Show message for 5 seconds
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
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${apiUrl}api/kaci`);
        const dataFetched = response.data;
        setUserData([dataFetched]);
  
        if (dataFetched.jobs) {
          const jobTitles = dataFetched.jobs.map((job) => job.title);
          setJobs(jobTitles);
        } else {
          console.warn('Jobs data not found in response');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchProjects();
    
  },[apiUrl]);

  useEffect(() => {
    if (jobs.length === 0) return;

    const job = jobs[currentIndex];

    if (currentLetterIndex < job.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + job[currentLetterIndex]);
        setCurrentLetterIndex((prevIndex) => prevIndex + 1);
      }, 150);

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

    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrl}api/contacts`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setSuccessMessage('Form submitted successfully!');
        setErrorMessage('');
        setFormData({
          firstName: '',
          lastName: '',
          contactSecondMail: '',
          text: '',
          emailContact: 'kacihamroun@outlook.com',
        });
        setErrors({});
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      setErrorMessage('Failed to submit the form. Please try again.');
      setSuccessMessage('');
    } finally {
      setIsLoading(false);
    }
  };


  const handleChange = (e) => {
  const { name, value } = e.target;

  let processedValue = value;

  // Apply trim for all fields except 'text'
  if (name !== 'text') {
    processedValue = processedValue.trim();
  }

  setFormData((prevData) => ({
    ...prevData,
    [name]: processedValue,
  }));
};


  const toTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='w-full'>
      <Navbar handleScroll={handleScroll} refs={{ homeRef, aboutRef, projetRef, contactRef }} />
      <div className='w-screen'
        style={{
            backgroundImage: `url(${backgroundImg2})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }} >
        <div
          ref={homeRef}
          className='flex flex-col justify-center  bg-opacity-50 min-h-[90vh] sm:max-h-[90vh] opacity-0 translate-y-10 transition-transform duration-[1500ms] ease relative w-screen'
          data-animate
          // style={{
          //   backgroundImage: `url(${backgroundImg})`,
          //   backgroundSize: 'cover',
          //   backgroundPosition: 'center',
          //   backgroundAttachment: 'fixed',
          // }}
        >
          {userData.map((data) => (
            <div key={data._id}>
              <div className='flex justify-center pt-20'>
                <ImageComponent
                  src={`${apiUrl}${data.profilePic}`}
                  alt="Profile"
                  className="w-[150px] sm:w-[250px] m-4 rounded-full"
                />
              </div>
              <div className='flex justify-center rounded-full p-1 m-3 gap-4 my-6'>
                <div className='bg-white rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-50 ease-in-out   hover:-translate-y-2'>
                  <a href={data.linkedinUrl} target='_blank' rel='noreferrer'>
                    <ImageComponent src={linkedinLogo} />
                  </a>
                </div>
                <div className='bg-white rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-50 ease-in-out  hover:-translate-y-2'>
                  <a href={data.githubUrl} target='_blank' rel='noreferrer'>
                    <ImageComponent src={githubLogo} />
                  </a>
                </div>
                <div className='bg-white rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-50 ease-in-out  hover:-translate-y-2'>
                  <a href={`${apiUrl}${data.resumePdf}`} target='_blank' rel='noreferrer'>
                    <ImageComponent src={cvLogo} className={'w-10 top-2 h-fit rounded-none'} />
                  </a>
                </div>
                <div className='bg-white rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-50 ease-in-out   hover:-translate-y-2'>
                  <a href={data.scheduleUrl} target='_blank' rel='noreferrer'>
                    <ImageComponent src={calendarLogo} className={'w-10 top-2 h-fit rounded-none'} />
                  </a>
                </div>
                <div className='bg-white rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center  cursor-pointer transition-transform duration-50 ease-in-out   hover:-translate-y-2'>
                  <button onClick={() => handleScroll(contactRef)}>
                    <ImageComponent src={contactLogo} className={'w-10 top-2 h-fit rounded-none'} />
                  </button>
                </div>
              </div>
              <div className='h-56 lg:h-50'>
              <div className='my-12 md:my-8 '>
                <h2 className='text-center text-5xl md:text-5xl h-18 m-8 weo my-2 text'>
                {data.firstName + ' ' + data.lastName.toUpperCase()}
                </h2>
                </div>
                <div className='flex flex-col justify-center items-center '>
                  {/* <h2 className='text-left text-2xl sm:text-3xl md:text-4xl'>et je suis</h2> */}
                    <h1 className='text-3xl sm:text-4xl md:text-4xl font-bold my-2'>
                      {displayedText}
                    </h1>
                </div>
              </div>
          <div class="flex justify-center items-center h-10">
            <div class="animate-bounce text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
            </div>
          ))}
       
        </div>
      

        {/* Section with smooth transition effect */}
        <div className='flex justify-center  ' ref={aboutRef} >
    <h2 className=' text-4xl sm:text-5xl font-bold text-center mt-28 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-blue-400'>à Propos</h2>
        </div> 
        <div
                  className='bg-[#6793e0] flex flex-col opacity-0 translate-y-10 transition-all duration-[1500ms] min-h-[50vh] ease-in-out mt-2 justify-center items-center'
                  data-scroll
                >
                  {userData.map((data) => (
                    <div key={data._id} className='flex w-full max-w-7xl min-h-[40vh] flex-col sm:flex-row my-4 justify-around items-center'>
                    
                      <div className='w-full sm:w-1/2 gap-4 flex flex-col justify-center items-center text-center'>
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
                        <div className='flex flex-row flex-wrap gap-2 sm:gap-4 items-center justify-center px-8 sm:px-14'>
                          {data.skills.map((skillsData) => (
                              <ImageComponent
                                key={skillsData._id}
                                src={`${apiUrl}${skillsData.logo}`}
                                alt={skillsData.name}
                                className='w-10 h-10 sm:w-14 sm:h-14 rounded-xl border-4 transition-transform duration-300 ease-in-out hover:delay-200 hover:-translate-y-2'
                                title={skillsData.name}
                              />
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
        </div>
        <div
          ref={projetRef}
          className='w-full flex flex-col min-h-[70vh] opacity-0 translate-y-10 transition-all duration-[1500ms] ease-in-out '
          data-scroll
        >
          <div className='flex justify-center'>
            <h2 className='text-4xl sm:text-5xl font-bold text-center mt-28 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-blue-400'>Projets</h2>
          </div>
          {userData.map((data) => (
            <div key={data._id}>
              {data.projects.map((projectData, index) => (
                <div
          key={projectData._id}
          className={`relative flex flex-col sm:flex-col md:flex-col items-center rounded-lg gap-8 justify-center py-8 overflow-hidden opacity-0 translate-y-10 transition-all duration-[1500ms] px-2 ease-in-out lg:ml-10 ${
            index % 2 === 0 ? ' my-2' : 'text-white   bg-[#6793e0]  '
          }`}
          data-scroll
        >
          {/* Title (always on top in both mobile and desktop view) */}
          <div className='w-full text-center mb-4'>
            <h2 className='text-xl sm:text-2xl md:text-3xl font-bold'>{projectData.title}</h2>
          </div>

          {/* Flex Container for Image and Description */}
          <div className={`flex flex-col sm:flex-row w-full gap-8 sm:px-20 ${index % 2 === 0 ? ' sm:flex-row-reverse' : 'sm:flex-row'}`}>
            {/* Image (side by side with description on desktop) */}
            <div className='relative flex items-center justify-center w-full max-h-[30vh] sm:max-h-[40vh] sm:mx-12 rounded-lg overflow-hidden shadow-lg border-8 group'>
              <ImageComponent
                src={`${apiUrl}${projectData.imageUrl}`}
                alt={projectData.title}
                className='w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110'
              />
            </div>

            {/* Description and Skills */}
            <div className='flex flex-col gap-6 w-full sm:w-1/2 h-100 sm:mx-4 text-center justify-around'>
              <div>
                <p className='px-4 lg:px-10 text-sm sm:text-base'>{projectData.description}</p>
              </div>
              <div className='flex flex-wrap justify-center '>
                {projectData.skills.map((projectSkillsData) => (
                  <ImageComponent
                    key={projectSkillsData._id}
                    src={`${apiUrl}${projectSkillsData.logo}`}
                    alt={projectSkillsData.name}
                    className='w-8 h-8 sm:w-12 sm:h-12 rounded-xl border-4 hover:animate-bounce'
                    title={projectSkillsData.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
              ))}
            </div>
          ))}
        </div>
        <div
          className='flex flex-col justify-center my-4 min-h-[50vh] items-center gap-4 w-full translate-y-10 transition-all duration-[2000ms] ease-in-out mt-4'
          data-scroll
          ref={contactRef}
        >
          <div>
            <h2 className='font-bold text-4xl sm:text-5xl mt-28 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-blue-400'>Contact</h2>
          </div>
          <div className='flex gap-12 justify-center items-center my-2'>
            <h2 className='text-xl sm:text-2xl text-center px-4'>Un projet ? Une idée ? Prenons contact !</h2>
          </div>
          <div className='w-full sm:w-1/2 px-2 sm:px-0'>
            <form
              onSubmit={handleSubmit}
              className='bg-[#6793e0] flex flex-col  min-h-[75vh] gap-4 justify-center w-full shadow-md rounded-2xl px-4 sm:px-6 pt-6 pb-4 mb-8 '
            >
              <div className='flex flex-col sm:flex-row gap-4 items-center flex-wrap w-full'>
                <div className='flex flex-col justify-center w-full'> 
                  <label htmlFor='firstName' className='py-2 pl-2 text-white text-sm sm:text-lg'>
                    Prénom
                  </label>
                  <input
                    value={formData.firstName}
                    onChange={handleChange}
                    className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    type='text'
                    name='firstName'
                    placeholder='Entrez votre prénom'
                  />
                   <div className='py-2 pl-2'>
                  {errors.firstName && (
                    <div className='my-2 '>
                      <p className=' text-red-600'>{errors.firstName}</p>
                    </div>
                  )}
                  </div>
                </div>
                <div className='flex flex-col  justify-center w-full'>
                  <label htmlFor='lastName' className='py-2 pl-2  text-white text-sm sm:text-lg'>
                    Nom
                  </label>
                  <input
                    value={formData.lastName}
                    onChange={handleChange}
                    className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    type='text'
                    name='lastName'
                    id='lastName'
                    placeholder='Entrez votre nom'
                  />
                   <div className='py-2 pl-2'>
                  {errors.lastName && (
                    <div className='my-2'>
                      <p className=' text-red-600'>{errors.lastName}</p>
                    </div>
                  )}
                  </div>
                </div>
              </div>
              <div className='flex flex-col justify-center w-full'>
              <label htmlFor='contactSecondMail' className='pl-2 py-2  text-white text-sm sm:text-lg'>
                Email de contact
              </label>
              <input
                value={formData.contactSecondMail}
                onChange={handleChange}
                className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                type='email'
                name='contactSecondMail'
                id='contactSecondMail'
                placeholder='Entrez votre email'
              />
              <div className='py-3 pl-2'>
              {errors.contactSecondMail && <p className=' text-red-600'>{errors.contactSecondMail}</p>}
              </div>
</div>
<div className='flex flex-col justify-center w-full'>
              <label htmlFor='text' className='pl-2 py-2  text-white text-sm sm:text-lg'>
                Votre message
              </label>
              <textarea
                value={formData.text}
                onChange={handleChange}
                className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                name='text'
                id='text'
                rows={5}
                placeholder='Entrez votre message'
              />
              <div className='py-3 pl-2'>
              {errors.text && <p className=' text-red-600'>{errors.text}</p>}
              </div>
              </div>
      <div className='flex justify-end mt-6'>
        <button
          className='bg-white text-center hover:bg-gray-200 focus:bg-gray-200 w-full sm:w-1/3 h-16 items-center text-[#6793e0] font-bold py-2 px-2 rounded-xl focus:outline-none focus:shadow-outline submit'
          type='submit'
          disabled={isLoading}
        >
        <div className='flex justify-center'>
          {isLoading ? (
            <div className="simple-loader flex justify-center text-center"></div>
          ) : (
            'Envoyer'
          )}
          </div>
        </button>
      </div>
     {/* Display Success Message */}
     {successMessage && (
        <div className={`  flex items-center p-4 mb-4 text-sm text-green-500 border border-green-500 rounded-lg bg-green-50 alert transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`} role="alert">
          <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Success alert!</span> {successMessage}
          </div>
        </div>
      )}

      {/* Display Error Message */}
      {errorMessage && (
        <div className={`flex items-center p-4 mb-4 text-sm text-red-600 border border-red-600 rounded-lg bg-red-50 alert transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`} role="alert">
          <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Danger alert!</span> {errorMessage}
          </div>
        </div>
      )}
            </form>
          </div>
        </div>
      </div>
{/* 
      <button onClick={testClicked}>test</button> */}

      {showTopIcon && (
        <div
          className='w-14 h-14   sm:w-18 sm:h-18 fixed bottom-5 rounded-md right-5 bg-[#E0E3E8] border-[#6793e0] border-4 p-2 shadow-custom cursor-pointer opacity-90 transition-transform duration-300 ease-in-out hover:delay-200 hover:-translate-y-2'
          onClick={toTop}
        >
          <TopIcon iconSource={upArrow} onClick={toTop} />
        </div>
      )}
      <Footer />
    </div> 
  );
};

export default Home;  
