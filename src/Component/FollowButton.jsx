
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import followService from "../services/followService";

export default function FollowButton({ userId, isOwnProfile }) {
    const userData = useSelector((state) => state.auth.userData);
    const [following, setFollowing] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        let cancelled = false;

        followService.getStatus(userId).then((status) => {
            if (!cancelled) {
                setFollowing(status.following);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [userId, userData?.$id]);

    const handleToggle = async () => {
        if (busy) return;

        setBusy(true);

        try {
            const result = following
                ? await followService.unfollow(userId)
                : await followService.follow(userId);

            if (result) {
                setFollowing(result.following);
            }
        } finally {
            setBusy(false);
        }
    };

    if (!userData || isOwnProfile) return null;

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={busy}
            className={
                following
                    ? "px-5 py-2 rounded-full text-sm font-semibold bg-white/10 text-gray-200 border border-white/20 hover:bg-white/20 disabled:opacity-50 transition-colors"
                    : "px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
            }
        >
            {busy ? "..." : following ? "Following" : "Follow"}
        </button>
    );
}
