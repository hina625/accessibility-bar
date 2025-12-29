export type BarTheme = 'white' | 'black' | 'purple' | 'yellow' | 'orange' | 'deepBlue';

export interface ThemeColors {
    background: string;
    text: string;
    hover: string;
    active: string;
    border: string;
}

export const BAR_THEMES: Record<BarTheme, ThemeColors> = {
    white: {
        background: '#f5f5f5de',
        text: '#000000',
        hover: '#e0e0e0',
        active: '#d0d0d0',
        border: '#c0c0c0',
    },
    black: {
        background: '#0e0d0dff',
        text: '#FFFFFF',
        hover: '#1d1d1dff',
        active: '#272727dc',
        border: '#555555',
    },
    purple: {
        background: '#763fd4ff',
        text: '#FFFFFF',
        hover: '#8B5CF6',
        active: '#5818beff',
        border: '#A78BFA',
    },
    yellow: {
        background: '#FACC15',
        text: '#000000',
        hover: '#FDE047',
        active: '#EAB308',
        border: '#FEF08A',
    },
    orange: {
        background: '#fd500bff',
        text: '#FFFFFF',
        hover: '#ff5a0dff',
        active: '#f8652aff',
        border: '#e9520cff',
    },
    deepBlue: {
        background: '#06334A',
        text: '#FFFFFF',
        hover: '#0A4A6A',
        active: '#0F5C85',
        border: '#123E5A',
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
    deepBlue: BAR_THEMES.deepBlue.background,
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
};

