import React from 'react';
import { FaLinkedinIn, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className='flex flex-col items-center justify-center bg-web3-darker border-t border-web3-accent/20 text-white py-8 px-4 mt-12'>
            <div className='w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6'>
                <div className='text-center sm:text-left'>
                    <h2 className='text-2xl font-bold bg-gradient-to-r from-web3-accent to-web3-purple bg-clip-text text-transparent'>Kaci HAMROUN</h2>
                    <p className='text-lg text-gray-300'>Développeur Full-Stack</p>
                </div>

                {/* Social Media Links */}
                <div className='flex flex-col items-center'>
                    <h3 className='text-lg font-semibold text-gray-300'>Suivez-moi</h3>
                    <div className='flex mt-2 space-x-4 justify-center'>
                        <a href='https://www.linkedin.com/in/kaci-hamroun/' className='text-2xl text-gray-400 hover:text-web3-accent transition-all duration-300 hover:scale-110' target='_blank' rel='noreferrer'>
                            <FaLinkedinIn />
                        </a>
                        <a href='https://github.com/kaciham' className='text-2xl text-gray-400 hover:text-web3-accent transition-all duration-300 hover:scale-110' target='_blank' rel='noreferrer'>
                            <FaGithub />
                        </a>
                    </div>
                </div>

                {/* Contact Info */}
                <div className='flex flex-col items-center sm:items-start'>
                    <h3 className='text-lg font-semibold text-gray-300'>Contact</h3>
                    <p className='mt-2 font-light text-gray-400'>Email: kacihamrounpro@gmail.com</p>
                    <p className='font-light text-gray-400'>Téléphone: +33 6 18 37 41 61</p>
                </div>
            </div>

            {/* Copyright Section */}
            <div className='w-full text-center mt-6 border-t border-web3-accent/20 pt-4'>
                <p className='text-sm text-gray-400'>© {new Date().getFullYear()} Kaci HAMROUN. Tous droits réservés.</p>
            </div>
        </footer>
    );
};

export default Footer;
