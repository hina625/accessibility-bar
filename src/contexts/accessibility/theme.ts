// Theme definitions for the accessibility bar
export type BarTheme = 'white' | 'grayscale' | 'black' | 'oceanBlue' | 'Turquoise' | 'navy' | 'yellow' | 'purple' | 'pink';

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
        hover: '#c0c0c0d2',
        active: '#a0a0a0ff',
        border: '#B0B0B0',
    },
    grayscale: {
        background: '#525252',
        text: '#FFFFFF',
        hover: '#353535',
        active: '#9C9C9C',
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
        hover: '#3287b4ff',
        active: '#0072be',
        border: '#6CBFFF',
    },
    Turquoise: {
        background: '#38FFC3',
        text: '#0E0D0D',
        hover: '#22c493ff',
        active: '#129c73ff',
        border: '#0abd87ff',
    },
    navy: {
        background: '#06334A',
        text: '#FFFFFF',
        hover: '#2a789cff',
        active: '#0C5580',
        border: '#4DA8D6',
    },
    yellow: {
        background: '#ffd015',
        text: '#000000',
        hover: '#cca818ff',
        active: '#A78911',
        border: '#8F7300',
    },
    purple: {
        background: '#291551',
        text: '#FFFFFF',
        hover: '#653cb8ff',
        active: '#7643e4ff',
        border: '#9D70FF',
    },
    pink: {
        background: '#EC4899',
        text: '#FFFFFF',
        hover: '#db337fff',
        active: '#df2874ff',
        border: '#ff7dc0ff',
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

