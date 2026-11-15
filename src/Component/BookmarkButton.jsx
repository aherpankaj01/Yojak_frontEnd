import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Bookmark } from "lucide-react";
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

    if (loading) {
        return <div className="h-11 w-24 animate-pulse rounded-full bg-white/10" />;
    }

    return (
        <button
            onClick={handleToggle}
            disabled={!userData || busy}
            aria-pressed={bookmarked}
            title={!userData ? "Log in to save this post" : bookmarked ? "Remove from saved" : "Save for later"}
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition active:scale-95 ${
                bookmarked
                    ? "border-indigo-500/40 bg-indigo-500/15 text-indigo-300"
                    : "border-white/15 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
            } ${!userData ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
        >
            <Bookmark
                size={18}
                className={bookmarked ? "text-indigo-400" : ""}
                fill={bookmarked ? "currentColor" : "none"}
            />
            <span>{bookmarked ? "Saved" : "Save"}</span>
        </button>
    );
}