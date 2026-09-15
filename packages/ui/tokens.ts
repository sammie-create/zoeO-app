/**
 * ZoeO Allure — Design Tokens
 * Source: Brand Guidelines v1.0, August 2026
 */

export const color = {
    // Allure Violet — brand · actions · links
    violet: {
        50: '#F4ECFE',
        100: '#E7D8FD',
        200: '#CFB1FB',
        300: '#B689F6',
        400: '#9C5AEE',
        500: '#7F23E0', // primary — sampled from the logo
        600: '#6A17C0',
        700: '#55129B',
        800: '#3F0E74',
        900: '#290A4D',
    },
    // Noir — text · surfaces · borders
    noir: {
        50: '#F7F6F9',
        100: '#EDEBF1',
        200: '#D8D5E0',
        300: '#B4AFC0',
        400: '#837D93',
        500: '#5B5568',
        600: '#403B4C',
        700: '#2A2633',
        800: '#1A1720',
        900: '#0E0C12', // base
    },
    // Petal — nails · lashes · soft moments
    petal: {
        50: '#FDF0F4',
        100: '#F8D7E1',
        300: '#F2C3D2',
        500: '#D98FA6',
        700: '#A85A73',
    },
    // Champagne — premium · packaging · VIP
    champagne: {
        50: '#FBF4E6',
        100: '#F6E7C8', // accent
        300: '#E8CE95',
        500: '#D4AF6A',
        700: '#A9853F',
    },
    // Status / semantic
    status: {
        booked: '#2E9E6B',
        pending: '#D9A21B',
        cancelled: '#D3455B',
        info: '#4A7BE0',
    },
} as const;

// Verified accessible pairings — stick to these for text-on-color
export const accessiblePairs = {
    whiteOnViolet500: { ratio: '5.6:1', level: 'AA' },
    violet300OnNoir: { ratio: '6.9:1', level: 'AA' },
    violet700OnNoir50: { ratio: '9.8:1', level: 'AAA' },
    // never use — fails contrast
    violet300OnPetal: { ratio: '1.9:1', level: 'FAIL — never use' },
} as const;

export const font = {
    display: "'Playfair Display', serif", // headlines, service names, pull quotes — never below 24px
    body: "'Manrope', sans-serif", // all UI, captions, prices, buttons — weights 400/500/700/800
    mono: "'JetBrains Mono', monospace", // utility only — codes, hex values, booking refs, timestamps
} as const;

export const type = {
    display: { size: 72, lineHeight: 0.95, letterSpacing: '-2%', font: 'display', weight: 400 },
    h1: { size: 46, lineHeight: 1.1, font: 'display', weight: 400 },
    h2: { size: 30, lineHeight: 1.2, font: 'display', weight: 400, style: 'italic' },
    title: { size: 20, lineHeight: 1.35, font: 'body', weight: 700 },
    body: { size: 16, lineHeight: 1.7, font: 'body', weight: 400 },
    small: { size: 13, lineHeight: 1.5, font: 'body', weight: 500 },
    overline: { size: 11, lineHeight: 1, letterSpacing: '.18em', textTransform: 'uppercase', font: 'body', weight: 600 },
} as const;

export const radius = {
    control: 10, // buttons, inputs
    card: 16,
    pill: 999,
} as const;

export const motion = {
    duration: {
        instant: 120, // hover, toggle, focus
        entry: 280, // cards, list items, content entry ("Rise")
        transition: 420, // sheets, page transitions
        sheen: 2600, // premium accent sweep — Champagne/Violet only
        pulse: 1600, // live availability indicator
    },
    easing: {
        rise: 'cubic-bezier(.22,.7,.28,1)',
        sheen: 'linear',
        pulse: 'ease-in-out',
    },
    reducedMotion: 'fade-only', // honour prefers-reduced-motion
} as const;

export const icon = {
    grid: 24,
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none', // icons are stroked only, never filled
} as const;