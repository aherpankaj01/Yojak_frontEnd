import { X, Minus, Plus, RotateCcw, Check, AlignLeft, AlignJustify } from "lucide-react";
import { THEMES, FONTS, LIMITS, SHORTCUTS } from "./readerConfig";


function Section({ title, children }) {
    return (
        <section className="mb-6">
            <h3
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--r-muted)" }}
            >
                {title}
            </h3>
            <div className="space-y-4">{children}</div>
        </section>
    );
}

function SliderRow({ label, value, display, limits, onChange }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-2 text-sm">
                <label>{label}</label>
                <span style={{ color: "var(--r-muted)" }}>{display}</span>
            </div>
            <input
                type="range"
                className="reader-range"
                min={limits.min}
                max={limits.max}
                step={limits.step}
                value={value}
                aria-label={label}
                onChange={(e) => onChange(Number(e.target.value))}
            />
        </div>
    );
}

function Segmented({ options, value, onChange }) {
    return (
        <div
            className="grid gap-1 p-1 rounded-xl"
            style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)`, background: "var(--r-bg)", border: "1px solid var(--r-border)" }}
        >
            {options.map((opt) => {
                const active = opt.value === value;
                return (
                    <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        aria-pressed={active}
                        className="flex items-center justify-center gap-2 py-2 text-sm rounded-lg transition"
                        style={{
                            background: active ? "var(--r-accent)" : "transparent",
                            color: active ? "var(--r-bg)" : "var(--r-fg)",
                            fontWeight: active ? 600 : 400,
                        }}
                    >
                        {opt.icon}
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}

function ToggleRow({ label, hint, checked, onChange }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className="w-full flex items-center justify-between gap-4 text-left"
        >
      <span>
        <span className="block text-sm">{label}</span>
          {hint && (
              <span className="block text-xs mt-0.5" style={{ color: "var(--r-muted)" }}>
            {hint}
          </span>
          )}
      </span>
            <span
                className="relative shrink-0 w-11 h-6 rounded-full transition-colors"
                style={{ background: checked ? "var(--r-accent)" : "var(--r-border)" }}
            >
        <span
            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform"
            style={{ background: "var(--r-bg)", transform: checked ? "translateX(20px)" : "translateX(0)" }}
        />
      </span>
        </button>
    );
}


export default function ReaderSettingsPanel({ prefs, onChange, onReset, onClose }) {
    const L = LIMITS;
    const step = (key, dir) => onChange(key, prefs[key] + dir * L[key].step);

    return (
        <>
            <div className="fixed inset-0 z-30 bg-black/40" onClick={onClose} aria-hidden="true" />

            <aside
                role="dialog"
                aria-label="Reading settings"
                className="reader-panel-enter fixed z-40 bottom-0 inset-x-0 max-h-[85vh] rounded-t-2xl overflow-y-auto p-5 shadow-2xl
                   sm:inset-x-auto sm:top-0 sm:right-0 sm:bottom-auto sm:h-full sm:max-h-none sm:w-96 sm:rounded-none"
                style={{ background: "var(--r-surface)", color: "var(--r-fg)", borderLeft: "1px solid var(--r-border)" }}
            >
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-semibold">Reading settings</h2>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={onReset}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg hover:opacity-70 transition"
                            style={{ border: "1px solid var(--r-border)" }}
                        >
                            <RotateCcw size={13} /> Reset
                        </button>
                        <button type="button" onClick={onClose} aria-label="Close settings" className="p-2 rounded-lg hover:opacity-70 transition">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <Section title="Theme">
                    <div className="grid grid-cols-5 gap-2">
                        {THEMES.map((t) => {
                            const active = prefs.theme === t.id;
                            return (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => onChange("theme", t.id)}
                                    aria-label={`${t.label} theme`}
                                    aria-pressed={active}
                                    className="flex flex-col items-center gap-1.5"
                                >
                  <span
                      className="relative w-full aspect-square rounded-xl flex items-center justify-center text-lg font-semibold"
                      style={{
                          background: t.colors.bg,
                          color: t.colors.fg,
                          border: `2px solid ${active ? "var(--r-accent)" : t.colors.border}`,
                      }}
                  >
                    Aa
                      {active && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "var(--r-accent)", color: "var(--r-bg)" }}>
                        <Check size={10} strokeWidth={3} />
                      </span>
                      )}
                  </span>
                                    <span className="text-[11px]" style={{ color: "var(--r-muted)" }}>{t.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </Section>

                <Section title="Font">
                    <div className="grid grid-cols-2 gap-2">
                        {FONTS.map((f) => {
                            const active = prefs.fontFamily === f.id;
                            return (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => onChange("fontFamily", f.id)}
                                    aria-pressed={active}
                                    className="py-2.5 px-3 rounded-xl text-left transition"
                                    style={{
                                        border: `2px solid ${active ? "var(--r-accent)" : "var(--r-border)"}`,
                                        background: "var(--r-bg)",
                                    }}
                                >
                                    <span className="block text-xl leading-none" style={{ fontFamily: f.stack }}>Aa</span>
                                    <span className="block text-xs mt-1" style={{ color: "var(--r-muted)" }}>{f.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2 text-sm">
                            <span>Font size</span>
                            <span style={{ color: "var(--r-muted)" }}>{prefs.fontSize}px</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => step("fontSize", -1)}
                                disabled={prefs.fontSize <= L.fontSize.min}
                                aria-label="Decrease font size"
                                className="p-2 rounded-lg disabled:opacity-30 hover:opacity-70 transition"
                                style={{ border: "1px solid var(--r-border)" }}
                            >
                                <Minus size={16} />
                            </button>
                            <input
                                type="range"
                                className="reader-range"
                                min={L.fontSize.min}
                                max={L.fontSize.max}
                                step={L.fontSize.step}
                                value={prefs.fontSize}
                                aria-label="Font size"
                                onChange={(e) => onChange("fontSize", Number(e.target.value))}
                            />
                            <button
                                type="button"
                                onClick={() => step("fontSize", 1)}
                                disabled={prefs.fontSize >= L.fontSize.max}
                                aria-label="Increase font size"
                                className="p-2 rounded-lg disabled:opacity-30 hover:opacity-70 transition"
                                style={{ border: "1px solid var(--r-border)" }}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </Section>

                <Section title="Spacing & layout">
                    <SliderRow label="Line height" value={prefs.lineHeight} display={prefs.lineHeight.toFixed(2)} limits={L.lineHeight} onChange={(v) => onChange("lineHeight", v)} />
                    <SliderRow label="Paragraph spacing" value={prefs.paragraphSpacing} display={`${prefs.paragraphSpacing.toFixed(1)}em`} limits={L.paragraphSpacing} onChange={(v) => onChange("paragraphSpacing", v)} />
                    <SliderRow label="Letter spacing" value={prefs.letterSpacing} display={`${prefs.letterSpacing.toFixed(2)}em`} limits={L.letterSpacing} onChange={(v) => onChange("letterSpacing", v)} />
                    <SliderRow label="Word spacing" value={prefs.wordSpacing} display={`${prefs.wordSpacing.toFixed(2)}em`} limits={L.wordSpacing} onChange={(v) => onChange("wordSpacing", v)} />
                    <SliderRow label="Content width" value={prefs.maxWidth} display={`${prefs.maxWidth}px`} limits={L.maxWidth} onChange={(v) => onChange("maxWidth", v)} />

                    <div>
                        <p className="text-sm mb-2">Text alignment</p>
                        <Segmented
                            value={prefs.textAlign}
                            onChange={(v) => onChange("textAlign", v)}
                            options={[
                                { value: "left", label: "Left", icon: <AlignLeft size={15} /> },
                                { value: "justify", label: "Justify", icon: <AlignJustify size={15} /> },
                            ]}
                        />
                    </div>

                    <ToggleRow label="Hyphenation" hint="Break long words (best with Justify)" checked={prefs.hyphenation} onChange={(v) => onChange("hyphenation", v)} />
                </Section>

                <Section title="Focus & comfort">
                    <ToggleRow label="Paragraph focus" hint="Dim everything except what you're reading" checked={prefs.focusParagraph} onChange={(v) => onChange("focusParagraph", v)} />
                    <ToggleRow label="Hide images" hint="Text-only, fewer distractions" checked={prefs.hideImages} onChange={(v) => onChange("hideImages", v)} />
                    <ToggleRow label="Progress bar" hint="Thin bar at the top of the screen" checked={prefs.showProgress} onChange={(v) => onChange("showProgress", v)} />
                </Section>

                <Section title="Keyboard shortcuts">
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        {SHORTCUTS.map(([key, label]) => (
                            <li key={key} className="flex items-center gap-2">
                                <kbd className="px-1.5 py-0.5 rounded-md font-mono text-[11px]" style={{ background: "var(--r-bg)", border: "1px solid var(--r-border)" }}>
                                    {key}
                                </kbd>
                                <span style={{ color: "var(--r-muted)" }}>{label}</span>
                            </li>
                        ))}
                    </ul>
                </Section>
            </aside>
        </>
    );
}