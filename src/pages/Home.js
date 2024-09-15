import React, { useRef, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const Home = () => {
    const homeRef = useRef(null);
    const aboutRef = useRef(null);
    const contactRef = useRef(null);
    const projetRef = useRef(null);

    const handleScroll = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };

    const [userData, setUserData] = useState([]);
    const [jobs, setJobs] = useState([]); // State to store jobs fetched from API
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        contactSecondMail: '',
        text: '',
        emailContact: 'kacihamroun@outlook.com'
    });

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:3002/api/kaci');
            const dataFetched = response.data;
            setUserData([dataFetched]);

            // Assuming dataFetched.jobs is an array of job titles
            if (dataFetched.jobs) {
                const jobTitles = dataFetched.jobs.map((job) => job.title);
                setJobs(jobTitles); // Directly set the jobs array to state
            } else {
                console.warn('Jobs data not found in response');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const startsWithVowel = (word) => {
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        return vowels.includes(word[0].toLowerCase());
    };

    useEffect(() => {
        if (jobs.length === 0) return; // Exit if no jobs are available

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

    const job = jobs[currentIndex];
    const article = job && startsWithVowel(job) ? 'an' : 'a';

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.contactSecondMail.trim()) newErrors.contactSecondMail = 'Contact email is required';
        if (!formData.text.trim()) newErrors.text = 'Message is required';

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:3002/api/contacts', formData);
            if (response.status === 200) {
                alert('Form submitted successfully!');
                setFormData({ firstName: '', lastName: '', contactSecondMail: '', text: '', emailContact: 'kacihamroun@outlook.com' });
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

    return (
        <>
            <Navbar handleScroll={handleScroll} refs={{ homeRef, aboutRef, projetRef, contactRef }} />
            <div ref={homeRef} className='flex flex-col bgjustify-center bg-blue-300 bg-opacity-50 min-h-[90vh]'>
                {userData.map((data) => (
                    <div key={data._id}>
                        <div className='flex justify-center pt-28'>
                            <img className="w-[300px] rounded-full m-4" src={`http://localhost:3002/${data.profilePic}`} alt="Profile" />
                        </div>
                        <div className='flex justify-center rounded-full p-1 m-5 gap-2'>
                            <div className='bg-white rounded-lg'>
                                <a href={data.linkedinUrl} target='_blank' rel='noreferrer'>
                                    {/* LinkedIn SVG Icon */}
                                </a>
                            </div>
                            <div className='bg-white rounded-lg'>
                                <a href={data.githubUrl} target='_blank' rel='noreferrer'>
                                    {/* GitHub SVG Icon */}
                                </a>
                            </div>
                        </div>
                        <div>
                            <h1 className='text-center text-4xl weo my-2'>
                                Hi! My name is {data.firstName + " " + data.lastName.toUpperCase()}
                            </h1>
                            <div className='flex flex-col justify-center items-center gap-2'>
                                <h2 className='text-left text-4xl weo'>and I'm {article}</h2>
                                <div className='my-4'>
                                    <h2><span className='text-5xl font-bold my-8'>{displayedText}</span></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='bg-red-300 flex' ref={aboutRef}>
                {userData.map((data) => (
                    <div key={data._id} className='flex w-full min-h-[90vh] my-4 justify-center'>
                        <div className='w-full min-w-1/2 gap-4 flex flex-col justify-center items-center'>
                            <div>
                                <h2 className='text-3xl'>Bio</h2>
                            </div>
                            <div>
                                <p className='text-center'>{data.bio}</p>
                            </div>
                        </div>
                        <div className='w-full min-w-1/2 flex flex-col gap-4 justify-center items-center'>
                            <div>
                                <h2 className='text-3xl'>Stack</h2>
                            </div>

                            <div className='flex flex-row flex-wrap gap-4 justify-center'>
                                {data.skills.map((skillsData) => (
                                    <div className='flex' key={skillsData._id}>
                                        <img
                                            className='w-16 h-16 rounded-full border-4'
                                            src={`http://localhost:3002/${skillsData.logo}`}
                                            title={skillsData.name}
                                            alt={skillsData.name}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div ref={projetRef} className='bg-green-300 w-full flex flex-col min-h-[90vh]'>
                <div>
                    <h2 className='text-3xl text-center'>Projets</h2>
                </div>
                {userData.map((data) => (
                    <div key={data._id}>
                        {data.projects.map((projectData, index) => (
                            <div
                                key={projectData._id}
                                className={`relative flex items-center w-full gap-4 justify-center my-2 overflow-hidden ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                            >
                                <div className="flex flex-col w-1/2 items-stretch">
                                    <div>
                                        <h2 className="text-center">{projectData.title}</h2>
                                    </div>
                                    <div>
                                        <p className="px-20">{projectData.description}</p>
                                    </div>
                                </div>
                                <div className="relative m-10 flex items-center justify-center w-1/2 max-h-[500px] rounded-lg overflow-hidden shadow-lg border-4 group">
                                    <img
                                        src={`http://localhost:3002/${projectData.imageUrl}`}
                                        alt={projectData.title}
                                        className="w-full h-full object-contain rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-110"
                                    />
                                </div>
                            </div>

                        ))}
                    </div>
                ))}
            </div >
            <div className='flex flex-col justify-center my-4 min-h-[90vh] items-center gap-4' ref={contactRef}>
                <div className='flex gap-12 justify-center items-center my-12'>
                    <h2 className='font-bold text-3xl'>Un projet ? Une idée ? Prenons contact !</h2>
                </div>
                <div>
                    <form onSubmit={handleSubmit} className='bg-slate-200 flex flex-col gap-4 border-4 justify-center h-full shadow-md rounded-2xl px-8 pt-6 pb-8 mb-4'>
                        <div className='flex gap-4 items-center'>
                            <div className='flex flex-col justify-center'>
                                <label htmlFor="firstName" className='py-2'>First Name</label>
                                <input
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    type="text"
                                    name="firstName"
                                    id="firstName"
                                    placeholder='Your first name'
                                />
                                {errors.firstName && <p style={{ color: "red" }}>{errors.firstName}</p>}
                            </div>
                            <div className='flex flex-col py-2 justify-center'>
                                <label htmlFor="lastName" className='py-2'>Last Name</label>
                                <input
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    type="text"
                                    name="lastName"
                                    id="lastName"
                                    placeholder='Your last name'
                                />
                                {errors.lastName && <p style={{ color: "red" }}>{errors.lastName}</p>}
                            </div>
                        </div>
                        <label htmlFor="contactSecondMail">Contact Email</label>
                        <input
                            value={formData.contactSecondMail}
                            onChange={handleChange}
                            className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            type="email"
                            name='contactSecondMail'
                            id='contactSecondMail'
                            placeholder='Your email'
                        />
                        {errors.contactSecondMail && <p style={{ color: "red" }}>{errors.contactSecondMail}</p>}

                        <label htmlFor="text">Your Message</label>
                        <textarea
                            value={formData.text}
                            onChange={handleChange}
                            className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            name='text'
                            id='text'
                            placeholder='Type your message here'
                        />
                        {errors.text && <p style={{ color: "red" }}>{errors.text}</p>}

                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='submit'>
                            Send
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Home;
