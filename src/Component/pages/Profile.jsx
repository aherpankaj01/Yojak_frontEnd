import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import userService from "../../services/userService";
import fileService from "../../services/fileService";
import { Container, PostCard } from "../../Component";
import { getCached, setCached } from "../../utils/simpleCache";

const FILTERS = [
    { key: "recent", label: "Most Recent" },
    { key: "most_liked", label: "Most Liked" },
    { key: "most_commented", label: "Most Commented" },
];

export default function Profile() {
    const { userId } = useParams();
    const currentUser = useSelector((state) => state.auth.userData);

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("recent");

    const isOwnProfile = currentUser && currentUser.$id === userId;

    useEffect(() => {
        userService.getPublicProfile(userId).then((data) => {
            if (data) setProfile(data);
        });
    }, [userId]);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-8 sm:py-12 px-3 sm:px-4">
            <Container>
                <div className="flex flex-col items-center text-center mb-10">
                    <img
                        src={avatarUrl}
                        alt={profile.name}
                        className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white/20"
                    />
                    <h1 className="text-2xl sm:text-3xl font-bold">{profile.name}</h1>
                    {profile.bio && (
                        <p className="text-gray-400 mt-2 max-w-md">{profile.bio}</p>
                    )}
                    {isOwnProfile && (
                        <a href="/edit-profile" className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition">
                            Edit Profile
                        </a>
                    )}
                </div>

                <h2 className="text-xl font-bold mb-4 text-center">
                    Posts by {profile.name}
                </h2>

                <div className="flex justify-center gap-2 sm:gap-3 mb-8 flex-wrap">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setActiveFilter(filter.key)}
                            className={activeFilter === filter.key
                                ? "px-4 py-2 rounded-full text-sm font-medium transition bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                                : "px-4 py-2 rounded-full text-sm font-medium transition bg-white/10 text-gray-300 hover:bg-white/20"
                            }
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p className="text-center text-gray-400 animate-pulse">Loading posts...</p>
                ) : posts.length === 0 ? (
                    <p className="text-center text-gray-400">No posts yet.</p>
                ) : (
                    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {posts.map((post) => (
                            <PostCard key={post.$id} {...post} />
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}