import { X } from "lucide-react";

export default function ReaderTOC({ items, onSelect, onClose }) {
    return (
        <>
            <div className="fixed inset-0 z-30 bg-black/40" onClick={onClose} aria-hidden="true" />
            <aside
                className="reader-panel-enter fixed z-40 top-0 left-0 h-full w-80 max-w-[85vw] overflow-y-auto p-5 shadow-2xl"
                style={{ background: "var(--r-surface)", color: "var(--r-fg)", borderRight: "1px solid var(--r-border)" }}
                aria-label="Table of contents"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold">Contents</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close contents"
                        className="p-2 rounded-lg hover:opacity-70 transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                {items.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--r-muted)" }}>
                        This post has no headings.
                    </p>
                ) : (
                    <nav>
                        <ul className="space-y-1">
                            {items.map((item) => (
                                <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 14}px` }}>
                                    <button
                                        type="button"
                                        onClick={() => onSelect(item.id)}
                                        className="w-full text-left text-sm py-1.5 px-2 rounded-md hover:opacity-70 transition"
                                        style={{ fontWeight: item.level === 1 ? 600 : 400 }}
                                    >
                                        {item.text}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </aside>
        </>
    );
}