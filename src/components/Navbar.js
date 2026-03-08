import { useState, useEffect, useCallback } from 'react';
import { getUserData } from '../api/apiCalls';
import { API_BASE_URL } from '../config/apiConfig';
import { getImageUrl } from '../utils/imageHelpers';

const Navbar = ({ handleScroll, refs }) => {
    const apiUrl = API_BASE_URL;
    const [isOpen, setIsOpen] = useState(false);
    const [userData, setUserData] = useState([]);
    const [scrolled, setScrolled] = useState(false);

    const toggleMenu = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getUserData();
                if (response.error) {
                    console.error('Error fetching navbar data:', response.error);
                    return;
                }
                if (response.data?.portfolios?.length > 0) {
                    setUserData([response.data.portfolios[0]]);
                }
            } catch (error) {
                console.error('Error fetching navbar data:', error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleMenuClick = (ref) => {
        handleScroll(ref);
        if (isOpen) toggleMenu();
    };

    const navLinks = [
        { label: 'Accueil', ref: refs.homeRef },
        { label: 'À Propos', ref: refs.aboutRef },
        { label: 'Projets', ref: refs.projetRef },
        { label: 'Contact', ref: refs.contactRef },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-[#050506]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_0_0_rgba(255,255,255,0.06)]'
                    : 'bg-transparent'
            }`}
        >
            <div className="flex w-full max-w-7xl mx-auto justify-between items-center px-4 py-3">
                {/* Logo + Name */}
                <div className="flex items-center gap-3">
                    {userData.length > 0 && userData.map(data => (
                        data?.firstName && data?.lastName ? (
                            <div key={data._id} className="flex items-center gap-3 cursor-pointer" onClick={() => handleScroll(refs.homeRef)}>
                                <img
                                    className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/[0.1] hover:border-linear-accent/50 transition-all duration-200 object-cover"
                                    src={getImageUrl(apiUrl, data.profilePic)}
                                    alt={`${data.firstName} ${data.lastName}`}
                                    width={40}
                                    height={40}
                                    loading="eager"
                                    decoding="async"
                                />
                                <span className="text-sm font-semibold text-linear-fg tracking-tight">
                                    {`${data.firstName} ${data.lastName}`}
                                </span>
                            </div>
                        ) : null
                    ))}
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-linear-accent/50 focus:ring-offset-2 focus:ring-offset-[#050506]"
                    onClick={toggleMenu}
                    aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                    aria-expanded={isOpen}
                >
                    <div className={`w-5 h-0.5 bg-linear-fg transition-all duration-200 ${isOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
                    <div className={`w-5 h-0.5 bg-linear-fg mt-1 transition-all duration-200 ${isOpen ? 'opacity-0' : ''}`} />
                    <div className={`w-5 h-0.5 bg-linear-fg mt-1 transition-all duration-200 ${isOpen ? '-rotate-45 -translate-y-[3px]' : ''}`} />
                </button>

                {/* Desktop nav */}
                <ul className="hidden md:flex items-center gap-1">
                    {navLinks.map(link => (
                        <li key={link.label}>
                            <button
                                onClick={() => handleScroll(link.ref)}
                                className="px-3 py-1.5 text-sm font-medium text-linear-muted hover:text-linear-fg rounded-lg hover:bg-white/[0.05] transition-all duration-200 cursor-pointer"
                            >
                                {link.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden transition-all duration-200 overflow-hidden ${
                    isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="bg-[#050506]/95 backdrop-blur-xl border-t border-white/[0.06] px-4 py-3">
                    <ul className="flex flex-col gap-1">
                        {navLinks.map(link => (
                            <li key={link.label}>
                                <button
                                    onClick={() => handleMenuClick(link.ref)}
                                    className="w-full text-left px-4 py-3 text-base font-medium text-linear-muted hover:text-linear-fg hover:bg-white/[0.05] rounded-lg transition-all duration-200"
                                >
                                    {link.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
