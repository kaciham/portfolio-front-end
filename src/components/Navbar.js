import { useState, useEffect, useCallback } from 'react';
import { getUserData } from '../api/apiCalls';
import { API_BASE_URL } from '../config/apiConfig';
import { getImageUrl } from '../utils/imageHelpers';

const Navbar = ({ handleScroll, refs }) => {
    const apiUrl = API_BASE_URL;
    const [isOpen, setIsOpen] = useState(false);
    const [userData, setUserData] = useState([]);
    const [scrolled, setScrolled] = useState(false);

    const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getUserData();
                if (response.error) return;
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
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            scrolled
                ? 'bg-white/90 backdrop-blur-xl border-b border-border shadow-sm'
                : 'bg-transparent'
        }`}>
            <div className="flex w-full max-w-6xl mx-auto justify-between items-center px-6 py-3">
                {/* Logo + Name */}
                <div className="flex items-center gap-3">
                    {userData.length > 0 && userData.map(data => (
                        data?.firstName && data?.lastName ? (
                            <div key={data._id} className="flex items-center gap-3 cursor-pointer" onClick={() => handleScroll(refs.homeRef)}>
                                <img
                                    className="w-9 h-9 rounded-full border border-border object-cover transition-all duration-200 hover:border-accent/40"
                                    src={getImageUrl(apiUrl, data.profilePic)}
                                    alt={`${data.firstName} ${data.lastName}`}
                                    width={36} height={36} loading="eager" decoding="async"
                                />
                                <span className="text-sm font-semibold text-foreground tracking-tight">
                                    {data.firstName} {data.lastName}
                                </span>
                            </div>
                        ) : null
                    ))}
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                    onClick={toggleMenu}
                    aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                    aria-expanded={isOpen}
                >
                    <div className={`w-5 h-0.5 bg-foreground transition-all duration-200 ${isOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
                    <div className={`w-5 h-0.5 bg-foreground mt-1 transition-all duration-200 ${isOpen ? 'opacity-0' : ''}`} />
                    <div className={`w-5 h-0.5 bg-foreground mt-1 transition-all duration-200 ${isOpen ? '-rotate-45 -translate-y-[3px]' : ''}`} />
                </button>

                {/* Desktop nav */}
                <ul className="hidden md:flex items-center gap-1">
                    {navLinks.map(link => (
                        <li key={link.label}>
                            <button
                                onClick={() => handleScroll(link.ref)}
                                className="px-4 py-2 text-sm font-medium text-muted-fg hover:text-foreground rounded-lg hover:bg-muted transition-all duration-200 cursor-pointer"
                            >
                                {link.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden transition-all duration-200 overflow-hidden ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-white/95 backdrop-blur-xl border-t border-border px-6 py-3">
                    <ul className="flex flex-col gap-1">
                        {navLinks.map(link => (
                            <li key={link.label}>
                                <button
                                    onClick={() => handleMenuClick(link.ref)}
                                    className="w-full text-left px-4 py-3 text-base font-medium text-muted-fg hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200"
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
