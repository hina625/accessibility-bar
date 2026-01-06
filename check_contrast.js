
const themes = {
    white: { background: '#f5f5f5', text: '#000000' },
    grayscale: { background: '#4B5563', text: '#FFFFFF' }, // Updated
    black: { background: '#0e0d0d', text: '#FFFFFF' },
    oceanBlue: { background: '#005596', text: '#FFFFFF' }, // Updated
    blue: { background: '#1d3be2', text: '#FFFFFF' },
    navy: { background: '#06334A', text: '#FFFFFF' },
    yellow: { background: '#FACC15', text: '#000000' },
    purple: { background: '#6d35c4', text: '#FFFFFF' }, // Updated
};

function getRGB(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 8) {
        hex = hex.substring(0, 6);
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
}

function getLuminance([r, g, b]) {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1, hex2) {
    const lum1 = getLuminance(getRGB(hex1));
    const lum2 = getLuminance(getRGB(hex2));
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

console.log('Theme Contrast Ratios (WCAG AA requires 4.5:1, AAA requires 7:1):');
console.log('---------------------------------------------------------------');

Object.entries(themes).forEach(([name, colors]) => {
    const ratio = getContrastRatio(colors.background, colors.text);
    const passAA = ratio >= 4.5 ? 'PASS' : 'FAIL';
    const passAAA = ratio >= 7.0 ? 'PASS' : 'FAIL';
    console.log(`${name.padEnd(12)}: ${ratio.toFixed(2)}:1  [AA: ${passAA}] [AAA: ${passAAA}]`);
});
