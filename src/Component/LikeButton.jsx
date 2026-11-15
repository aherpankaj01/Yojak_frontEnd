import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Heart } from "lucide-react";
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
        if (!userData) return;
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

    if (loading) {
        return <div className="h-11 w-20 animate-pulse rounded-full bg-white/10" />;
    }

    return (
        <button
            onClick={handleToggle}
            disabled={!userData || busy}
            aria-pressed={liked}
            title={!userData ? "Log in to like this post" : liked ? "Unlike" : "Like"}
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition active:scale-95 ${
                liked
                    ? "border-pink-500/40 bg-pink-500/15 text-pink-300"
                    : "border-white/15 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
            } ${!userData ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
        >
            <Heart
                size={18}
                className={liked ? "text-pink-500" : ""}
                fill={liked ? "currentColor" : "none"}
            />
            <span>{count}</span>
        </button>
    );
}