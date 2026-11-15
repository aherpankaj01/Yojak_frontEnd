import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, PostCard } from "../../Component";
import postService from "../../services/postService";

const PAGE_SIZE = 8;

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("...");
  pages.push(total);

  return pages;
}

function AllPosts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Math.max(parseInt(searchParams.get("page") || "1", 10) || 1, 1);

  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    postService.getPostsPaged(currentPage - 1, PAGE_SIZE).then((res) => {
      if (cancelled) return;
      if (res) {
        setPosts(res.documents);
        setTotalPages(res.totalPages);
      }
      setLoading(false);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setSearchParams({ page: String(page) });
  };

  const btnBase =
      "min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition";

  return (
      <div className="min-h-screen bg-gray-900 text-white py-10">
        <Container>
          <h1 className="text-3xl font-bold mb-6">All Posts</h1>

          {loading ? (
              <p className="animate-pulse py-10 text-center">Loading posts...</p>
          ) : posts.length === 0 ? (
              <p>No posts found</p>
          ) : (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">
                {posts.map((post) => (
                    <PostCard key={post.$id} {...post} />
                ))}
              </div>
          )}

          {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`${btnBase} bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  ← Prev
                </button>

                {getPageNumbers(currentPage, totalPages).map((p, i) =>
                        p === "..." ? (
                            <span key={`dots-${i}`} className="px-2 text-gray-400">
                  ...
                </span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => goToPage(p)}
                                className={`${btnBase} ${
                                    p === currentPage
                                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                                }`}
                            >
                              {p}
                            </button>
                        )
                )}

                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`${btnBase} bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  Next →
                </button>
              </div>
          )}
        </Container>
      </div>
  );
}

export default AllPosts;