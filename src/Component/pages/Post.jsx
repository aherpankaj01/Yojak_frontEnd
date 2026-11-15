import React, { lazy, Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import postService from "../../services/postService";
import fileService from "../../services/fileService";
import { Container } from "../../Component";
import parse, { domToReact } from "html-react-parser";
import { useSelector } from "react-redux";
import CommentSection from "../CommentSection";
import LikeButton from "../LikeButton";
import BookmarkButton from "../BookmarkButton";
import { clearCache } from "../../utils/simpleCache";
import FollowButton from "../FollowButton";
import { BookOpen, MessageCircle } from "lucide-react";

const ReaderMode = lazy(() => import("../reader/ReaderMode"));

const parseOptions = {
    replace(domNode) {
        if (domNode.type !== "tag") return;

        const children = domToReact(domNode.children, parseOptions);

        switch (domNode.name) {
            case "h1":
                return (
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mt-8 mb-4 leading-tight border-b border-white/10 pb-3">
                        {children}
                    </h1>
                );
            case "h2":
                return (
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mt-8 mb-3 leading-tight">
                        {children}
                    </h2>
                );
            case "h3":
                return (
                    <h3 className="text-xl sm:text-2xl font-semibold text-white mt-6 mb-2">
                        {children}
                    </h3>
                );
            case "h4":
                return (
                    <h4 className="text-lg font-semibold text-gray-200 mt-5 mb-2">
                        {children}
                    </h4>
                );
            case "p":
                return (
                    <p className="text-gray-300 leading-8 mb-5 text-base sm:text-lg">
                        {children}
                    </p>
                );
            case "strong":
            case "b":
                return <strong className="text-white font-semibold">{children}</strong>;
            case "em":
            case "i":
                return <em className="text-gray-200 italic">{children}</em>;
            case "u":
                return (
                    <u className="text-gray-200 underline decoration-gray-400">
                        {children}
                    </u>
                );
            case "a": {
                const href = domNode.attribs ? domNode.attribs.href : undefined;
                return (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                    >
                        {children}
                    </a>
                );
            }
            case "ul":
                return (
                    <ul className="list-disc list-outside pl-6 mb-5 space-y-2 text-gray-300">
                        {children}
                    </ul>
                );
            case "ol":
                return (
                    <ol className="list-decimal list-outside pl-6 mb-5 space-y-2 text-gray-300">
                        {children}
                    </ol>
                );
            case "li":
                return (
                    <li className="text-gray-300 leading-7 text-base sm:text-lg">
                        {children}
                    </li>
                );
            case "blockquote":
                return (
                    <blockquote className="border-l-4 border-indigo-500 pl-5 py-1 my-6 bg-white/5 rounded-r-lg italic text-gray-300 text-lg">
                        {children}
                    </blockquote>
                );
            case "code":
                return (
                    <code className="bg-gray-800 text-green-400 px-2 py-0.5 rounded text-sm font-mono">
                        {children}
                    </code>
                );
            case "pre":
                return (
                    <pre className="bg-gray-900 border border-white/10 rounded-xl p-5 my-6 overflow-x-auto text-sm font-mono text-green-400 leading-6">
                        {children}
                    </pre>
                );
            case "img": {
                const src = domNode.attribs ? domNode.attribs.src : undefined;
                const alt = (domNode.attribs && domNode.attribs.alt) || "";
                return (
                    <img
                        src={src}
                        alt={alt}
                        className="mx-auto my-6 h-auto max-w-full rounded-xl border border-white/10 shadow-lg"
                    />
                );
            }
            case "hr":
                return <hr className="border-white/10 my-8" />;
            case "br":
                return <br />;
            default:
                return;
        }
    },
};

const getReadingTime = (content = "") => {
    const plainText = content
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .trim();

    const wordCount = plainText
        .split(/\s+/)
        .filter(Boolean).length;

    return Math.max(1, Math.ceil(wordCount / 200));
};

const formatPostDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export default function Post() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [readerOpen, setReaderOpen] = useState(false);
    const [commentCount, setCommentCount] = useState(null);

    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userId === userData.$id : false;

    const authorProfilePath = post?.userId
        ? `/profile/${post.userId}`
        : "/";

    const authorAvatar = post?.authorAvatar
        ? fileService.getFilePreview(post.authorAvatar, "avatar")
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            post?.authorName || "Author"
        )}&background=6366f1&color=ffffff`;

    const readingTime = getReadingTime(post?.content || "");

    useEffect(() => {
        if (!slug) {
            navigate("/");
            return;
        }

        setCommentCount(null);

        postService
            .getPost(slug)
            .then((post) => {
                if (post) setPost(post);
                else navigate("/");
            })
            .catch(() => navigate("/"))
            .finally(() => setLoading(false));
    }, [slug, navigate]);

    const deletePost = async () => {
        if (!window.confirm("Delete this post?")) return;

        const status = await postService.deletePost(post.$id);

        if (status) {
            await fileService.deleteFile(post.featuredImage);
            clearCache("home-posts-");
            clearCache("profile-posts-");
            navigate("/");
        }
    };

    const scrollToComments = () => {
        const target = document.getElementById("comments");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <p className="animate-pulse text-lg">Loading post...</p>
            </div>
        );
    }

    if (!post) return null;

    const shownComments = commentCount ?? post.commentCount ?? 0;
    const coverUrl = post.featuredImage ? fileService.getFileView(post.featuredImage) : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-8 sm:py-12 px-3 sm:px-4">
            <Container>
                <div className="mx-auto max-w-4xl">
                    {coverUrl && (
                        <div className="relative mb-10 overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-2xl shadow-black/40">
                            <img
                                src={coverUrl}
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
                            />
                            <img
                                src={coverUrl}
                                alt={post.title}
                                className="relative mx-auto block max-h-[32rem] w-auto max-w-full object-contain"
                            />
                        </div>
                    )}

                    <div className="mx-auto max-w-3xl">
                        <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                            {post.title}
                        </h1>

                        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-5">
                            <div className="flex min-w-0 items-center gap-3">
                                <Link
                                    to={authorProfilePath}
                                    className="shrink-0"
                                    aria-label={`View ${post.authorName}'s profile`}
                                >
                                    <img
                                        src={authorAvatar}
                                        alt={post.authorName || "Author"}
                                        className="h-12 w-12 rounded-full border-2 border-white/10 object-cover transition-all duration-300 hover:border-indigo-400"
                                    />
                                </Link>

                                <div className="flex min-w-0 flex-col gap-0.5">
                                    <Link
                                        to={authorProfilePath}
                                        className="truncate text-sm font-semibold text-white transition-colors hover:text-indigo-400 sm:text-base"
                                    >
                                        {post.authorName || "Unknown Author"}
                                    </Link>

                                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 sm:text-sm">
                                        <span>{formatPostDate(post.createdAt)}</span>
                                        <span>·</span>
                                        <span>{readingTime} min read</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
                                <button
                                    type="button"
                                    onClick={() => setReaderOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-full bg-indigo-500/15 px-4 py-2 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/25"
                                >
                                    <BookOpen size={16} /> Reading mode
                                </button>

                                {!isAuthor && (
                                    <FollowButton userId={post.userId} isOwnProfile={false} showCounts={false} />
                                )}

                                {isAuthor && (
                                    <>
                                        <Link
                                            to={`/edit-post/${post.$id}`}
                                            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={deletePost}
                                            className="rounded-full bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="text-gray-300">
                            {typeof post.content === "string"
                                ? parse(post.content, parseOptions)
                                : null}
                        </div>

                        <div className="mt-12 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                            <LikeButton postSlug={post.slug} />

                            <button
                                type="button"
                                onClick={scrollToComments}
                                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white active:scale-95"
                            >
                                <MessageCircle size={18} />
                                <span>{shownComments}</span>
                                <span className="hidden sm:inline">
                                    {shownComments === 1 ? "Comment" : "Comments"}
                                </span>
                            </button>

                            <div className="ml-auto">
                                <BookmarkButton postSlug={post.slug} />
                            </div>
                        </div>
                    </div>

                    <CommentSection postSlug={post.slug} onCountChange={setCommentCount} />
                </div>

                {readerOpen && (
                    <Suspense fallback={null}>
                        <ReaderMode
                            title={post.title}
                            content={post.content}
                            authorName={post.authorName}
                            dateLabel={formatPostDate(post.createdAt)}
                            readingTime={readingTime}
                            coverImage={coverUrl}
                            onClose={() => setReaderOpen(false)}
                        />
                    </Suspense>
                )}
            </Container>
        </div>
    );
}