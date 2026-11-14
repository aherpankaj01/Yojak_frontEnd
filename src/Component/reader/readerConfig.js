export const STORAGE_KEY = "yojak:reader-prefs:v1";

export const THEMES = [
    {
        id: "light",
        label: "Light",
        dark: false,
        colors: { bg: "#ffffff", fg: "#1f2937", muted: "#6b7280", link: "#2563eb", border: "#e5e7eb", surface: "#f3f4f6", accent: "#4f46e5" },
    },
    {
        id: "sepia",
        label: "Sepia",
        dark: false,
        colors: { bg: "#f4ecd8", fg: "#433422", muted: "#8a7a62", link: "#9a4d1a", border: "#e0d3b8", surface: "#ebe0c6", accent: "#b45309" },
    },
    {
        id: "dusk",
        label: "Dusk",
        dark: true,
        colors: { bg: "#2e3440", fg: "#d8dee9", muted: "#9aa5b8", link: "#88c0d0", border: "#434c5e", surface: "#3b4252", accent: "#88c0d0" },
    },
    {
        id: "dark",
        label: "Dark",
        dark: true,
        colors: { bg: "#121212", fg: "#e5e5e5", muted: "#9ca3af", link: "#818cf8", border: "#2a2a2a", surface: "#1e1e1e", accent: "#818cf8" },
    },
    {
        id: "black",
        label: "Black",
        dark: true,
        colors: { bg: "#000000", fg: "#b8b8b8", muted: "#777777", link: "#7aa2f7", border: "#1c1c1c", surface: "#0e0e0e", accent: "#7aa2f7" },
    },
];

export const FONTS = [
    { id: "serif", label: "Serif", stack: '"Merriweather", Georgia, "Times New Roman", serif' },
    { id: "sans", label: "Sans", stack: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
    { id: "readable", label: "Readable", stack: '"Atkinson Hyperlegible", Verdana, system-ui, sans-serif' },
    { id: "mono", label: "Mono", stack: '"JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace' },
];

export const LIMITS = {
    fontSize: { min: 14, max: 32, step: 1 }, // px
    lineHeight: { min: 1.3, max: 2.4, step: 0.05 },
    paragraphSpacing: { min: 0.5, max: 2.5, step: 0.1 }, // em
    letterSpacing: { min: -0.02, max: 0.12, step: 0.01 }, // em
    wordSpacing: { min: 0, max: 0.5, step: 0.05 }, // em
    maxWidth: { min: 480, max: 1000, step: 10 }, // px
};

export const DEFAULT_PREFS = {
    theme: "dark",
    fontFamily: "serif",
    fontSize: 19,
    lineHeight: 1.8,
    paragraphSpacing: 1.2,
    letterSpacing: 0,
    wordSpacing: 0,
    maxWidth: 720,
    textAlign: "left", // "left" | "justify"
    hyphenation: false,
    focusParagraph: false, // dims everything except the paragraph you're reading
    hideImages: false,
    showProgress: true,
};

export const SHORTCUTS = [
    ["Esc", "Close"],
    ["+ / −", "Font size"],
    ["T", "Next theme"],
    ["S", "Settings"],
    ["C", "Contents"],
    ["F", "Paragraph focus"],
];

const clamp = (value, { min, max }) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return null;
    return Math.round(Math.min(max, Math.max(min, n)) * 100) / 100;
};

export function sanitizePrefs(input = {}) {
    const out = { ...DEFAULT_PREFS };

    if (THEMES.some((t) => t.id === input.theme)) out.theme = input.theme;
    if (FONTS.some((f) => f.id === input.fontFamily)) out.fontFamily = input.fontFamily;
    if (input.textAlign === "left" || input.textAlign === "justify") out.textAlign = input.textAlign;

    Object.keys(LIMITS).forEach((key) => {
        const n = clamp(input[key], LIMITS[key]);
        if (n !== null) out[key] = n;
    });

    ["hyphenation", "focusParagraph", "hideImages", "showProgress"].forEach((key) => {
        if (typeof input[key] === "boolean") out[key] = input[key];
    });

    return out;
}

export function getTheme(id) {
    return THEMES.find((t) => t.id === id) || THEMES[0];
}

export function buildCssVars(prefs) {
    const theme = getTheme(prefs.theme);
    const font = FONTS.find((f) => f.id === prefs.fontFamily) || FONTS[0];
    const c = theme.colors;

    return {
        "--r-bg": c.bg,
        "--r-fg": c.fg,
        "--r-muted": c.muted,
        "--r-link": c.link,
        "--r-border": c.border,
        "--r-surface": c.surface,
        "--r-accent": c.accent,
        "--r-font": font.stack,
        "--r-size": `${prefs.fontSize}px`,
        "--r-lh": prefs.lineHeight,
        "--r-para": `${prefs.paragraphSpacing}em`,
        "--r-ls": `${prefs.letterSpacing}em`,
        "--r-ws": `${prefs.wordSpacing}em`,
        "--r-align": prefs.textAlign,
        "--r-hyphens": prefs.hyphenation ? "auto" : "manual",
        colorScheme: theme.dark ? "dark" : "light",
    };
}