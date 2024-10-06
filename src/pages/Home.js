import React, { useRef, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import ImageComponent from '../components/ImageComponent'; // Import the Image component
import backgroundImg from '../assets/images/font3.jpg';
import githubLogo from '../assets/icons/github.svg';
import linkedinLogo from '../assets/icons/linkedin.svg';
import cvLogo from '../assets/icons/cv.svg';
import calendarLogo from '../assets/icons/calendar.svg';
import contactLogo from '../assets/icons/email.svg';
import TopIcon from '../components/TopIcon';
import upArrow from '../assets/icons/up-arrow.svg';


const Home = () => {

const apiUrl = process.env.REACT_APP_SERVER_PROD;

// const testClicked = () => {
//   alert(apiUrl);
// }

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
    emailContact: 'kacihamroun@outlook.com',
  });
  const [showTopIcon, setShowTopIcon] = useState(false);

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

  useEffect(() => {
    fetchProjects();
  });

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
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}api/contacts`, formData);
      if (response.status === 200) {
        alert('Form submitted successfully!');
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
      alert('Failed to submit the form. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    const processedValue = name === 'contactSecondMail' ? trimmedValue.toLowerCase() : trimmedValue;

    setFormData((prevData) => ({
      ...prevData,
      [name]: processedValue,
    }));
  };

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar handleScroll={handleScroll} refs={{ homeRef, aboutRef, projetRef, contactRef }} />
      <div className='w-screen'>
        <div
          ref={homeRef}
          className='flex flex-col justify-center bg-[#f8f9fa] bg-opacity-50 min-h-[95vh] opacity-0 translate-y-10 transition-transform duration-[1500ms] ease relative w-screen'
          data-animate
          style={{
            backgroundImage: `url(${backgroundImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          {userData.map((data) => (
            <div key={data._id}>
              <div className='flex justify-center pt-18'>
                <ImageComponent
                  src={`${apiUrl}${data.profilePic}`}
                  alt="Profile"
                  className="w-[150px] sm:w-[250px] m-4 rounded-full"
                />
              </div>
              <div className='flex justify-center rounded-full p-1 m-3 gap-4 my-8'>
                <div className='bg-white rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center '>
                  <a href={data.linkedinUrl} target='_blank' rel='noreferrer'>
                    <ImageComponent src={linkedinLogo} />
                  </a>
                </div>
                <div className='bg-white rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center '>
                  <a href={data.githubUrl} target='_blank' rel='noreferrer'>
                    <ImageComponent src={githubLogo} />
                  </a>
                </div>
                <div className='bg-white rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center '>
                  <a href={`${apiUrl}${data.resumePdf}`} target='_blank' rel='noreferrer'>
                    <ImageComponent src={cvLogo} className={'w-10 top-2 h-fit rounded-none'} />
                  </a>
                </div>
                <div className='bg-white rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center '>
                  <a href={data.scheduleUrl} target='_blank' rel='noreferrer'>
                    <ImageComponent src={calendarLogo} className={'w-10 top-2 h-fit rounded-none'} />
                  </a>
                </div>
                <div className='bg-white rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center  cursor-pointer'>
                  <button onClick={() => handleScroll(contactRef)}>
                    <ImageComponent src={contactLogo} className={'w-10 top-2 h-fit rounded-none'} />
                  </button>
                </div>
              </div>
              <div>
                <h1 className='text-center text-2xl sm:text-3xl md:text-4xl px-16 weo my-2'>
                  Bonjour ! Je m'appelle {data.firstName + ' ' + data.lastName.toUpperCase()}
                </h1>
                <div className='flex flex-col justify-center h-28 items-center gap-2'>
                  <h2 className='text-left text-2xl sm:text-3xl md:text-4xl'>et je suis</h2>
                  <div className='my-4'>
                    <h2>
                      <span className='text-4xl sm:text-2xl md:text-3xl font-bold my-6'>{displayedText}</span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section with smooth transition effect */}
        <div
          className='bg-[#65a0ca] flex flex-col opacity-0 translate-y-10 transition-all duration-[1500ms] min-h-[50vh] ease-in-out mt-2 justify-center items-center'
          data-scroll
          ref={aboutRef}
        >
          {userData.map((data) => (
            <div key={data._id} className='flex w-full max-w-7xl min-h-[40vh] flex-col sm:flex-row my-4 justify-between items-center'>
              <div className='w-full sm:w-1/2 gap-4 flex flex-col justify-center items-center text-center'>
                <div>
                  <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-white'>Bio</h2>
                </div>
                <div>
                  <p className='text-white text-sm sm:text-lg'>{data.bio}</p>
                </div>
              </div>
              <div className='w-full sm:w-1/2 gap-4 flex flex-col justify-center items-center text-center'>
                <div>
                  <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-white'>Stack</h2>
                </div>
                <div className='flex flex-row flex-wrap gap-2 sm:gap-4 items-center justify-center px-4 sm:px-14'>
                  {data.skills
                    .sort((a, b) => (a.category > b.category ? 1 : -1))
                    .map((skillsData) => (
                      <ImageComponent
                        key={skillsData._id}
                        src={`${apiUrl}${skillsData.logo}`}
                        alt={skillsData.name}
                        className='w-12 h-12 sm:w-16 sm:h-16 rounded-xl border-4 hover:animate-bounce'
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
  className='w-full flex flex-col min-h-[70vh] opacity-0 translate-y-10 transition-all duration-[1500ms] ease-in-out pt-[100px]'
  data-scroll
>
  <div className='flex justify-center'>
    <h2 className='text-2xl sm:text-3xl font-bold text-center'>Projets</h2>
  </div>
  {userData.map((data) => (
    <div key={data._id}>
      {data.projects.map((projectData, index) => (
        <div
  key={projectData._id}
  className={`relative flex flex-col sm:flex-col md:flex-col items-center w-full gap-8 justify-center py-4 overflow-hidden opacity-0 translate-y-10 transition-all duration-[1500ms] px-2 ease-in-out ${
    index % 2 === 0 ? 'bg-[#E0E3E8] my-2' : 'text-white bg-[#65a0ca]'
  }`}
  data-scroll
>
  {/* Title (always on top in both mobile and desktop view) */}
  <div className='w-full text-center mb-4'>
    <h2 className='text-xl sm:text-2xl md:text-3xl font-bold'>{projectData.title}</h2>
  </div>

  {/* Flex Container for Image and Description */}
  <div className={`flex flex-col sm:flex-row w-full gap-8 ${index % 2 === 0 ? ' sm:flex-row-reverse' : 'sm:flex-row'}`}>
    {/* Image (side by side with description on desktop) */}
    <div className='relative flex items-center justify-center w-full max-h-[30vh] sm:max-h-[40vh] sm:mx-4 rounded-lg overflow-hidden shadow-lg border-8 group'>
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
      <div className='flex flex-wrap justify-center'>
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
          className='flex flex-col justify-center my-4 min-h-[50vh] items-center gap-4 w-full translate-y-10 transition-all duration-[2000ms] ease-in-out mt-4 pt-[80px]'
          data-scroll
          ref={contactRef}
        >
          <div>
            <h2 className='font-bold text-xl sm:text-3xl'>Contact</h2>
          </div>
          <div className='flex gap-12 justify-center items-center my-8'>
            <h2 className='text-xl sm:text-2xl text-center'>Un projet ? Une idée ? Prenons contact !</h2>
          </div>
          <div className='w-full sm:w-1/2 px-2 sm:px-0'>
            <form
              onSubmit={handleSubmit}
              className='bg-slate-200 flex flex-col gap-4 border-4 justify-center w-full shadow-md rounded-2xl px-4 sm:px-6 pt-6 pb-4 mb-4'
            >
              <div className='flex flex-col sm:flex-row gap-4 items-center flex-wrap w-full'>
                <div className='flex flex-col justify-center w-full'>
                  <label htmlFor='firstName' className='py-2 pl-2'>
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
                  {errors.firstName && (
                    <div className='my-2'>
                      <p style={{ color: 'red' }}>{errors.firstName}</p>
                    </div>
                  )}
                </div>
                <div className='flex flex-col py-2 justify-center w-full'>
                  <label htmlFor='lastName' className='py-2 pl-2'>
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
                  {errors.lastName && (
                    <div className='my-2'>
                      <p style={{ color: 'red' }}>{errors.lastName}</p>
                    </div>
                  )}
                </div>
              </div>
              <label htmlFor='contactSecondMail' className='pl-2'>
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
              {errors.contactSecondMail && <p style={{ color: 'red' }}>{errors.contactSecondMail}</p>}

              <label htmlFor='text' className='pl-2'>
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
              {errors.text && <p style={{ color: 'red' }}>{errors.text}</p>}
              <div className='flex justify-end mt-6'>
                <button
                  className='bg-blue-500 hover:bg-blue-700 focus:bg-blue-700 w-full sm:w-1/4 h-16 items-center text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline submit'
                  type='submit'
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
{/* 
      <button onClick={testClicked}>test</button> */}

      {showTopIcon && (
        <div
          className='w-24 h-24 fixed bottom-5 rounded-full right-5 bg-[#E0E3E8] border-[#65A0CA] border-8 p-5 shadow-custom cursor-pointer opacity-90'
          onClick={toTop}
        >
          <TopIcon iconSource={upArrow} onClick={toTop} />
        </div>
      )}
      <Footer />
    </>
  );
};

export default Home;
