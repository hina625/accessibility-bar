import React, { forwardRef } from 'react';

const NextImageShim = forwardRef<HTMLImageElement, any>(({ src, alt, width, height, className, style, ...props }, ref) => {
    // Handle static imports (which might be an object with .src)
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
                // Next.js Image often implies display block or handling layout, 
                // but 'auto' height usually covers responsive needs.
            }}
            {...props}
        />
    );
});

NextImageShim.displayName = 'NextImageShim';

export default NextImageShim;
