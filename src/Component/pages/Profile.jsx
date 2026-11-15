import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import userService from "../../services/userService";
import followService from "../../services/followService";
import fileService from "../../services/fileService";
import { Container, PostCard } from "../../Component";
import { getCached, setCached } from "../../utils/simpleCache";

const FILTERS = [
    { key: "recent", label: "Most Recent" },
    { key: "most_liked", label: "Most Liked" },
    { key: "most_commented", label: "Most Commented" },
];

const bannerStyle = {
    background:
        "radial-gradient(60% 120% at 10% 0%, rgba(168,85,247,0.9), transparent 60%), radial-gradient(50% 120% at 90% 10%, rgba(99,102,241,0.85), transparent 60%), radial-gradient(60% 140% at 55% 120%, rgba(236,72,153,0.55), transparent 60%), #111827",
};

const EMPTY_FOLLOW_STATUS = {
    followersCount: 0,
    followingCount: 0,
    following: false,
};

function Stat({ label, value }) {
    return (
        <div className="flex-1 py-4 text-center">
            <p className="bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
                {value}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                {label}
            </p>
        </div>
    );
}

export default function Profile() {
    const { userId } = useParams();
    const currentUser = useSelector((state) => state.auth.userData);

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("recent");
    const [followStatus, setFollowStatus] = useState(EMPTY_FOLLOW_STATUS);
    const [followBusy, setFollowBusy] = useState(false);

    const isOwnProfile = Boolean(currentUser && currentUser.$id === userId);

    useEffect(() => {
        setProfile(null);
        userService.getPublicProfile(userId).then((data) => {
            if (data) setProfile(data);
        });
    }, [userId]);

    useEffect(() => {
        let cancelled = false;
        setFollowStatus(EMPTY_FOLLOW_STATUS);

        followService.getStatus(userId).then((result) => {
            if (!cancelled && result) setFollowStatus(result);
        });

        return () => {
            cancelled = true;
        };
    }, [userId, currentUser?.$id]);

    useEffect(() => {
        let cancelled = false;
        const cacheKey = `profile-posts-${userId}-${activeFilter}`;
        const cached = getCached(cacheKey);

        if (cached) {
            setPosts(cached.data);
            setLoading(false);

            if (cached.isExpired) {
                userService.getPostsByUser(userId, activeFilter).then((data) => {
                    if (!cancelled) {
                        setPosts(data);
                        setCached(cacheKey, data);
                    }
                });
            }

            return () => {
                cancelled = true;
            };
        }

        setLoading(true);
        userService.getPostsByUser(userId, activeFilter).then((data) => {
            if (cancelled) return;
            setPosts(data);
            setCached(cacheKey, data);
            setLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, [userId, activeFilter]);

    const handleToggleFollow = async () => {
        if (followBusy) return;
        setFollowBusy(true);

        try {
            const result = followStatus.following
                ? await followService.unfollow(userId)
                : await followService.follow(userId);

            if (result) setFollowStatus(result);
        } finally {
            setFollowBusy(false);
        }
    };

    if (!profile) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
                <p className="animate-pulse">Loading profile...</p>
            </div>
        );
    }

    const avatarUrl = profile.avatar
        ? fileService.getFilePreview(profile.avatar, "avatar")
        : "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.name);

    const postsCount = loading && posts.length === 0 ? "—" : posts.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-3 py-8 text-white sm:px-4 sm:py-10">
            <Container>
                <div className="mx-auto max-w-6xl">
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-gray-900/70 shadow-2xl shadow-black/40">
                        <div className="h-28 sm:h-40" style={bannerStyle} />

                        <div className="px-6 pb-6 sm:px-8">
                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
                                <div className="-mt-14 shrink-0 rounded-full bg-gradient-to-tr from-purple-400 via-indigo-400 to-pink-400 p-1 shadow-xl shadow-purple-900/40 sm:-mt-16">
                                    <img
                                        src={avatarUrl}
                                        alt={profile.name}
                                        className="h-28 w-28 rounded-full border-4 border-gray-900 object-cover sm:h-32 sm:w-32"
                                    />
                                </div>

                                <div className="min-w-0 flex-1 text-center sm:pb-1 sm:text-left">
                                    <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                        <h1 className="truncate text-3xl font-extrabold tracking-tight sm:text-4xl">
                                            {profile.name}
                                        </h1>
                                        {isOwnProfile && (
                                            <span className="rounded-full border border-purple-400/40 bg-purple-500/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-purple-200">
                                                You
                                            </span>
                                        )}
                                    </div>

                                    {isOwnProfile && profile.email && (
                                        <p className="mt-1 truncate text-sm text-gray-400">
                                            {profile.email}
                                        </p>
                                    )}
                                </div>

                                <div className="flex shrink-0 items-center gap-3 sm:pb-1">
                                    {isOwnProfile && (
                                        <Link
                                            to="/edit-profile"
                                            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 transition hover:from-purple-400 hover:to-indigo-400"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path d="m16 4 4 4M4 20l4-.8L19.4 7.8a2 2 0 0 0-2.8-2.8L5.2 16.4 4 20Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Edit Profile
                                        </Link>
                                    )}

                                    {currentUser && !isOwnProfile && (
                                        <button
                                            type="button"
                                            onClick={handleToggleFollow}
                                            disabled={followBusy}
                                            className={
                                                followStatus.following
                                                    ? "rounded-full border border-white/20 bg-white/10 px-7 py-2.5 text-sm font-semibold text-gray-200 transition hover:bg-white/20 disabled:opacity-50"
                                                    : "rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-7 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 transition hover:from-purple-400 hover:to-indigo-400 disabled:opacity-50"
                                            }
                                        >
                                            {followBusy
                                                ? "..."
                                                : followStatus.following
                                                    ? "Following"
                                                    : "Follow"}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {profile.bio ? (
                                <p className="mt-5 max-w-3xl border-l-2 border-purple-500/70 pl-4 text-sm leading-relaxed text-gray-300 sm:text-base">
                                    {profile.bio}
                                </p>
                            ) : (
                                isOwnProfile && (
                                    <p className="mt-5 border-l-2 border-white/10 pl-4 text-sm text-gray-500">
                                        No bio added yet.
                                    </p>
                                )
                            )}
                        </div>

                        <div className="flex divide-x divide-white/10 border-t border-white/10 bg-black/20">
                            <Stat label="Posts" value={postsCount} />
                            <Stat label="Followers" value={followStatus.followersCount} />
                            <Stat label="Following" value={followStatus.followingCount} />
                        </div>
                    </div>

                    <section className="mt-12">
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <span className="h-7 w-1.5 rounded-full bg-gradient-to-b from-purple-500 to-indigo-500" />
                                <h2 className="text-xl font-bold sm:text-2xl">
                                    {isOwnProfile ? "My Posts" : `Posts by ${profile.name}`}
                                </h2>
                                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-gray-300">
                                    {postsCount}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {FILTERS.map((filter) => (
                                    <button
                                        key={filter.key}
                                        onClick={() => setActiveFilter(filter.key)}
                                        className={
                                            activeFilter === filter.key
                                                ? "rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-purple-900/40"
                                                : "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
                                        }
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <p className="animate-pulse py-10 text-center text-gray-400">
                                Loading posts...
                            </p>
                        ) : posts.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-14 text-center">
                                <p className="text-4xl">📝</p>
                                <p className="mt-3 text-lg font-semibold">No posts yet</p>
                                <p className="mt-1 text-sm text-gray-400">
                                    {isOwnProfile
                                        ? "You haven't posted anything yet."
                                        : `${profile.name} hasn't posted anything yet.`}
                                </p>
                                {isOwnProfile && (
                                    <Link
                                        to="/add-post"
                                        className="mt-5 inline-block rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/40"
                                    >
                                        Create your first post
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                                {posts.map((post) => (
                                    <div key={post.$id} className="relative">
                                        <PostCard {...post} />
                                        {isOwnProfile &&
                                            post.status &&
                                            post.status !== "active" && (
                                                <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium capitalize text-gray-200">
                                                    {post.status}
                                                </span>
                                            )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </Container>
        </div>
    );
}