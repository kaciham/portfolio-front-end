import React from 'react';
import { FaLinkedinIn, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className='flex flex-col items-center justify-center bg-[#243873] text-white py-8 px-4'>
            <div className='w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6'>
                <div className='text-center sm:text-left'>
                    <h2 className='text-2xl font-bold'>Kaci HAMROUN</h2>
                    <p className='text-lg'>Développeur Full-Stack</p>
                </div>
                
                {/* Social Media Links */}
                <div className='flex flex-col items-center'>
                    <h3 className='text-lg font-semibold'>Suivez-moi</h3>
                    <div className='flex mt-2 space-x-4  justify-center'>
                        <a href='https://www.linkedin.com/in/kaci-hamroun/' className='text-xl hover:text-[#47A0D9] transition' target='_blank' rel='noreferrer'><FaLinkedinIn /></a>
                        <a href='https://github.com/kaciham' className='text-xl hover:text-[#47A0D9] transition' target='_blank' rel='noreferrer'><FaGithub /></a>
                    </div>
                </div>
                
                {/* Contact Info */}
                <div className='flex flex-col items-center sm:items-start'>
                    <h3 className='text-lg font-semibold'>Contact</h3>
                    <p className='mt-2 font-light'>Email: kacihamrounpro@gmail.com</p>
                    <p className='font-light'>Téléphone: +33 6 18 37 41 61</p>
                </div>
            </div>
            
            {/* Copyright Section */}
            <div className='w-full text-center mt-6 border-t border-gray-600 pt-4'>
                <p className='text-sm'>© {new Date().getFullYear()} Kaci HAMROUN. Tous droits réservés.</p>
            </div>
        </footer>
    );
};

export default Footer;
