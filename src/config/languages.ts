export interface Language {
    code: string;
    name: string;
    flag: string;
    nativeName: string;
    countryCode: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧', nativeName: 'British English', countryCode: 'gb' },
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸', nativeName: 'American English', countryCode: 'us' },
    { code: 'ur', name: 'Urdu', flag: '🇵🇰', nativeName: 'اردو', countryCode: 'pk' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية', countryCode: 'sa' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español', countryCode: 'es' },
    { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français', countryCode: 'fr' },
    { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch', countryCode: 'de' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी', countryCode: 'in' },
    { code: 'zh-CN', name: 'Mandarin (China)', flag: '🇨🇳', nativeName: '中文 (简体)', countryCode: 'cn' },
    { code: 'zh-TW', name: 'Mandarin (Taiwan)', flag: '🇹🇼', nativeName: '中文 (繁體)', countryCode: 'tw' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語', countryCode: 'jp' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷', nativeName: '한국어', countryCode: 'kr' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português', countryCode: 'pt' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский', countryCode: 'ru' },
    { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano', countryCode: 'it' },
    { code: 'tr', name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe', countryCode: 'tr' },
    { code: 'bn', name: 'Bengali', flag: '🇧🇩', nativeName: 'বাংলা', countryCode: 'bd' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands', countryCode: 'nl' },
    { code: 'pl', name: 'Polish', flag: '🇵🇱', nativeName: 'Polski', countryCode: 'pl' },
    { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', nativeName: 'Tiếng Việt', countryCode: 'vn' },
    { code: 'th', name: 'Thai', flag: '🇹🇭', nativeName: 'ภาษาไทย', countryCode: 'th' },
    { code: 'id', name: 'Indonesian', flag: '🇮🇩', nativeName: 'Bahasa Indonesia', countryCode: 'id' },
    { code: 'el', name: 'Greek', flag: '🇬🇷', nativeName: 'Ελληνικά', countryCode: 'gr' },
    { code: 'he', name: 'Hebrew', flag: '🇮🇱', nativeName: 'עברית', countryCode: 'il' },
    { code: 'sv', name: 'Swedish', flag: '🇸🇪', nativeName: 'Svenska', countryCode: 'se' },
    { code: 'no', name: 'Norwegian', flag: '🇳🇴', nativeName: 'Norsk', countryCode: 'no' },
    { code: 'da', name: 'Danish', flag: '🇩🇰', nativeName: 'Dansk', countryCode: 'dk' },
    { code: 'fa', name: 'Farsi (Iran and Afghanistan)', flag: '🇮🇷', nativeName: 'فارسی', countryCode: 'ir' },
    { code: 'ps', name: 'Pashto (Afghanistan)', flag: '🇦🇫', nativeName: 'پښتو', countryCode: 'af' },
];
