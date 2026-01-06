'use client';

import Image from 'next/image';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES } from '@/contexts/accessibility/theme';

interface SidebarTutorialProps {
    onClose: () => void;
    icon: any;
}

export default function SidebarTutorial({ onClose, icon }: SidebarTutorialProps) {
    const { barTheme } = useAccessibility();
    const currentTheme = BAR_THEMES[barTheme];

    return (
        <div className="accessibility-bar pointer-events-auto fixed inset-0 z-[2147483647] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
            <div
                className="relative w-full max-w-[480px] bg-white rounded-[32px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.4)] border-[5px] animate-slide-up flex flex-col items-center"
                style={{
                    backgroundColor: currentTheme.background,
                    borderColor: currentTheme.border,
                    color: currentTheme.text,
                    fontFamily: 'sans-serif'
                }}
            >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FFD700] rounded-t-[28px]" />

                <div className="p-8 pt-8 flex flex-col items-center w-full">
                    {/* Header Icon */}
                    <div
                        className="w-14 h-14 rounded-full flex items-center justify-center mb-5 shadow-md border-2"
                        style={{
                            backgroundColor: '#FFD700',
                            borderColor: currentTheme.text,
                            color: '#000000'
                        }}
                    >
                        <Image
                            src={icon}
                            alt=""
                            width={28}
                            height={28}
                            className="brightness-0"
                            style={{
                                width: '28px',
                                height: '28px',
                                objectFit: 'contain'
                            }}
                        />
                    </div>

                    <h3 className="text-xl font-black uppercase mb-4 tracking-tight text-center">Sidebar Position</h3>

                    <div className="w-full space-y-2 mb-7 px-4">
                        <p className="text-lg font-bold mb-4 leading-normal text-center" style={{ color: currentTheme.text }}>
                            Press the Sidebar icon to move the Sidebar to your preferred position:
                        </p>

                        {[
                            { text: <>Press <b>Once</b> - for <b>Left</b> Sidebar</> },
                            { text: <>Press <b>Twice</b> - for <b>Right</b> Sidebar</> },
                            { text: <>Press <b>Third Time</b> - For <b>Top</b> Sidebar</> },
                            { text: <>Press <b>Four Times</b> - for <b>Bottom</b> Sidebar</> },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-start p-3 px-6 rounded-xl border-2 hover:brightness-95 transition-all whitespace-nowrap"
                                style={{
                                    backgroundColor: currentTheme.hover,
                                    borderColor: currentTheme.border,
                                    color: currentTheme.text
                                }}
                            >
                                <div className="text-lg font-normal leading-tight">
                                    {item.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-4 rounded-xl text-black font-black uppercase tracking-widest hover:translate-y-[-1px] active:translate-y-0 transition-all shadow-lg text-xl border-2 border-black/10 flex justify-center items-center"
                        style={{ backgroundColor: '#FFD700' }}
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}
