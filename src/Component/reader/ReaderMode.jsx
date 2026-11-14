import { createElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import parse, { domToReact } from "html-react-parser";
import { X, Type, List, Clock, ArrowUp } from "lucide-react";
import { setPref, resetPrefs } from "../../store/readerSlice";
import { THEMES, LIMITS, buildCssVars } from "./readerConfig";
import ReaderSettingsPanel from "./Readersettingspanel";
import ReaderTOC from "./ReaderTOC";
import "./reader.css";

const BLOCKED_TAGS = ["script", "style", "iframe", "object", "embed"];
const isSafeHref = (href = "") => /^(https?:|mailto:|#)/i.test(href.trim());

const textOf = (node) =>
    node.type === "text"
        ? node.data
        : (node.children || []).map(textOf).join("");


function parseArticle(html) {
    let index = 0;
    const toc = [];

    const options = {
        replace(node) {
            if (node.type !== "tag") return;

            if (BLOCKED_TAGS.includes(node.name)) return <></>;

            if (/^h[1-3]$/.test(node.name)) {
                const id = `reader-h-${index++}`;
                const text = textOf(node).trim();
                if (text) toc.push({ id, text, level: Number(node.name[1]) });
                return createElement(node.name, { id }, domToReact(node.children, options));
            }

            if (node.name === "a") {
                const href = node.attribs?.href;
                return (
                    <a
                        href={isSafeHref(href) ? href : undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {domToReact(node.children, options)}
                    </a>
                );
            }

            if (node.name === "img") {
                return <img src={node.attribs?.src} alt={node.attribs?.alt || ""} loading="lazy" />;
            }
        },
    };

    return { article: parse(html, options), toc };
}

function BarButton({ label, onClick, active, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            title={label}
            aria-pressed={active}
            className="p-2.5 rounded-xl hover:opacity-70 transition"
            style={{ background: active ? "var(--r-surface)" : "transparent" }}
        >
            {children}
        </button>
    );
}

export default function ReaderMode({
                                       title,
                                       content,
                                       authorName,
                                       dateLabel,
                                       readingTime = 1,
                                       coverImage,
                                       onClose,
                                   }) {
    const dispatch = useDispatch();
    const prefs = useSelector((state) => state.reader);

    const scrollRef = useRef(null);
    const contentRef = useRef(null);
    const lastY = useRef(0);

    const [progress, setProgress] = useState(0);
    const [barVisible, setBarVisible] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [tocOpen, setTocOpen] = useState(false);

    const cssVars = useMemo(() => buildCssVars(prefs), [prefs]);

    const { article, toc } = useMemo(
        () => (typeof content === "string" ? parseArticle(content) : { article: null, toc: [] }),
        [content],
    );

    const update = useCallback(
        (key, value) => dispatch(setPref({ key, value })),
        [dispatch],
    );

    useEffect(() => {
        const previouslyFocused = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        scrollRef.current?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus?.();
        };
    }, []);

    useEffect(() => {
        const root = scrollRef.current;
        const body = contentRef.current;
        if (!prefs.focusParagraph || !root || !body) return;

        const blocks = Array.from(body.children);
        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach((e) => e.target.classList.toggle("is-active", e.isIntersecting)),
            { root, rootMargin: "-42% 0px -50% 0px", threshold: 0 },
        );

        blocks.forEach((b) => observer.observe(b));
        return () => {
            observer.disconnect();
            blocks.forEach((b) => b.classList.remove("is-active"));
        };
    }, [prefs.focusParagraph, article]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            const tag = e.target?.tagName;
            if (tag === "TEXTAREA" || tag === "SELECT" || e.target?.isContentEditable) return;

            switch (e.key) {
                case "Escape":
                    if (settingsOpen) setSettingsOpen(false);
                    else if (tocOpen) setTocOpen(false);
                    else onClose();
                    break;
                case "+":
                case "=":
                    update("fontSize", prefs.fontSize + LIMITS.fontSize.step);
                    break;
                case "-":
                case "_":
                    update("fontSize", prefs.fontSize - LIMITS.fontSize.step);
                    break;
                case "t":
                case "T": {
                    const i = THEMES.findIndex((t) => t.id === prefs.theme);
                    update("theme", THEMES[(i + 1) % THEMES.length].id);
                    break;
                }
                case "s":
                case "S":
                    setTocOpen(false);
                    setSettingsOpen((v) => !v);
                    break;
                case "c":
                case "C":
                    setSettingsOpen(false);
                    setTocOpen((v) => !v);
                    break;
                case "f":
                case "F":
                    update("focusParagraph", !prefs.focusParagraph);
                    break;
                default:
                    return;
            }
            e.preventDefault();
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [prefs, settingsOpen, tocOpen, onClose, update]);

    /* ---- scroll: progress + auto-hide toolbar ---- */
    const handleScroll = (e) => {
        const el = e.currentTarget;
        const y = el.scrollTop;
        const max = el.scrollHeight - el.clientHeight;

        setProgress(max > 0 ? Math.min(1, Math.round((y / max) * 1000) / 1000) : 0);

        if (y < 120 || y < lastY.current - 8) setBarVisible(true);
        else if (y > lastY.current + 8) setBarVisible(false);
        lastY.current = y;
    };

    const scrollToHeading = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        setTocOpen(false);
    };

    const scrollToTop = () =>
        scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });

    const minutesLeft = Math.ceil(readingTime * (1 - progress));
    const finished = progress >= 0.98;
    const barShown = barVisible || settingsOpen || tocOpen;

    const rootClasses = [
        "reader-root fixed inset-0 z-[100] flex flex-col",
        prefs.focusParagraph ? "reader-focus-para" : "",
        prefs.hideImages ? "reader-hide-images" : "",
    ].join(" ");

    return (
        <div className={rootClasses} style={cssVars} role="dialog" aria-modal="true" aria-label="Reading mode">
            {prefs.showProgress && (
                <div className="absolute top-0 inset-x-0 h-[3px] z-30" style={{ background: "var(--r-border)" }}>
                    <div
                        className="h-full transition-[width] duration-150"
                        style={{ width: `${progress * 100}%`, background: "var(--r-accent)" }}
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(progress * 100)}
                        aria-label="Reading progress"
                    />
                </div>
            )}

            <header
                className="absolute top-[3px] inset-x-0 z-20 transition-transform duration-300"
                style={{
                    transform: barShown ? "translateY(0)" : "translateY(-110%)",
                    background: "var(--r-bg)",
                    borderBottom: "1px solid var(--r-border)",
                }}
            >
                <div className="mx-auto max-w-5xl flex items-center gap-2 px-3 sm:px-5 h-14">
                    <BarButton label="Close reading mode (Esc)" onClick={onClose}>
                        <X size={20} />
                    </BarButton>

                    <p className="flex-1 min-w-0 truncate text-sm font-medium text-center px-2" style={{ color: "var(--r-muted)" }}>
                        {title}
                    </p>

                    <span className="hidden sm:flex items-center gap-1.5 text-xs mr-1" style={{ color: "var(--r-muted)" }}>
            <Clock size={14} />
                        {finished ? "Finished" : `${minutesLeft} min left`}
          </span>

                    <BarButton label="Contents (C)" active={tocOpen} onClick={() => { setSettingsOpen(false); setTocOpen((v) => !v); }}>
                        <List size={20} />
                    </BarButton>
                    <BarButton label="Reading settings (S)" active={settingsOpen} onClick={() => { setTocOpen(false); setSettingsOpen((v) => !v); }}>
                        <Type size={20} />
                    </BarButton>
                </div>
            </header>


            <div
                ref={scrollRef}
                tabIndex={-1}
                onScroll={handleScroll}
                onClick={(e) => {
                    // tap empty space to show/hide the toolbar (ignore links, buttons, text selection)
                    if (settingsOpen || tocOpen) return;
                    if (e.target.closest("a, button")) return;
                    if (window.getSelection()?.toString()) return;
                    setBarVisible((v) => !v);
                }}
                className="reader-scroll flex-1 overflow-y-auto"
            >
                <div className="mx-auto w-full px-5 sm:px-8 pt-24 pb-40" style={{ maxWidth: `${prefs.maxWidth + 64}px` }}>
                    <header className="mb-10" style={{ fontFamily: "var(--r-font)" }}>
                        <h1 className="font-bold leading-tight" style={{ fontSize: "calc(var(--r-size) * 1.9)" }}>
                            {title}
                        </h1>
                        <p className="mt-4 text-sm" style={{ color: "var(--r-muted)" }}>
                            {[authorName, dateLabel, `${readingTime} min read`].filter(Boolean).join("  ·  ")}
                        </p>
                    </header>

                    {coverImage && !prefs.hideImages && (
                        <img src={coverImage} alt={title} className="w-full rounded-2xl mb-10 object-cover max-h-[28rem]" />
                    )}

                    <article ref={contentRef} className="reader-prose">
                        {article}
                    </article>

                    <footer className="mt-16 pt-8 text-center" style={{ borderTop: "1px solid var(--r-border)" }}>
                        <p className="text-sm mb-5" style={{ color: "var(--r-muted)" }}>
                            You&apos;ve reached the end
                        </p>
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); scrollToTop(); }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm hover:opacity-70 transition"
                                style={{ border: "1px solid var(--r-border)" }}
                            >
                                <ArrowUp size={16} /> Back to top
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onClose(); }}
                                className="px-4 py-2 rounded-xl text-sm font-medium transition hover:opacity-90"
                                style={{ background: "var(--r-accent)", color: "var(--r-bg)" }}
                            >
                                Exit reading mode
                            </button>
                        </div>
                    </footer>
                </div>
            </div>

            {tocOpen && <ReaderTOC items={toc} onSelect={scrollToHeading} onClose={() => setTocOpen(false)} />}

            {settingsOpen && (
                <ReaderSettingsPanel
                    prefs={prefs}
                    onChange={update}
                    onReset={() => dispatch(resetPrefs())}
                    onClose={() => setSettingsOpen(false)}
                />
            )}
        </div>
    );
}