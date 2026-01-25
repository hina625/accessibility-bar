import { useState, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import Image from 'next/image';
import infoIcon from '@/assets/icons/info.png';
import { translations } from '@/contexts/accessibility/translations';

interface Category {
    id: string;
    name: string;
    icon: any;
    colorClass: string;
    indicatorClass: string;
}

interface InfoPageProps {
    onClose: () => void;
    categories: Category[];
}

export default function InfoPage({ onClose, categories }: InfoPageProps) {
    const { barTheme, language } = useAccessibility();
    // Removed showForm state as we are now showing everything linearly

    const t = translations[language] || translations['en'];
    const contactFormRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const currentTheme = BAR_THEMES[barTheme];

    const isYellowTheme = barTheme === 'yellow';
    const accentColor = isYellowTheme ? '#FFFFFF' : '#FFD700';
    const accentTextColor = isYellowTheme ? '#000000' : '#000000';

    const guideTheme = {
        bg: currentTheme.background,
        headerBg: currentTheme.background,
        cardBg: currentTheme.hover,
        cardBorder: currentTheme.border,
        text: currentTheme.text,
        accentYellow: accentColor
    };

    return (
        <div
            className="accessibility-bar pointer-events-auto fixed inset-0 z-[2147483647] animate-fade-in flex flex-col"
            style={{
                backgroundColor: guideTheme.bg,
                color: guideTheme.text,
                fontFamily: 'sans-serif'
            }}
        >

            <div
                className="flex items-start justify-between px-8 py-5 z-[50] relative"
                style={{ backgroundColor: guideTheme.bg }}
            >
                <div className="flex items-start gap-6 pt-2">
                    <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-2xl transition-all active:scale-95 bg-white/5 mt-1">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="flex items-start gap-4 pt-1">
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl text-black shadow-lg mt-1 overflow-hidden"
                            style={{ backgroundColor: guideTheme.accentYellow, color: accentTextColor }}
                        >
                            <Image src={infoIcon} alt="" width={28} height={28} className="brightness-0" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight pt-1">Features Guide</h1>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-2 rounded-none font-black text-base tracking-widest hover:scale-110 active:scale-95 transition-all shadow-xl"
                    style={{ backgroundColor: guideTheme.accentYellow, color: accentTextColor }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span>Exit</span>
                </button>
            </div>


            <div className="w-full h-[1px] mx-auto w-[96%]" style={{ backgroundColor: `${guideTheme.text}33` }}></div>


            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-12 space-y-12 sm:space-y-20">


                <div className="w-full h-[1px] mx-auto w-[96%]" style={{ backgroundColor: `${guideTheme.text}33` }}></div>


                {Object.entries(t.info || {}).map(([key, data]: [string, any], sectionIndex) => {
                    if (key === 'reset' || key === 'info' || key === 'contact') return null;

                    const features = typeof data === 'object' && data.features ? data.features : null;

                    const category = categories.find(c => c.id === key)
                        || categories.find(c => c.id === 'font');

                    let displayName: React.ReactNode = key.replace(/_/g, ' ').toUpperCase();
                    if (key === 'font') displayName = 'FONT TOOLS';
                    else if (key === 'position') displayName = (
                        <>
                            CUSTOMISE<br />TOOLBAR
                        </>
                    );
                    else if (key === 'ai') displayName = 'AI SUPPORT';
                    else if (key === 'reading') displayName = (
                        <>
                            READING<br />TOOLS
                        </>
                    );
                    else if (categories.find(c => c.id === key)) {
                        const name = categories.find(c => c.id === key)?.name.toUpperCase() || "";
                        if (name.includes(' ')) {
                            const parts = name.split(' ');
                            displayName = (
                                <>
                                    {parts[0]}<br />{parts.slice(1).join(' ')}
                                </>
                            );
                        } else {
                            displayName = name;
                        }
                    }

                    return (
                        <div key={key} className="flex flex-col relative w-full">
                            <div className="flex flex-col md:flex-row gap-12 md:gap-16 relative group/section">

                                <div className="w-full md:w-[25%] flex flex-col items-center md:items-start text-center md:text-left pt-2 md:pl-4">
                                    <div className="flex items-center gap-5 mb-4 group/header cursor-default">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl shrink-0">
                                            {category?.icon && (
                                                <Image
                                                    src={category.icon}
                                                    alt=""
                                                    width={30}
                                                    height={30}
                                                    className="object-contain"
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-col items-start pt-1">
                                            <h2 className="text-2xl font-black uppercase tracking-widest drop-shadow-md leading-[1.1]" style={{ color: guideTheme.text }}>{displayName}</h2>
                                            <div className="h-2 rounded-full shadow-lg mt-3 w-full opacity-100 transition-all duration-300" style={{ backgroundColor: guideTheme.accentYellow }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-[75%] grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {features && Object.entries(features).map(([fName, fDesc]: [string, any], index) => (
                                        <div
                                            key={fName}
                                            className="rounded-[32px] p-8 relative overflow-hidden group/card hover:bg-white/10 transition-all duration-300 animate-slide-up backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-2xl"
                                            style={{
                                                backgroundColor: guideTheme.cardBg,
                                                border: `1px solid ${guideTheme.cardBorder}`,
                                                animationDelay: `${(sectionIndex * 0.1) + (index * 0.05)}s`,
                                                animationFillMode: 'both'
                                            }}
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-yellow-400 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>

                                            <h3 className="font-black text-2xl mb-4 uppercase tracking-tight" style={{ color: guideTheme.text }}>{fName.replace(/color/gi, 'colour')}</h3>
                                            <p className="text-[22px] opacity-80 mb-10 font-bold leading-relaxed" style={{ color: guideTheme.text }}>
                                                {(fDesc as string).replace(/color/gi, 'colour')}
                                            </p>

                                            <div className="absolute bottom-7 left-8 flex items-center gap-2">
                                                <div
                                                    className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)]"
                                                    style={{
                                                        backgroundColor: isYellowTheme ? '#000000' : '#facc15'
                                                    }}
                                                ></div>
                                                <span
                                                    className="text-[10px] font-black tracking-[0.2em] opacity-60 uppercase"
                                                    style={{
                                                        color: isYellowTheme ? '#000000' : '#fde047'
                                                    }}
                                                >
                                                    READY TO USE
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full h-[1px] mt-20 mb-20 last:hidden" style={{ backgroundColor: `${guideTheme.cardBorder}66` }} />
                        </div>
                    );
                })}

            </div>
        </div>
    );
}

