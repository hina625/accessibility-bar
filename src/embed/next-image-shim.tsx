import React, { forwardRef } from 'react';

const NextImageShim = forwardRef<HTMLImageElement, any>(({ src, alt, width, height, className, style, ...props }, ref) => {
    const imageSrc = typeof src === 'object' && src !== null && 'src' in src ? src.src : src;

    return (
        <img
            ref={ref}
            src={imageSrc}
            alt={alt || ''}
            width={width}
            height={height}
            className={className}
            style={{
                ...style,
                maxWidth: '100%',
                height: 'auto',
            }}
            {...props}
        />
    );
});

NextImageShim.displayName = 'NextImageShim';

export default NextImageShim;
