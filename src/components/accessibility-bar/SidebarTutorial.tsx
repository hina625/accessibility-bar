'use client';

import Image from 'next/image';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';
import sidebarLeftImg from '@/assets/icons/sidebar_left.png';
import sidebarRightImg from '@/assets/icons/sidebar_right.png';

interface SidebarTutorialProps {
    onClose: () => void;
    icon: any;
}

export default function SidebarTutorial({ onClose, icon }: SidebarTutorialProps) {
    const { barTheme, panelPosition } = useAccessibility();
    const currentTheme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

    let displayIcon = icon;
    if (panelPosition === 'left') displayIcon = sidebarLeftImg;
    else if (panelPosition === 'right') displayIcon = sidebarRightImg;

    return (
        <div className="accessibility-bar pointer-events-auto fixed inset-0 z-[2147483647] flex items-center justify-center p-6 bg-black/80 animate-fade-in">
            <div
                className="relative w-full max-w-[480px] bg-white rounded-[32px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.4)] border-[5px] animate-slide-up flex flex-col items-center"
                style={{
                    backgroundColor: currentTheme.background,
                    borderColor: currentTheme.border,
                    color: currentTheme.text,
                    fontFamily: 'sans-serif'
                }}
            >
                {/* Modal Content */}
                <div className="p-8 pt-10 flex flex-col items-center w-full">
                    <h3 className="text-2xl font-black uppercase mb-6 tracking-tight text-center" style={{ color: currentTheme.text }}>
                        Sidebar Position
                    </h3>
                    <div className="w-full space-y-2 mb-7 px-4">
                        <p className="text-base font-bold mb-6 leading-normal text-center" style={{ color: currentTheme.text }}>
                            Press/Click the Sidebar icon to move the Sidebar to your preferred position:
                        </p>

                        {/* Header Icon - Moved below sentence */}
                        <div className="flex justify-center w-full mb-6">
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center shadow-md border-2"
                                style={{
                                    backgroundColor: '#FFD700',
                                    borderColor: currentTheme.text,
                                    color: '#000000'
                                }}
                            >
                                <Image
                                    src={displayIcon}
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
                        </div>

                        {[
                            { text: <>Press/Click <b>Once</b> - for <b>Left</b> Sidebar</> },
                            { text: <>Press/Click <b>Twice</b> - for <b>Right</b> Sidebar</> },
                            { text: <>Press/Click <b>a Third Time</b> - For <b>Top</b> Sidebar</> },
                            { text: <>Press/Click <b>Four Times</b> - for <b>Bottom</b> Sidebar</> },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-start p-3 px-6 rounded-xl border-2 hover:brightness-95 transition-all"
                                style={{
                                    backgroundColor: currentTheme.hover,
                                    borderColor: currentTheme.border,
                                    color: currentTheme.text
                                }}
                            >
                                <div className="text-base font-normal leading-tight">
                                    {item.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-4 rounded-xl text-black font-black uppercase tracking-widest hover:translate-y-[-1px] active:translate-y-0 transition-all shadow-lg text-xl border-2 border-black/10 flex justify-center items-center"
                        style={{ backgroundColor: barTheme === 'yellow' ? '#87CEEB' : '#FFD700' }}
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}
