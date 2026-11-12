
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
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        if (query.length < 2) {
            setUsers([]);
            setPosts([]);
            setLoading(false);
            setError("");
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            setError("");

            try {
                const result = await searchService.search(query);

                if (cancelled) return;

                setUsers(result?.users || []);
                setPosts(result?.posts || []);
            } catch (err) {
                if (cancelled) return;

                setUsers([]);
                setPosts([]);
                setError("Something went wrong while searching. Please try again.");
                console.error("Search error:", err);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchResults();

        return () => {
            cancelled = true;
        };
    }, [query]);

    const avatarUrl = (user) =>
        user.avatar
            ? fileService.getFilePreview(user.avatar, "avatar")
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name || "User"
            )}&background=312e81&color=ffffff`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-10 text-white sm:py-14">
            <Container>
                <div className="mx-auto max-w-7xl px-3 sm:px-5">

                    <div className="mb-10">
                        <div className="mb-4 flex items-center gap-2 text-sm text-purple-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                            EXPLORE YOJAK
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Discover{" "}
                            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                Something New
                            </span>
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
                            Find interesting people, explore posts, and discover
                            new ideas from the Yojak community.
                        </p>
                    </div>

                    {query.length < 2 ? (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-16 text-center sm:px-10">
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10">
                                <svg
                                    className="h-8 w-8 text-purple-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="11" cy="11" r="7" strokeWidth="1.7" />
                                    <path
                                        d="m16 16 4 4"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>

                            <h2 className="text-xl font-semibold">
                                Start exploring
                            </h2>

                            <p className="mt-2 text-sm text-gray-400">
                                Enter at least 2 characters in the search bar
                                to discover posts and people.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Search results for
                                    </p>
                                    <h2 className="mt-1 break-all text-lg font-semibold sm:text-xl">
                                        "{query}"
                                    </h2>
                                </div>

                                {!loading && !error && (
                                    <div className="flex gap-2 text-xs">
                                        <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-purple-300">
                                            {users.length} Users
                                        </span>
                                        <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-indigo-300">
                                            {posts.length} Posts
                                        </span>
                                    </div>
                                )}
                            </div>

                            {loading ? (
                                <div className="space-y-10">
                                    <section>
                                        <div className="mb-5 h-6 w-32 animate-pulse rounded bg-white/10" />
                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {[1, 2, 3].map((item) => (
                                                <div
                                                    key={item}
                                                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                                                >
                                                    <div className="h-12 w-12 animate-pulse rounded-full bg-white/10" />
                                                    <div className="flex-1 space-y-2">
                                                        <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
                                                        <div className="h-3 w-40 animate-pulse rounded bg-white/10" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <div className="mb-5 h-6 w-32 animate-pulse rounded bg-white/10" />
                                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                            {[1, 2, 3].map((item) => (
                                                <div
                                                    key={item}
                                                    className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
                                                />
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            ) : error ? (
                                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-12 text-center">
                                    <h2 className="text-lg font-semibold text-red-300">
                                        Search failed
                                    </h2>
                                    <p className="mt-2 text-sm text-gray-400">
                                        {error}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-12">

                                    <section>
                                        <div className="mb-5 flex items-center justify-between">
                                            <div>
                                                <h2 className="text-xl font-bold">
                                                    People
                                                </h2>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Discover members of Yojak
                                                </p>
                                            </div>

                                            <span className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-gray-400">
                                                {users.length} found
                                            </span>
                                        </div>

                                        {users.length === 0 ? (
                                            <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-8 text-center">
                                                <p className="font-medium text-gray-300">
                                                    No people found
                                                </p>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Try searching with another name.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                {users.map((user) => (
                                                    <Link
                                                        key={user.userId}
                                                        to={`/profile/${user.userId}`}
                                                        className="group flex min-w-0 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:bg-purple-500/[0.07] hover:shadow-xl hover:shadow-purple-950/20"
                                                    >
                                                        <img
                                                            src={avatarUrl(user)}
                                                            alt={user.name || "User"}
                                                            className="h-14 w-14 shrink-0 rounded-full border border-white/10 object-cover transition-transform duration-300 group-hover:scale-105"
                                                            loading="lazy"
                                                        />

                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="truncate font-semibold text-gray-100 transition-colors group-hover:text-purple-300">
                                                                {user.name}
                                                            </h3>

                                                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                                                                {user.bio || "Yojak community member"}
                                                            </p>
                                                        </div>

                                                        <svg
                                                            className="h-5 w-5 shrink-0 text-gray-600 transition-all group-hover:translate-x-1 group-hover:text-purple-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                d="m9 18 6-6-6-6"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </section>

                                    <section>
                                        <div className="mb-5 flex items-center justify-between">
                                            <div>
                                                <h2 className="text-xl font-bold">
                                                    Posts
                                                </h2>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Explore stories and ideas
                                                </p>
                                            </div>

                                            <span className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-gray-400">
                                                {posts.length} found
                                            </span>
                                        </div>

                                        {posts.length === 0 ? (
                                            <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-8 text-center">
                                                <p className="font-medium text-gray-300">
                                                    No posts found
                                                </p>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Try different keywords to find interesting posts.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                                {posts.map((post) => (
                                                    <PostCard
                                                        key={post.$id}
                                                        {...post}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </section>

                                </div>
                            )}
                        </>
                    )}
                </div>
            </Container>
        </div>
    );
}
