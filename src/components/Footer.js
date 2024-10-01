import React from 'react';

const Footer = () => {
    return (
        <div className='flex flex-col h-[40vh] items-center justify-center bg-[#65a0ca] py-4 '>
            <div className='flex flex-col gap-4 justify-center'>
                <div><h2 className='text-center text-4xl text-white'>Kaci HAMROUN</h2></div>
                <div><p className='text-center text-2xl text-white'>Développeur Full-Stack</p></div>
                <div><p className='text-center text-2xl text-white'>© Copyright 2024 - Créé par Kaci HAMROUN</p></div>
            </div>
        </div>
    );
};

export default Footer;