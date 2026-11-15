import React from "react";

function getPageNumbers(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push("...");
    pages.push(total);

    return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const baseClass = "min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition";

    return (
        <nav
            aria-label="Pagination"
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${baseClass} bg-white/10 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40`}
            >
                ← Prev
            </button>

            {getPageNumbers(currentPage, totalPages).map((p, i) =>
                p === "..." ? (
                    <span key={`dots-${i}`} className="px-2 text-gray-400">
                        ...
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        aria-current={p === currentPage ? "page" : undefined}
                        className={`${baseClass} ${
                            p === currentPage
                                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                                : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${baseClass} bg-white/10 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40`}
            >
                Next →
            </button>
        </nav>
    );
}