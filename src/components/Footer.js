import React from 'react';

const Footer = () => {
    return (
        <div className='flex flex-col h-[40vh] w-screen items-center justify-center bg-[#6793e0] py-4'>
            <div className='flex flex-col gap-4  sm:flex-row justify-around md:w-screen'>
            <div>
                <div><h2 className='text-center sm:text-2xl text-xl text-white'>Kaci HAMROUN</h2></div>
                <div><p className='text-center sm:text-4xl text-xl text-white'>Développeur Full-Stack</p></div>
                </div>
                <hr />
                <div>
                <div><p className='text-center sm:text-2xl text-xl text-white'>© Copyright 2024</p></div>
                <div><p className='text-center sm:text-2xl text-xl text-white'>Créé par Kaci HAMROUN</p></div>
                </div>
            </div>
        </div>
    );
};

export default Footer;