'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';

const fonts = [
    { name: 'Default Font', value: 'default' },
    { name: 'Lexend', value: 'lexend' },
    { name: 'Arial', value: 'arial' },
    { name: 'Verdana', value: 'verdana' },
    { name: 'Comic Sans MS', value: 'dyslexic' },
    { name: 'Georgia', value: 'readable' },
];

export default function FontOptions() {
    const {
        lineHeight, setLineHeight,
        characterSpacing, setCharacterSpacing,
        fontStyle, setFontStyle
    } = useAccessibility();

    const handleLineHeight = (delta: number) => {
        setLineHeight(Math.max(0.5, Math.min(2.5, lineHeight + delta)));
    };

    const handleCharacterSpacing = (delta: number) => {
        setCharacterSpacing(Math.max(0, Math.min(1, characterSpacing + delta)));
    };

    return (
        <div className="flex flex-col w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-6 gap-6 relative border-r-[6px] border-[#e11d48]">
            <h2 className="text-[18px] font-normal text-black dark:text-white mb-2">Font Options</h2>

            {/* Line Height */}
            <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Line Height
                </label>
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-2xl p-2 px-4 shadow-inner">
                    <button
                        onClick={() => handleLineHeight(-0.1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-gray-700 dark:text-white shadow-sm"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                    </button>

                    <span className="text-[18px] font-normal text-black dark:text-white">
                        {Math.abs(lineHeight - 1) < 0.05 ? 'Default' : `${lineHeight.toFixed(1)}x`}
                    </span>

                    <button
                        onClick={() => handleLineHeight(0.1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-all text-white shadow-md shadow-blue-500/20"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Character Spacing */}
            <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Character Spacing
                </label>
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-2xl p-2 px-4 shadow-inner">
                    <button
                        onClick={() => handleCharacterSpacing(-0.02)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-gray-700 dark:text-white shadow-sm"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                    </button>

                    <span className="text-[18px] font-normal text-black dark:text-white">
                        {Math.abs(characterSpacing) < 0.005 ? 'Default' : `${characterSpacing.toFixed(2)}em`}
                    </span>

                    <button
                        onClick={() => handleCharacterSpacing(0.02)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-all text-white shadow-md shadow-blue-500/20"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Select Font */}
            <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Select Font
                </label>
                <div className="flex flex-col gap-2">
                    {fonts.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFontStyle(f.value as any)}
                            className={`w-full py-2 px-4 rounded-lg border transition-all text-center text-[18px] font-normal ${fontStyle === f.value
                                ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                }`}
                            style={{
                                fontFamily: f.value === 'lexend' ? 'var(--font-lexend), sans-serif' :
                                    f.value === 'readable' ? 'Georgia, serif' :
                                        f.value === 'dyslexic' ? 'Comic Sans MS, cursive' :
                                            f.value === 'serif' ? 'Times New Roman, serif' :
                                                f.value === 'sans' ? 'Arial, sans-serif' :
                                                    f.value === 'mono' ? 'monospace' : 'inherit'
                            }}
                        >
                            {f.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
