
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
import { BookOpen } from "lucide-react";

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
                    <blockquote className="border-l-4 border-blue-500 pl-5 py-1 my-6 bg-white/5 rounded-r-lg italic text-gray-300 text-lg">
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
                        className="rounded-xl w-full my-6 shadow-lg"
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <p className="animate-pulse text-lg">Loading post...</p>
            </div>
        );
    }

    return post ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-8 sm:py-12">
            <Container>
                {post.featuredImage && (
                    <div className="relative w-full mb-8 rounded-2xl overflow-hidden shadow-2xl">
                        <img
                            src={fileService.getFileView(post.featuredImage)}
                            alt={post.title}
                            className="w-full h-64 sm:h-80 md:h-[28rem] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                    </div>
                )}

                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
                        <div className="flex items-center gap-3 min-w-0">
                            <Link
                                to={authorProfilePath}
                                className="shrink-0"
                                aria-label={`View ${post.authorName}'s profile`}
>
<img
src={authorAvatar}
alt={post.authorName || "Author"}
className="w-12 h-12 rounded-full object-cover border-2 border-white/10 hover:border-indigo-400 transition-all duration-300"
    />
    </Link>

<div className="flex flex-col gap-1 min-w-0">
  <Link
      to={authorProfilePath}
      className="text-white font-semibold text-sm sm:text-base hover:text-indigo-400 transition-colors truncate"
  >
    {post.authorName || "Unknown Author"}
  </Link>

  <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-gray-400">
    <span>{formatPostDate(post.createdAt)}</span>
    <span>·</span>
    <span>{readingTime} min read</span>
  </div>
</div>
</div>

<div className="flex items-center gap-3 shrink-0">
    <button
        type="button"
        onClick={() => setReaderOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 text-sm font-medium transition"
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
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition"
        >
          ✏️ Edit
        </Link>

        <button
            onClick={deletePost}
            className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition"
        >
          🗑️ Delete
        </button>
      </>
  )}
</div>
</div>

<hr className="border-white/10 mb-8" />

<div className="text-gray-300">
  {typeof post.content === "string"
      ? parse(post.content, parseOptions)
      : null}
</div>
</div>

<div className="max-w-3xl mx-auto mb-6">
  <div className="flex items-center gap-3 flex-wrap">
    <LikeButton postSlug={post.slug} />
    <BookmarkButton postSlug={post.slug} />
  </div>
</div>

<CommentSection postSlug={post.slug} />
                {readerOpen && (
                    <Suspense fallback={null}>
                        <ReaderMode
                            title={post.title}
                            content={post.content}
                            authorName={post.authorName}
                            dateLabel={formatPostDate(post.createdAt)}
                            readingTime={readingTime}
                            coverImage={post.featuredImage ? fileService.getFileView(post.featuredImage) : null}
                            onClose={() => setReaderOpen(false)}
                        />
                    </Suspense>
                )}
</Container>
</div>
) : null;
}