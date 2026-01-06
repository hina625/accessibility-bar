export type BarTheme = 'white' | 'grayscale' | 'black' | 'oceanBlue' | 'blue' | 'navy' | 'yellow' | 'purple';

export interface ThemeColors {
    background: string;
    text: string;
    hover: string;
    active: string;
    border: string;
}

export const BAR_THEMES: Record<BarTheme, ThemeColors> = {
    white: {
        background: '#F5F5F5',
        text: '#000000',
        hover: '#C0C0C0',
        active: '#A0A0A0',
        border: '#B0B0B0',
    },
    grayscale: {
        background: '#5A5A5A',
        text: '#FFFFFF',
        hover: '#353535',
        active: '#7A7A7A',
        border: '#B0B0B0',
    },
    black: {
        background: '#0E0D0D',
        text: '#FFFFFF',
        hover: '#3A3A3A',
        active: '#606060',
        border: '#A0A0A0',
    },
    oceanBlue: {
        background: '#005A9E',
        text: '#FFFFFF',
        hover: '#0090DD',
        active: '#0072be',
        border: '#2378b9',
    },
    blue: {
        background: '#1A34C9',
        text: '#FFFFFF',
        hover: '#4060FF',
        active: '#3050E8',
        border: '#2e4bf3',
    },
    navy: {
        background: '#06334A',
        text: '#FFFFFF',
        hover: '#066b96',
        active: '#0C5580',
        border: '#0c618b',
    },
    yellow: {
        background: '#ffd015',
        text: '#000000',
        hover: '#f5d018',
        active: '#f8c323',
        border: '#ffe944',
    },
    purple: {
        background: '#6432C4',
        text: '#FFFFFF',
        hover: '#9570FF',
        active: '#7D50E0',
        border: '#9161f8',
    },
};


export const THEME = {
    purple: BAR_THEMES.purple.background,
    purpleMid: BAR_THEMES.purple.hover,
    purpleLight: BAR_THEMES.purple.hover,
    purpleDark: BAR_THEMES.purple.active,
    purpleDeep: '#5B21B6',
    border: BAR_THEMES.purple.border,
    borderLight: 'rgba(124, 58, 237, 0.4)',
    highlight: '#EDE9FE',
    navy: BAR_THEMES.navy.background,
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
};

