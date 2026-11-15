import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import bookmarkService from "../services/bookmarkService";
import PostCard from "./PostCard";
import Pagination from "./Pagination";

const PAGE_SIZE = 8;

export default function SavedPostsList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Math.max(parseInt(searchParams.get("page") || "1", 10) || 1, 1);

    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const silentReload = useRef(false);

    useEffect(() => {
        let cancelled = false;

        if (!silentReload.current) setLoading(true);
        silentReload.current = false;
        setFailed(false);

        bookmarkService.getSavedPostsPaged(currentPage - 1, PAGE_SIZE).then((res) => {
            if (cancelled) return;

            if (res === null) {
                setFailed(true);
            } else if (res.documents.length === 0 && currentPage > 1 && res.totalPages > 0) {
                setSearchParams({ page: String(res.totalPages) }, { replace: true });
                return;
            } else {
                setPosts(res.documents);
                setTotalPages(res.totalPages);
                setTotalElements(res.totalElements);
            }

            setLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, [currentPage, reloadKey]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        setSearchParams({ page: String(page) });
    };

    const handleRemove = async (slug) => {
        const result = await bookmarkService.unbookmarkPost(slug);
        if (result) {
            silentReload.current = true;
            setPosts((prev) => prev.filter((p) => p.$id !== slug));
            setReloadKey((key) => key + 1);
        }
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
        <div>
            <p className="mb-5 text-sm text-gray-400">
                {totalElements} saved {totalElements === 1 ? "post" : "posts"}
            </p>

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

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
            />
        </div>
    );
}