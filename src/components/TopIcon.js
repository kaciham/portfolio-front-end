    import React from 'react';

    const TopIcon = ({iconSource }) => {
        return (
            <div className="cursor-pointer flex justify-center items-center w-full h-full bg-white rounded-full">
                <img src={iconSource} alt="Scroll to top" className='h-full w-full p-2'/>
            </div>
        );
    };

    export default TopIcon;