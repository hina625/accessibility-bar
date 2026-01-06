
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import css from './embed.css?inline';

import tailwindCss from './embed-tailwind.css?inline';

interface ShadowPortalProps {
    children: React.ReactNode;
}

export const ShadowPortal: React.FC<ShadowPortalProps> = ({ children }) => {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const shadowRoot = useRef<ShadowRoot | null>(null);
   
    const [ready, setReady] = useState(false);

    useEffect(() => {
       
        const host = document.createElement('div');
        host.style.position = 'absolute';
        host.style.top = '0';
        host.style.left = '0';
        host.style.width = '0';
        host.style.height = '0';
        host.id = 'a11y-shadow-portal-' + Math.random().toString(36).substr(2, 9);

        document.body.appendChild(host);
        hostRef.current = host;

      
        const shadow = host.attachShadow({ mode: 'open' });
        shadowRoot.current = shadow;

       
        try {
            const tailwindStyle = document.createElement('style');
            tailwindStyle.textContent = tailwindCss;
            shadow.appendChild(tailwindStyle);

            const style = document.createElement('style');
            style.textContent = css;
            shadow.appendChild(style);
        } catch (e) {
            console.error('ShadowPortal: Failed to inject styles', e);
        }

        const container = document.createElement('div');
        container.id = 'shadow-portal-root';
    
        shadow.appendChild(container);

        setReady(true);

        return () => {
            if (host.parentNode) {
                host.parentNode.removeChild(host);
            }
        };
    }, []);

    if (!ready || !shadowRoot.current) return null;

 
    const container = shadowRoot.current.getElementById('shadow-portal-root');
    if (!container) return null;

    return createPortal(children, container);
};
