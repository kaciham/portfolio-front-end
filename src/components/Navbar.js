import { NavLink } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from "axios";

const Navbar = ({ handleScroll, homeRef, aboutRef, serviceRef, refs }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [userData, setUserData] = useState([]);

    // Handles the opening and closing of the nav
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Fetch projects data from backend
    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:3002/api/kaci'); // Replace with your actual backend URL
            const dataFetched = response.data;
            console.log(dataFetched)
            setUserData([dataFetched]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchProjects(); // Fetch projects data when the component mounts
    }, []);

    return (
        <div className="App fixed w-full z-10">
            <nav className="bg-gradient-to-r from-cyan-500 to-blue-800 p-4 ">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-white text-2xl flex items-center py-2">
                        {userData.map(data => (
                            <div key={data._id} className="flex items-center mx-2 gap-4">
                                <img className='w-14 rounded-full' src={`http://localhost:3002/${data.profilePic}`} alt={data.firstName + " " + data.lastName + " profile picture"} />
                                <h2>{data.firstName + " " + data.lastName.toUpperCase()}</h2>

                            </div>
                        ))}
                    </div>
                    <div className="md:hidden" onClick={toggleMenu}>
                        <div className={`w-8 h-0.5 bg-white my-1 transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
                        <div className={`w-8 h-0.5 bg-white my-1 transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
                        <div className={`w-8 h-0.5 bg-white my-1 transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                    </div>
                    <div className="hidden md:flex space-x-6">
                        <ul className='flex'>
                            <li className='mx-4 text-white text-2xl cursor-pointer' onClick={() => handleScroll(refs.homeRef)}>Accueil</li>
                            <li className='mx-4 text-white text-2xl cursor-pointer' onClick={() => handleScroll(refs.aboutRef)}>À Propos</li>
                            <li className='mx-4 text-white text-2xl cursor-pointer' onClick={() => handleScroll(refs.projetRef)}>Projets</li>
                            <li className='mx-4 text-white text-2xl cursor-pointer' onClick={() => handleScroll(refs.contactRef)}>Contact</li>

                        </ul>
                    </div>
                </div>
                <div className={`md:hidden flex sticky z-10 flex-col ${isOpen ? 'block' : 'hidden'}`}>
                    <ul className='flex flex-col items-end my-2'>
                        <NavLink to="/">
                            <li className='mx-2 text-white my-2'>Accueil</li>
                        </NavLink>
                        <NavLink to="/about">
                            <li className='mx-2 text-white my-2'>À Propos</li>
                        </NavLink>
                        <NavLink to="/service">
                            <li className='mx-2 text-white my-2'>Services</li>
                        </NavLink>
                        <NavLink to="/contact">
                            <li className='mx-2 text-white my-2'>Contact</li>
                        </NavLink>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
