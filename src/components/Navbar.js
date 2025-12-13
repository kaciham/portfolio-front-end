import { useState, useEffect } from 'react';
import { getUserData } from '../api/apiCalls';
import { API_BASE_URL } from '../config/apiConfig';
import { getImageUrl } from '../utils/imageHelpers';

const Navbar = ({ handleScroll, refs }) => {

    const apiUrl = API_BASE_URL;

    const [isOpen, setIsOpen] = useState(false); // Menu toggle state
    const [userData, setUserData] = useState([]);
    const [scrollTop, setScrollTop] = useState(true); // Track if the scroll is at the top

    // Toggle menu open and close
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        // Fetch user data from backend
        const fetchUserData = async () => {
            try {
                const response = await getUserData();
                if (response.error) {
                    console.error('Error fetching navbar data:', response.error);
                    return;
                }
                if (response.data && response.data.portfolios && response.data.portfolios.length > 0) {
                    // Extract the first portfolio from the portfolios array
                    setUserData([response.data.portfolios[0]]);
                } else {
                    console.warn('No portfolios found in response');
                }
            } catch (error) {
                console.error('Error fetching navbar data:', error);
            }
        };
        fetchUserData(); // Fetch user data on component mount
    }, []);

    // Track scroll position to update navbar style
    useEffect(() => {
        const handleScroll = () => {
            setScrollTop(window.scrollY === 0); // Set scrollTop to true if scroll position is at 0
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll); // Clean up scroll listener on unmount
        };
    }, []);

    // Function to handle both scrolling and closing the menu
    const handleMenuClick = (ref) => {
        handleScroll(ref); // Scroll to the relevant section
        if (isOpen) toggleMenu(); // Close the mobile menu if it's open
    };

    return (
        <nav
            className={`h-fit p-2 w-full max-w-full z-50 fixed top-0 left-0 transition-all duration-300 backdrop-blur-md ${
                scrollTop ? 'bg-web3-dark/30 text-white' : 'bg-web3-dark/80  text-white'
            }`}
        >
            <div className="flex w-full max-w-7xl mx-auto justify-between items-center pr-2">
                <div className="flex items-center py-2">
                    {userData.length > 0 && userData.map(data => (
                        data && data.firstName && data.lastName ? (
                            <div key={data._id} className="flex items-center mx-2 gap-4">
                                <img
                                    className='w-12 md:w-14 rounded-full border-2 border-web3-accent/30 hover:border-web3-accent sm:hover:scale-110 transition-all duration-300'
                                    src={getImageUrl(apiUrl, data.profilePic)}
                                    alt={`${data.firstName} ${data.lastName} profile`}
                                />
                                <h2 className='sm:hover:scale-110 transition-transform duration-300 text-xl font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
                                    {`${data.firstName} ${data.lastName}`}
                                </h2>
                            </div>
                        ) : null
                    ))}
                </div>

                <div className="md:hidden cursor-pointer" onClick={toggleMenu}>
                    {/* Hamburger menu */}
                    <div className={`w-10 h-0.5 my-1 transition-transform duration-300 bg-web3-accent ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                    <div className={`w-10 h-0.5 my-1 transition-opacity duration-300 bg-web3-accent ${isOpen ? 'opacity-0' : ''}`}></div>
                    <div className={`w-10 h-0.5 my-1 transition-transform duration-300 bg-web3-accent ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                </div>

                <div className="hidden md:flex">
                    {/* Navigation menu */}
                    <ul className='flex gap-2'>
                        <li className='mx-1 text-lg font-medium cursor-pointer hover:text-web3-accent transition-all duration-300 relative group' onClick={() => handleScroll(refs.homeRef)}>
                            Accueil
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-web3-accent group-hover:w-full transition-all duration-300"></span>
                        </li>
                        <li className='mx-1 text-lg font-medium cursor-pointer hover:text-web3-accent transition-all duration-300 relative group' onClick={() => handleScroll(refs.aboutRef)}>
                            À Propos
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-web3-accent group-hover:w-full transition-all duration-300"></span>
                        </li>
                        <li className='mx-1 text-lg font-medium cursor-pointer hover:text-web3-accent transition-all duration-300 relative group' onClick={() => handleScroll(refs.projetRef)}>
                            Projets
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-web3-accent group-hover:w-full transition-all duration-300"></span>
                        </li>
                        <li className='mx-1 text-lg font-medium cursor-pointer hover:text-web3-accent transition-all duration-300 relative group' onClick={() => handleScroll(refs.contactRef)}>
                            Contact
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-web3-accent group-hover:w-full transition-all duration-300"></span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden flex sticky z-10 flex-col ${isOpen ? 'block' : 'hidden'} backdrop-blur-lg bg-web3-dark/90 rounded-b-2xl border-b border-web3-accent/20`}>
                <ul className='flex flex-col justify-center items-end p-4'>
                    <li className='mr-5 my-2 text-2xl cursor-pointer hover:text-web3-accent transition-all duration-300' onClick={() => handleMenuClick(refs.homeRef)}>Accueil</li>
                    <li className='mr-5 my-2 text-2xl cursor-pointer hover:text-web3-accent transition-all duration-300' onClick={() => handleMenuClick(refs.aboutRef)}>À Propos</li>
                    <li className='mr-5 my-2 text-2xl cursor-pointer hover:text-web3-accent transition-all duration-300' onClick={() => handleMenuClick(refs.projetRef)}>Projets</li>
                    <li className='mr-5 my-2 text-2xl cursor-pointer hover:text-web3-accent transition-all duration-300' onClick={() => handleMenuClick(refs.contactRef)}>Contact</li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
