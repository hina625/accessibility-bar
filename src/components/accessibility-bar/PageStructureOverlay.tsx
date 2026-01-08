import React, { useState, useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';

interface HeadingItem {
    level: number;
    text: string;
    element: Element;
}

interface LandmarkItem {
    type: string;
    label: string;
    element: Element;
}

interface LinkItem {
    text: string;
    href: string;
    element: Element;
}

export default function PageStructureOverlay() {
    const { panelPosition, barTheme, pageStructure, togglePageStructure } = useAccessibility();
    const theme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

    const [activeTab, setActiveTab] = useState<'headings' | 'landmarks' | 'links'>('headings');
    const [headings, setHeadings] = useState<HeadingItem[]>([]);
    const [landmarks, setLandmarks] = useState<LandmarkItem[]>([]);
    const [links, setLinks] = useState<LinkItem[]>([]);

    useEffect(() => {
        if (pageStructure) {
            scanPage();
        }
    }, [pageStructure]);

    const scanPage = () => {

        const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const headingList: HeadingItem[] = [];
        headingElements.forEach((el) => {
            if (!el.closest('.accessibility-bar')) {
                const level = parseInt(el.tagName.charAt(1));
                const text = el.textContent?.trim() || '';
                if (text) {
                    headingList.push({ level, text, element: el });
                }
            }
        });
        setHeadings(headingList);

        const landmarkSelectors = [
            { selector: 'header, [role="banner"]', type: 'Banner' },
            { selector: 'nav, [role="navigation"]', type: 'Navigation' },
            { selector: 'main, [role="main"]', type: 'Main' },
            { selector: 'aside, [role="complementary"]', type: 'Complementary' },
            { selector: 'footer, [role="contentinfo"]', type: 'Content Info' },
            { selector: '[role="search"]', type: 'Search' },
            { selector: '[role="region"]', type: 'Region' },
            { selector: 'form, [role="form"]', type: 'Form' },
        ];

        const landmarkList: LandmarkItem[] = [];
        const seenElements = new Set<Element>();

        landmarkSelectors.forEach(({ selector, type }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el) => {
                if (!el.closest('.accessibility-bar') && !seenElements.has(el)) {
                    seenElements.add(el);
                    const label = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.textContent?.slice(0, 50).trim() || type;
                    landmarkList.push({ type, label: label.length > 50 ? label.slice(0, 47) + '...' : label, element: el });
                }
            });
        });
        setLandmarks(landmarkList);

        const linkElements = document.querySelectorAll('a[href]');
        const linkList: LinkItem[] = [];
        linkElements.forEach((el) => {
            if (!el.closest('.accessibility-bar')) {
                const text = el.textContent?.trim() || el.getAttribute('aria-label') || '';
                const href = el.getAttribute('href') || '';
                if (text && href) {
                    linkList.push({ text: text.length > 60 ? text.slice(0, 57) + '...' : text, href, element: el });
                }
            }
        });
        setLinks(linkList);
    };

    const scrollToElement = (element: Element) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });


        const originalOutline = (element as HTMLElement).style.outline;
        const originalBackground = (element as HTMLElement).style.backgroundColor;
        (element as HTMLElement).style.outline = '3px solid #3B82F6';
        (element as HTMLElement).style.backgroundColor = 'rgba(59, 130, 246, 0.1)';

        setTimeout(() => {
            (element as HTMLElement).style.outline = originalOutline;
            (element as HTMLElement).style.backgroundColor = originalBackground;
        }, 2000);
    };

    const getLevelColor = (level: number) => {
        const colors: Record<number, string> = {
            1: 'bg-red-500',
            2: 'bg-orange-500',
            3: 'bg-yellow-500',
            4: 'bg-green-500',
            5: 'bg-blue-500',
            6: 'bg-purple-500',
        };
        return colors[level] || 'bg-gray-500';
    };

    if (!pageStructure) return null;

    return (
        <div
            className={`fixed z-[2147483650] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out
                ${(panelPosition === 'left' || panelPosition === 'right')
                    ? `top-0 bottom-0 w-[340px] border-x ${panelPosition === 'left' ? 'left-0' : 'right-0'}`
                    : 'inset-y-0 right-0 w-80 border-l'
                }
            `}
            style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                transform: 'translateX(0)',
                color: theme.text,
                pointerEvents: 'auto'
            }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 border-b"
                style={{
                    backgroundColor: `${theme.hover}`,
                    borderColor: `${theme.text}20`
                }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="p-1.5 rounded-lg"
                        style={{ backgroundColor: `${theme.active}33` }}
                    >
                        <svg className="w-5 h-5" style={{ color: theme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold" style={{ color: theme.text }}>Page Structure</h2>
                </div>
                <button
                    onClick={togglePageStructure}
                    className="p-2 pr-4 rounded-lg transition-colors flex items-center gap-1.5"
                    style={{ color: theme.text }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.text}10`}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    <span className="text-xs font-bold uppercase tracking-wide">Close</span>
                </button>
            </div>


            <div
                className="px-4 py-3 border-b"
                style={{
                    backgroundColor: `${theme.hover}80`,
                    borderColor: `${theme.text}10`
                }}
            >
                <p className="text-sm opacity-70">
                    Provides an overview of the webpage's layout by displaying key elements such as headings, landmarks, and links.
                </p>
            </div>

            <div
                className="flex border-b"
                style={{
                    backgroundColor: theme.background,
                    borderColor: `${theme.text}20`
                }}
            >
                {(['headings', 'landmarks', 'links'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-sm font-medium transition-all relative capitalize`}
                        style={{
                            color: activeTab === tab ? theme.text : `${theme.text}80`,
                            backgroundColor: activeTab === tab ? `${theme.active}20` : 'transparent'
                        }}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div
                                className="absolute bottom-0 left-0 right-0 h-0.5"
                                style={{ backgroundColor: theme.active }}
                            />
                        )}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                {activeTab === 'headings' && (
                    <>
                        {headings.length === 0 ? (
                            <p className="opacity-40 italic text-center py-8">No headings found on this page.</p>
                        ) : (
                            headings.map((heading, index) => (
                                <button
                                    key={index}
                                    onClick={() => scrollToElement(heading.element)}
                                    className="w-full flex items-center gap-3 p-3 rounded-none border transition-colors text-left"
                                    style={{
                                        backgroundColor: theme.hover,
                                        borderColor: `${theme.text}10`,
                                        color: theme.text
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                                >
                                    <span className={`${getLevelColor(heading.level)} text-white text-xs font-bold px-2 py-1 rounded`}>
                                        H{heading.level}
                                    </span>
                                    <span className="text-sm truncate flex-1">{heading.text}</span>
                                </button>
                            ))
                        )}
                    </>
                )}

                {activeTab === 'landmarks' && (
                    <>
                        {landmarks.length === 0 ? (
                            <p className="opacity-40 italic text-center py-8">No landmarks found on this page.</p>
                        ) : (
                            landmarks.map((landmark, index) => (
                                <button
                                    key={index}
                                    onClick={() => scrollToElement(landmark.element)}
                                    className="w-full flex items-center gap-3 p-3 rounded-none border transition-colors text-left"
                                    style={{
                                        backgroundColor: theme.hover,
                                        borderColor: `${theme.text}10`,
                                        color: theme.text
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                                >
                                    <span className="bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded">
                                        {landmark.type}
                                    </span>
                                    <span className="text-sm truncate flex-1">{landmark.label}</span>
                                </button>
                            ))
                        )}
                    </>
                )}

                {activeTab === 'links' && (
                    <>
                        {links.length === 0 ? (
                            <p className="opacity-40 italic text-center py-8">No links found on this page.</p>
                        ) : (
                            links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => scrollToElement(link.element)}
                                    className="w-full flex flex-col gap-1 p-3 rounded-none border transition-colors text-left"
                                    style={{
                                        backgroundColor: theme.hover,
                                        borderColor: `${theme.text}10`
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.active}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                                >
                                    <span className="text-sm font-medium" style={{ color: theme.active === theme.background ? theme.text : theme.active }}>{link.text}</span>
                                    <span className="text-xs opacity-50 truncate" style={{ color: theme.text }}>{link.href}</span>
                                </button>
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
