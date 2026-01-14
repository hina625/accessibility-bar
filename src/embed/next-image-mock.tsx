import React from 'react';

const Image = ({ src, alt, width, height, className, style, ...props }: any) => {
        
    let imageSrc = src;
    if (typeof src === 'object' && src !== null) {
        if ('src' in src) imageSrc = src.src;
        else if ('default' in src) imageSrc = src.default;
    }

    return (
        <img
            src={imageSrc}
            alt={alt || ''}
            width={width}
            height={height}
            className={className}
            style={style}
            {...props}
        />
    );
};

export default Image;
