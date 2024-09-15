import React from 'react';

const Footer = () => {
    return (
        <div className='flex flex-col h-[40vh] items-center justify-center bg-sky-200 py-4 '>
            <div className='flex flex-col gap-4 justify-center'>
                <div><h2 className='text-center'>Kaci HAMROUN</h2></div>
                <div><p className='text-center'>Développeur Full-Stack</p></div>
                <div><p className='text-center'>© Copyright 2024 - Créé par Kaci HAMROUN</p></div>
            </div>
        </div>
    );
};

export default Footer;