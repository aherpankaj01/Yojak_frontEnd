import React, { useEffect, useState } from "react";
import bookmarkService from "../services/bookmarkService";
import PostCard from "./PostCard";

export default function SavedPostsList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        bookmarkService.getSavedPosts().then((data) => {
            if (cancelled) return;
            if (data === null) setFailed(true);
            else setPosts(data);
            setLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    const handleRemove = async (slug) => {
        const result = await bookmarkService.unbookmarkPost(slug);
        if (result) setPosts((prev) => prev.filter((p) => p.$id !== slug));
    };

    if (loading) {
        return <p className="text-center text-gray-400 animate-pulse">Loading saved posts...</p>;
    }
    if (failed) {
        return <p className="text-center text-gray-400">Couldn't load your saved posts.</p>;
    }
    if (posts.length === 0) {
        return (
            <p className="text-center text-gray-400">
                You haven't saved any posts yet. Use the Save button on a post to keep it here.
            </p>
        );
    }

    return (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {posts.map((post) => (
                <div key={post.$id} className="relative">
                    <PostCard {...post} />
                    <button
                        onClick={() => handleRemove(post.$id)}
                        title="Remove from saved"
                        className="absolute top-2 right-2 rounded-full bg-black/60 hover:bg-red-500/80 text-white text-xs px-2.5 py-1 transition"
                    >
                        ✕ Remove
                    </button>
                </div>
            ))}
        </div>
    );
}