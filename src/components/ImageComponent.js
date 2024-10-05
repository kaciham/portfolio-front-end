// components/ImageComponent.js
import React from 'react';

const ImageComponent = ({ src, alt, className, title, onClick }) => {
    return (
        <img
            src={src}
            alt={alt}
            className={className} // Apply additional classes like 'rounded-full' here
            title={title}
            onClick={onClick}
        />
    );
};

export default ImageComponent;
