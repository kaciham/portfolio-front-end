import React from 'react';

const TopIcon = ({iconSource }) => {
    return (
        <div className="cursor-pointer flex justify-center items-center w-full h-full ">
            <img src={iconSource} alt="Scroll to top" className='w-full h-full'  />
        </div>
    );
};

export default TopIcon;