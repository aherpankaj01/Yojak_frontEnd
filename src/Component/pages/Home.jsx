import React, { useEffect, useState } from "react";
import postService from "../../services/postService";
import { Container, PostCard } from "../../Component";
import { getCached, setCached } from "../../utils/simpleCache";

const FILTERS = [
    { key: "recent", label: "Most Recent" },
    { key: "most_liked", label: "Most Liked" },
    { key: "most_commented", label: "Most Commented" },
];

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
                postService.getPosts("active", activeFilter).then((res) => {
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
            .getPosts("active", activeFilter)
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-6 sm:py-8 md:py-10 px-3 sm:px-4">
            <Container>
                <div className="mb-8 sm:mb-10 text-center">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">
                        Explore Posts ✨
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base">
                        Discover amazing content created by users
                    </p>
                </div>

                <div className="flex justify-center gap-2 sm:gap-3 mb-8 flex-wrap">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setActiveFilter(filter.key)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition
                                ${activeFilter === filter.key
                                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-10">
                        <p className="animate-pulse text-base sm:text-lg">
                            Loading posts...
                        </p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-10">
                        <h2 className="text-xl sm:text-2xl font-bold mb-2">
                            No posts available 🚀
                        </h2>
                        <p className="text-gray-400 text-sm sm:text-base">
                            Login and create your first post!
                        </p>
                    </div>
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

export default Home;