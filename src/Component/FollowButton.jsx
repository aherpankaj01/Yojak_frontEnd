import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import followService from "../services/followService";

export default function FollowButton({ userId, isOwnProfile }) {
    const userData = useSelector((state) => state.auth.userData);
    const [status, setStatus] = useState({ followersCount: 0, followingCount: 0, following: false });
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        let cancelled = false;
        followService.getStatus(userId).then((s) => {
            if (!cancelled) setStatus(s);
        });
        return () => {
            cancelled = true;
        };
    }, [userId, userData?.$id]);

    const handleToggle = async () => {
        if (busy) return;
        setBusy(true);
        const result = status.following
            ? await followService.unfollow(userId)
            : await followService.follow(userId);
        if (result) setStatus(result);
        setBusy(false);
    };

    return (
        <div className="mt-4 flex flex-col items-center gap-3">
            <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">{status.followersCount}</span>{" "}
                {status.followersCount === 1 ? "follower" : "followers"}
                <span className="mx-2 text-gray-600">·</span>
                <span className="font-semibold text-white">{status.followingCount}</span> following
            </p>

            {userData && !isOwnProfile && (
                <button
                    type="button"
                    onClick={handleToggle}
                    disabled={busy}
                    className={
                        status.following
                            ? "px-5 py-2 rounded-lg text-sm font-semibold bg-white/10 text-gray-200 border border-white/20 hover:bg-white/20 disabled:opacity-50"
                            : "px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white disabled:opacity-50"
                    }
                >
                    {busy ? "..." : status.following ? "Following" : "Follow"}
                </button>
            )}
        </div>
    );
}