import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import likeService from "../services/likeService";

export default function LikeButton({ postSlug }) {
    const [count, setCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        loadStatus();
    }, [postSlug]);

    const loadStatus = async () => {
        setLoading(true);
        const status = await likeService.getStatus(postSlug);
        setCount(status.count);
        setLiked(status.likedByCurrentUser);
        setLoading(false);
    };

    const handleToggle = async () => {
        if (!userData) return; // logged-out users can't click (button is disabled/hidden below)
        if (busy) return;

        setBusy(true);
        const result = liked
            ? await likeService.unlikePost(postSlug)
            : await likeService.likePost(postSlug);

        if (result) {
            setCount(result.count);
            setLiked(result.likedByCurrentUser);
        }
        setBusy(false);
    };

    if (loading) return null;

    return (
        <button
            onClick={handleToggle}
            disabled={!userData || busy}
            title={!userData ? "Log in to like this post" : ""}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition
                ${liked
                    ? "bg-pink-500/20 text-pink-400 border border-pink-500/40"
                    : "bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20"
                }
                ${!userData ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
        >
            <span>{liked ? "❤️" : "🤍"}</span>
            <span>{count}</span>
        </button>
    );
}