import { useState, useEffect } from 'react';
import { getUserData } from '../api/apiCalls';

const Navbar = ({ handleScroll, refs }) => {

    const apiUrl = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_SERVER_PROD;

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
                if (response.data) {
                    setUserData([response.data]);
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
            className={`h-fit p-2 w-full max-w-full z-10 fixed top-0 left-0 transition-all duration-300 ${
                scrollTop ? 'bg-transparent text-black' : 'bg-[#3f6fe6] opacity-70 text-white'
            }`}
            style={{
                backdropFilter: isOpen ? 'blur(10px)' : 'none', 
            }}
        >
            <div className="flex w-full max-w-7xl mx-auto justify-between items-center pr-2">
                <div className="flex items-center py-2">
                    {userData.length > 0 && userData.map(data => (
                        data && data.firstName && data.lastName ? (
                            <div key={data._id} className="flex items-center mx-2 gap-4">
                                <img
                                    className='w-12 md:w-14 rounded-full sm:hover:scale-110 transition-transform duration-100'
                                    src={`${apiUrl}${data.profilePic}`}
                                    alt={`${data.firstName} ${data.lastName.toUpperCase()} profile`}
                                />
                                <h2 className='sm:hover:scale-110 transition-transform duration-100 text-xl font-medium'>
                                    {`${data.firstName} ${data.lastName.toUpperCase()}`}
                                </h2>
                            </div>
                        ) : null
                    ))}
                </div>

                <div className="md:hidden" onClick={toggleMenu}>
                    {/* Hamburger menu */}
                    <div className={`w-10 h-0.5 my-1 transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''} ${scrollTop ? 'bg-black' : 'bg-white'}`}></div>
                    <div className={`w-10 h-0.5 my-1 transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''} ${scrollTop ? 'bg-black' : 'bg-white'}`}></div>
                    <div className={`w-10 h-0.5 my-1 transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''} ${scrollTop ? 'bg-black' : 'bg-white'}`}></div>
                </div>

                <div className="hidden md:flex">
                    {/* Navigation menu */}
                    <ul className='flex gap-2'>
                        <li className='mx-1 text-lg font-medium  cursor-pointer hover:scale-110 transition-transform duration-100' onClick={() => handleScroll(refs.homeRef)}>Accueil</li>
                        <li className='mx-1 text-lg font-medium cursor-pointer hover:scale-110 transition-transform duration-100' onClick={() => handleScroll(refs.aboutRef)}>À Propos</li>
                        <li className='mx-1 text-lg font-medium cursor-pointer hover:scale-110 transition-transform duration-100' onClick={() => handleScroll(refs.projetRef)}>Projets</li>
                        <li className='mx-1 text-lg  font-medium cursor-pointer hover:scale-110 transition-transform duration-100' onClick={() => handleScroll(refs.contactRef)}>Contact</li>
                    </ul>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden flex sticky z-10 flex-col ${isOpen ? 'block' : 'hidden'}`}>
                <ul className='flex flex-col justify-center items-end'>
                    <li className='mr-5 my-2 text-2xl cursor-pointer hover:scale-110 transition-transform duration-100' onClick={() => handleMenuClick(refs.homeRef)}>Accueil</li>
                    <li className='mr-5 my-2 text-2xl cursor-pointer hover:scale-110 transition-transform duration-100' onClick={() => handleMenuClick(refs.aboutRef)}>À Propos</li>
                    <li className='mr-5 my-2 text-2xl cursor-pointer hover:scale-110 transition-transform duration-100' onClick={() => handleMenuClick(refs.projetRef)}>Projets</li>
                    <li className='mr-5 my-2 text-2xl cursor-pointer hover:scale-110 transition-transform duration-100' onClick={() => handleMenuClick(refs.contactRef)}>Contact</li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
