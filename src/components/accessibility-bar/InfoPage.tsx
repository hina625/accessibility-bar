import { useState } from 'react';
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
    const [showForm, setShowForm] = useState(false);


    const t = translations[language] || translations['en'];

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
                className="flex items-center justify-between px-8 py-5 z-[50]"
                style={{ backgroundColor: guideTheme.bg }}
            >
                <div className="flex items-center gap-6">
                    <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-2xl transition-all active:scale-95 bg-white/5">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-4">
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl text-black shadow-lg"
                            style={{ backgroundColor: guideTheme.accentYellow, color: accentTextColor }}
                        >
                            i
                        </div>
                        <h1 className="text-3xl font-black tracking-tight uppercase">CONTACT US AND FEATURE GUIDE</h1>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="flex items-center gap-2.5 px-8 py-3 rounded-2xl font-black text-base tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                    style={{ backgroundColor: guideTheme.accentYellow, color: accentTextColor }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span className="mb-[1px]">CLOSE</span>
                </button>
            </div>


            <div className="w-full h-[1px] bg-white/20 mx-auto w-[96%]"></div>


            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-12 space-y-20">

                {!showForm ? (
                    <>
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
                                        {/* Left Side: Header */}
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
                                                    <div className="h-2 bg-yellow-400 rounded-full shadow-lg mt-3 w-full opacity-100 transition-all duration-300"></div>
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
                                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]"></div>
                                                        <span className="text-[10px] font-black tracking-[0.2em] opacity-60 uppercase text-yellow-300">READY TO USE</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-full h-[1px] bg-white/10 mt-20 mb-20 last:hidden" />
                                </div>
                            );
                        })}


                        <div className="mt-8 px-4 flex justify-center">
                            <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl backdrop-blur-md">
                                <div className="max-w-xl text-center md:text-left">
                                    <h2 className="text-2xl font-black uppercase tracking-tight mb-2" style={{ color: guideTheme.text }}>Need More Help?</h2>
                                    <p className="text-xl opacity-70 font-bold leading-relaxed" style={{ color: guideTheme.text }}>
                                        Explore our documentation or use the feedback tool to let us know how we can improve your browsing experience.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="px-8 py-4 rounded-xl font-black uppercase tracking-[0.15em] text-sm transition-all hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap"
                                    style={{ backgroundColor: guideTheme.accentYellow, color: accentTextColor }}
                                >
                                    Contact Us
                                </button>
                            </div>
                        </div>
                    </>
                ) : (

                    <div className="flex flex-col md:flex-row gap-8 md:gap-16 ring-1 ring-white/10 rounded-[3rem] p-8 md:p-12 bg-white/5 backdrop-blur-md animate-in fade-in slide-in-from-bottom-8 duration-700">

                        <div className="w-full md:w-1/3 flex flex-col pt-4">
                            <h2 className="text-4xl font-black uppercase tracking-tight mb-4 leading-none drop-shadow-sm" style={{ color: guideTheme.text }}>Contact Us</h2>
                            <div className="w-20 h-2 bg-yellow-400 rounded-full mb-8 shadow-sm"></div>

                            <p className="text-2xl mb-12 font-medium leading-relaxed" style={{ color: guideTheme.text }}>
                                Interested in our Accessibility Bar? Have questions or need a demo? We'd love to hear from you.
                            </p>



                            <button
                                onClick={() => setShowForm(false)}
                                className="mt-12 text-lg font-black uppercase tracking-[0.25em] opacity-90 hover:opacity-100 flex items-center gap-4 transition-all group w-fit hover:scale-105 active:scale-95"
                            >
                                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </div>
                                Back to Guide
                            </button>
                        </div>

                        <div className="w-full md:w-2/3">
                            <form
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const btn = e.currentTarget.querySelector('button[type="submit"]');
                                    if (btn) {
                                        const originalText = btn.innerHTML;
                                        btn.innerHTML = 'Sending...';
                                        btn.setAttribute('disabled', 'true');
                                        setTimeout(() => {
                                            btn.innerHTML = `
                                                <div class="flex items-center gap-2">
                                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                                    <span>Sent!</span>
                                                </div>
                                            `;
                                            btn.classList.add('bg-green-500', 'text-white');

                                            setTimeout(() => {
                                                btn.innerHTML = originalText;
                                                btn.removeAttribute('disabled');
                                                btn.classList.remove('bg-green-500', 'text-white');
                                                (e.target as HTMLFormElement).reset();
                                            }, 3000);
                                        }, 1500);
                                    }
                                }}
                            >
                                <div className="group">
                                    <label className="text-sm font-black uppercase tracking-[0.15em] mb-2 block group-focus-within:text-yellow-400 transition-all" style={{ color: guideTheme.text }}>First Name <span className="text-red-500 text-2xl font-bold ml-1">*</span></label>
                                    <input type="text" required className="w-full bg-black/60 border-2 border-white/60 rounded-xl p-4 focus:outline-none focus:border-yellow-400 focus:bg-black/70 transition-all font-medium text-white placeholder-white/80" placeholder="First Name" />
                                </div>
                                <div className="group">
                                    <label className="text-sm font-black uppercase tracking-[0.15em] mb-2 block group-focus-within:text-yellow-400 transition-all" style={{ color: guideTheme.text }}>Last Name <span className="text-red-500 text-2xl font-bold ml-1">*</span></label>
                                    <input type="text" required className="w-full bg-black/60 border-2 border-white/60 rounded-xl p-4 focus:outline-none focus:border-yellow-400 focus:bg-black/70 transition-all font-medium text-white placeholder-white/80" placeholder="Last Name" />
                                </div>
                                <div className="group md:col-span-2">
                                    <label className="text-sm font-black uppercase tracking-[0.15em] mb-2 block group-focus-within:text-yellow-400 transition-all" style={{ color: guideTheme.text }}>Email Address <span className="text-red-500 text-2xl font-bold ml-1">*</span></label>
                                    <input type="email" required className="w-full bg-black/60 border-2 border-white/60 rounded-xl p-4 focus:outline-none focus:border-yellow-400 focus:bg-black/70 transition-all font-medium text-white placeholder-white/80" placeholder="sarfraz123@.com" />
                                </div>
                                <div className="group">
                                    <label className="text-sm font-black uppercase tracking-[0.15em] mb-2 block group-focus-within:text-yellow-400 transition-all" style={{ color: guideTheme.text }}>Phone Number</label>
                                    <input type="tel" className="w-full bg-black/60 border-2 border-white/60 rounded-xl p-4 focus:outline-none focus:border-yellow-400 focus:bg-black/70 transition-all font-medium text-white placeholder-white/80" placeholder="+1 (555) 000-0000" />
                                </div>
                                <div className="group">
                                    <label className="text-sm font-black uppercase tracking-[0.15em] mb-2 block group-focus-within:text-yellow-400 transition-all" style={{ color: guideTheme.text }}>Website URL</label>
                                    <input type="url" className="w-full bg-black/60 border-2 border-white/60 rounded-xl p-4 focus:outline-none focus:border-yellow-400 focus:bg-black/70 transition-all font-medium text-white placeholder-white/80" placeholder="https://videodesk.co.uk" />
                                </div>
                                <div className="group md:col-span-2">
                                    <label className="text-sm font-black uppercase tracking-[0.15em] mb-2 block group-focus-within:text-yellow-400 transition-all" style={{ color: guideTheme.text }}>Message <span className="text-red-500 text-2xl font-bold ml-1">*</span></label>
                                    <textarea required rows={4} className="w-full bg-black/60 border-2 border-white/60 rounded-xl p-4 focus:outline-none focus:border-yellow-400 focus:bg-black/70 transition-all font-medium text-white placeholder-white/80 resize-none" placeholder="How can we help you?"></textarea>
                                </div>

                                <div className="md:col-span-2 pt-4 flex items-center justify-between">
                                    <p className="text-base font-bold tracking-widest uppercase" style={{ color: guideTheme.text }}>* Required fields</p>
                                    <button
                                        type="submit"
                                        className="px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-sm transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-yellow-400/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ backgroundColor: guideTheme.accentYellow, color: accentTextColor }}
                                    >
                                        Send Message
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
