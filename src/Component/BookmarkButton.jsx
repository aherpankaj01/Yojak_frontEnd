import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import bookmarkService from "../services/bookmarkService";

export default function BookmarkButton({ postSlug }) {
    const [bookmarked, setBookmarked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        let cancelled = false;

        if (!userData) {
            setBookmarked(false);
            setLoading(false);
            return;
        }

        setLoading(true);
        bookmarkService.getStatus(postSlug).then((status) => {
            if (cancelled) return;
            setBookmarked(status.bookmarked);
            setLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, [postSlug, userData]);

    const handleToggle = async () => {
        if (!userData || busy) return;

        setBusy(true);
        const result = bookmarked
            ? await bookmarkService.unbookmarkPost(postSlug)
            : await bookmarkService.bookmarkPost(postSlug);

        if (result) setBookmarked(result.bookmarked);
        setBusy(false);
    };

    if (loading) return null;

    return (
        <button
            onClick={handleToggle}
            disabled={!userData || busy}
            title={!userData ? "Log in to save this post" : bookmarked ? "Remove from saved" : "Save for later"}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition
                ${bookmarked
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                : "bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20"
            }
                ${!userData ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
        >
            <span>{bookmarked ? "🔖" : "📑"}</span>
            <span>{bookmarked ? "Saved" : "Save"}</span>
        </button>
    );
}