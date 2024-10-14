import { useState, useEffect } from 'react';
import axios from "axios";

const Navbar = ({ handleScroll, refs }) => {

    const apiUrl = process.env.REACT_APP_SERVER_DEV;

    const [isOpen, setIsOpen] = useState(false); // Menu toggle state
    const [userData, setUserData] = useState([]);
    const [scrollTop, setScrollTop] = useState(true); // Track if the scroll is at the top

    // Toggle menu open and close
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        // Fetch user data from backend
    const fetchProjects = async () => {
        try {
            const response = await axios.get(`${apiUrl}api/kaci`); // Replace with your actual backend URL
            const dataFetched = response.data;
            setUserData([dataFetched]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
        fetchProjects(); // Fetch user data on component mount
    },[apiUrl]);

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
            className={`h-fit p-2  w-full z-10 fixed top-0 left-0 transition-all duration-300 ${
                scrollTop ? 'bg-transparent text-black' : 'bg-[#65A0CA] opacity-90 text-white'
            }`}
            style={{
                backdropFilter: isOpen ? 'blur(10px)' : 'none', // Apply blur when the menu is open
            }}
        >
            <div className="flex w-full justify-between items-center pr-2  ">
                <div className="flex items-center py-2">
                    {userData.map(data => (
                        <div key={data._id} className="flex items-center mx-2 gap-4">
                            <img className='w-14 rounded-full sm:hover:scale-110 transition-transform duration-100' src={`${apiUrl}${data.profilePic}`} alt={`${data.firstName} ${data.lastName.toUpperCase()} profile`} />
                            <h2 className='sm:hover:scale-110 transition-transform duration-100'>{`${data.firstName} ${data.lastName.toUpperCase()}`}</h2>
                        </div>
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
                        <li className='mx-2 text-xl cursor-pointer hover:scale-110 transition-transform duration-100' onClick={() => handleScroll(refs.homeRef)}>Accueil</li>
                        <li className='mx-2 text-xl cursor-pointer hover:scale-110 transition-transform duration-100' onClick={() => handleScroll(refs.aboutRef)}>À Propos</li>
                        <li className='mx-2 text-xl cursor-pointer hover:scale-110 transition-transform duration-100' onClick={() => handleScroll(refs.projetRef)}>Projets</li>
                        <li className='mx-2 text-xl cursor-pointer hover:scale-110 transition-transform duration-100' onClick={() => handleScroll(refs.contactRef)}>Contact</li>
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
