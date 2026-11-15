import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import postService from "../../services/postService";
import { Container, PostCard } from "../../Component";
import { getCached, setCached } from "../../utils/simpleCache";

const FILTERS = [
    { key: "recent", label: "Most Recent" },
    { key: "most_liked", label: "Most Liked" },
    { key: "most_commented", label: "Most Commented" },
];

function SkeletonCard() {
    return (
        <div className="animate-pulse overflow-hidden rounded-xl bg-white/5">
            <div className="aspect-[4/3] w-full bg-white/10" />
            <div className="space-y-3 p-4">
                <div className="h-4 w-4/5 rounded bg-white/10" />
                <div className="h-3 w-1/3 rounded bg-white/10" />
            </div>
        </div>
    );
}

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("recent");

    useEffect(() => {
        let cancelled = false;
        const cacheKey = `home-posts-active-${activeFilter}`;
        const cached = getCached(cacheKey);

        if (cached) {
            setPosts(cached.data);
            setLoading(false);

            if (cached.isExpired) {
                postService.getPosts("active", activeFilter, 8).then((res) => {
                    if (!cancelled && res) {
                        setPosts(res.documents);
                        setCached(cacheKey, res.documents);
                    }
                });
            }

            return () => {
                cancelled = true;
            };
        }

        setLoading(true);
        postService
            .getPosts("active", activeFilter, 8)
            .then((res) => {
                if (cancelled) return;
                if (res) {
                    setPosts(res.documents);
                    setCached(cacheKey, res.documents);
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [activeFilter]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-3 py-10 text-white sm:px-4 sm:py-14">
            <Container>
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                        Explore{" "}
                        <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                            Posts
                        </span>
                    </h1>
                    <p className="mt-3 text-sm text-gray-400 sm:text-base">
                        Discover amazing content created by users
                    </p>
                </header>

                <div className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setActiveFilter(filter.key)}
                            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                                activeFilter === filter.key
                                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                                    : "border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                            }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="py-12 text-center">
                        <h2 className="mb-2 text-xl font-bold sm:text-2xl">
                            No posts available
                        </h2>
                        <p className="text-sm text-gray-400 sm:text-base">
                            Login and create your first post!
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                            {posts.map((post) => (
                                <PostCard key={post.$id} {...post} />
                            ))}
                        </div>

                        <div className="mt-10 text-center">
                            <Link
                                to="/all-posts"
                                className="inline-block rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-semibold text-gray-200 transition hover:bg-white/10 hover:text-white"
                            >
                                View all posts →
                            </Link>
                        </div>
                    </>
                )}
            </Container>
        </div>
    );
}

export default Home;