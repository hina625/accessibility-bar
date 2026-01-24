export interface Language {
    code: string;
    name: string;
    flag: string;
    nativeName: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧', nativeName: 'British English' },
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸', nativeName: 'American English' },
    { code: 'ur', name: 'Urdu', flag: '🇵🇰', nativeName: 'اردو' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
    { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
    { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳', nativeName: '中文 (简体)' },
    { code: 'zh-TW', name: 'Chinese (Traditional)', flag: '🇭🇰', nativeName: '中文 (繁體)' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
    { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
    { code: 'tr', name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
    { code: 'bn', name: 'Bengali', flag: '🇧🇩', nativeName: 'বাংলা' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands' },
    { code: 'pl', name: 'Polish', flag: '🇵🇱', nativeName: 'Polski' },
    { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', nativeName: 'Tiếng Việt' },
    { code: 'th', name: 'Thai', flag: '🇹🇭', nativeName: 'ภาษาไทย' },
    { code: 'id', name: 'Indonesian', flag: '🇮🇩', nativeName: 'Bahasa Indonesia' },
    { code: 'el', name: 'Greek', flag: '🇬🇷', nativeName: 'Ελληνικά' },
    { code: 'he', name: 'Hebrew', flag: '🇮🇱', nativeName: 'עברית' },
    { code: 'sv', name: 'Swedish', flag: '🇸🇪', nativeName: 'Svenska' },
    { code: 'no', name: 'Norwegian', flag: '🇳🇴', nativeName: 'Norsk' },
    { code: 'da', name: 'Danish', flag: '🇩🇰', nativeName: 'Dansk' },
];
