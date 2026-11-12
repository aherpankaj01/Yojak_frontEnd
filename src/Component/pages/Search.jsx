import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import searchService from "../../services/searchService";
import fileService from "../../services/fileService";
import { Container, PostCard } from "../../Component";

export default function Search() {
    const [params] = useSearchParams();
    const query = (params.get("q") || "").trim();

    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query.length < 2) {
            setUsers([]);
            setPosts([]);
            return;
        }

        let cancelled = false;
        setLoading(true);

        searchService.search(query).then((result) => {
            if (cancelled) return; // a newer search replaced this one
            setUsers(result.users);
            setPosts(result.posts);
            setLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, [query]);

    const avatarUrl = (user) =>
        user.avatar
            ? fileService.getFilePreview(user.avatar, "avatar")
            : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-8 px-3 sm:px-4">
            <Container>
                <h1 className="text-2xl sm:text-3xl font-bold mb-6">
                    {query ? `Results for "${query}"` : "Search"}
                </h1>

                {query.length < 2 && (
                    <p className="text-gray-400">Type at least 2 characters to search.</p>
                )}

                {loading && <p className="text-gray-400 animate-pulse">Searching...</p>}

                {!loading && query.length >= 2 && (
                    <>
                        <h2 className="text-xl font-semibold mb-3">Users</h2>
                        {users.length === 0 ? (
                            <p className="text-gray-400 mb-8">No users found.</p>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                                {users.map((user) => (
                                    <Link
                                        key={user.userId}
                                        to={`/profile/${user.userId}`}
                                        className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-xl p-3 transition"
                                    >
                                        <img
                                            src={avatarUrl(user)}
                                            alt={user.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="min-w-0">
                                            <p className="font-semibold truncate">{user.name}</p>
                                            {user.bio && (
                                                <p className="text-xs text-gray-400 truncate">{user.bio}</p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        <h2 className="text-xl font-semibold mb-3">Posts</h2>
                        {posts.length === 0 ? (
                            <p className="text-gray-400">No posts found.</p>
                        ) : (
                            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {posts.map((post) => (
                                    <PostCard key={post.$id} {...post} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </Container>
        </div>
    );
}