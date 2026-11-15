import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import userService from "../../services/userService";
import fileService from "../../services/fileService";
import { Container, PostCard } from "../../Component";
import { getCached, setCached } from "../../utils/simpleCache";
import FollowButton from "../FollowButton";

const FILTERS = [
    { key: "recent", label: "Most Recent" },
    { key: "most_liked", label: "Most Liked" },
    { key: "most_commented", label: "Most Commented" },
];

function StatTile({ label, value }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/10">
            <p className="bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
                {value}
            </p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
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
    const [followStats, setFollowStats] = useState({
        followersCount: 0,
        followingCount: 0,
    });

    const isOwnProfile = Boolean(currentUser && currentUser.$id === userId);

    useEffect(() => {
        setProfile(null);
        setFollowStats({ followersCount: 0, followingCount: 0 });
        userService.getPublicProfile(userId).then((data) => {
            if (data) setProfile(data);
        });
    }, [userId]);

    useEffect(() => {
        if (isOwnProfile) {
            setLoading(false);
            return undefined;
        }

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
    }, [userId, activeFilter, isOwnProfile]);

    const handleFollowStatus = (status) => {
        setFollowStats({
            followersCount: status.followersCount,
            followingCount: status.followingCount,
        });
    };

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <p className="animate-pulse">Loading profile...</p>
            </div>
        );
    }

    const avatarUrl = profile.avatar
        ? fileService.getFilePreview(profile.avatar, "avatar")
        : "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.name);

    const postsStat = loading && posts.length === 0 ? "—" : posts.length;

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-3 py-8 text-white sm:px-4 sm:py-12">
            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-pink-600/10 blur-3xl" />

            <Container className="relative">
                <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/40 backdrop-blur-xl">
                    <div className="relative h-36 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 sm:h-48">
                        <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
                        <div className="absolute -bottom-12 right-10 h-48 w-48 rounded-full bg-pink-300/30 blur-2xl" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                    </div>

                    <div className="relative px-5 pb-8 sm:px-10">
                        <div className="-mt-16 flex justify-center sm:-mt-20">
                            <div className="rounded-full bg-gradient-to-tr from-purple-400 via-indigo-400 to-pink-400 p-1 shadow-xl shadow-purple-900/50">
                                <img
                                    src={avatarUrl}
                                    alt={profile.name}
                                    className="h-28 w-28 rounded-full border-4 border-gray-900 object-cover sm:h-36 sm:w-36"
                                />
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
                                    {profile.name}
                                </h1>
                                {isOwnProfile && (
                                    <span className="rounded-full border border-purple-400/40 bg-purple-500/20 px-3 py-0.5 text-xs font-semibold text-purple-200">
                                        You
                                    </span>
                                )}
                            </div>

                            {isOwnProfile && profile.email && (
                                <p className="mt-1 text-sm text-gray-400">
                                    {profile.email}
                                </p>
                            )}

                            {profile.bio ? (
                                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
                                    {profile.bio}
                                </p>
                            ) : (
                                isOwnProfile && (
                                    <p className="mx-auto mt-4 max-w-xl text-sm italic text-gray-500">
                                        You haven't added a bio yet. Tell people about yourself from Edit Profile.
                                    </p>
                                )
                            )}
                        </div>

                        <div
                            className={`mx-auto mt-8 grid gap-3 sm:gap-4 ${
                                isOwnProfile
                                    ? "max-w-sm grid-cols-2"
                                    : "max-w-md grid-cols-3"
                            }`}
                        >
                            {!isOwnProfile && (
                                <StatTile label="Posts" value={postsStat} />
                            )}
                            <StatTile
                                label="Followers"
                                value={followStats.followersCount}
                            />
                            <StatTile
                                label="Following"
                                value={followStats.followingCount}
                            />
                        </div>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            {isOwnProfile && (
                                <>
                                    <Link
                                        to="/edit-profile"
                                        className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-7 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 transition hover:from-purple-400 hover:to-indigo-400"
                                    >
                                        Edit Profile
                                    </Link>
                                    <Link
                                        to="/add-post"
                                        className="rounded-full border border-white/20 bg-white/10 px-7 py-2.5 text-sm font-semibold text-gray-100 transition hover:bg-white/20"
                                    >
                                        + New Post
                                    </Link>
                                </>
                            )}

                            <FollowButton
                                userId={userId}
                                isOwnProfile={isOwnProfile}
                                showCounts={false}
                                onStatusChange={handleFollowStatus}
                            />
                        </div>
                    </div>
                </div>

                {!isOwnProfile && (
                    <section className="mt-14">
                        <div className="mb-6 flex flex-col items-center gap-2 text-center">
                            <h2 className="text-2xl font-bold sm:text-3xl">
                                Posts by{" "}
                                <span className="bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                                    {profile.name}
                                </span>
                            </h2>
                            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />
                        </div>

                        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3">
                            {FILTERS.map((filter) => (
                                <button
                                    key={filter.key}
                                    onClick={() => setActiveFilter(filter.key)}
                                    className={
                                        activeFilter === filter.key
                                            ? "rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-purple-900/40 transition"
                                            : "rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/20"
                                    }
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <p className="animate-pulse py-10 text-center text-gray-400">
                                Loading posts...
                            </p>
                        ) : posts.length === 0 ? (
                            <div className="mx-auto max-w-md rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center backdrop-blur">
                                <p className="text-4xl">📝</p>
                                <p className="mt-3 text-lg font-semibold">
                                    No posts yet
                                </p>
                                <p className="mt-1 text-sm text-gray-400">
                                    {profile.name} hasn't published anything so far.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                                {posts.map((post) => (
                                    <PostCard key={post.$id} {...post} />
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </Container>
        </div>
    );
}