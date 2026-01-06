import React from 'react';

// Simple mock for next/image that renders a standard img tag
const Image = ({ src, alt, width, height, className, style, ...props }: any) => {
    // If src is an object (imported image), use .src (Next.js) or .default (Vite), otherwise use it directly
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
