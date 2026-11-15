import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import commentService from "../services/commentService";

const INITIAL_VISIBLE = 5;

function timeAgo(dateString) {
    const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateString).toLocaleDateString();
}

function Avatar({ name, small = false }) {
    const letter = (name || "?").trim().charAt(0).toUpperCase();
    return (
        <div
            className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 font-bold text-white ${
                small ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"
            }`}
        >
            {letter}
        </div>
    );
}

function ReplyForm({ onSubmit, onCancel }) {
    const [text, setText] = useState("");
    const [busy, setBusy] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim() || busy) return;
        setBusy(true);
        const ok = await onSubmit(text.trim());
        setBusy(false);
        if (ok) setText("");
    };

    return (
        <form onSubmit={handleSubmit} className="mt-3">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                autoFocus
                className="w-full resize-none rounded-xl border border-white/15 bg-white/10 p-3 text-sm text-white placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-indigo-500"
            />
            <div className="mt-2 flex gap-2">
                <button
                    type="submit"
                    disabled={busy || !text.trim()}
                    className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-1.5 text-sm font-semibold text-white transition disabled:opacity-50"
                >
                    {busy ? "Replying..." : "Reply"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-gray-300 transition hover:bg-white/20"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

function CommentItem({ comment, childrenMap, userData, replyingTo, setReplyingTo, onReply, onDelete, depth }) {
    const [showReplies, setShowReplies] = useState(false);
    const replies = childrenMap[comment.id] || [];
    const indent = depth < 3 ? "ml-1 border-l border-white/10 pl-3 sm:pl-5" : "";

    const handleReplySubmit = async (text) => {
        const ok = await onReply(comment.id, text);
        if (ok) setShowReplies(true);
        return ok;
    };

    return (
        <div className="flex gap-3">
            <Avatar name={comment.userName} small={depth > 0} />

            <div className="min-w-0 flex-1">
                <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-baseline gap-2">
                            <span className="truncate text-sm font-semibold text-white">
                                {comment.userName}
                            </span>
                            <span className="shrink-0 text-xs text-gray-500">
                                {timeAgo(comment.createdAt)}
                            </span>
                        </div>
                        {userData && userData.$id === comment.userId && (
                            <button
                                onClick={() => onDelete(comment.id)}
                                className="shrink-0 text-xs text-gray-500 transition hover:text-red-400"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-300">
                        {comment.content}
                    </p>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-4 px-2 text-xs font-medium">
                    {userData && (
                        <button
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className="text-gray-400 transition hover:text-white"
                        >
                            Reply
                        </button>
                    )}

                    {replies.length > 0 && (
                        <button
                            onClick={() => setShowReplies((v) => !v)}
                            className="inline-flex items-center gap-1 text-indigo-400 transition hover:text-indigo-300"
                        >
                            {showReplies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {showReplies
                                ? "Hide replies"
                                : `View ${replies.length} ${replies.length === 1 ? "reply" : "replies"}`}
                        </button>
                    )}
                </div>

                {replyingTo === comment.id && (
                    <ReplyForm onSubmit={handleReplySubmit} onCancel={() => setReplyingTo(null)} />
                )}

                {showReplies && replies.length > 0 && (
                    <div className={`mt-4 space-y-4 ${indent}`}>
                        {replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                childrenMap={childrenMap}
                                userData={userData}
                                replyingTo={replyingTo}
                                setReplyingTo={setReplyingTo}
                                onReply={onReply}
                                onDelete={onDelete}
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CommentSection({ postSlug, onCountChange }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [showAll, setShowAll] = useState(false);

    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        setShowAll(false);
        loadComments();
    }, [postSlug]);

    useEffect(() => {
        if (!loading && onCountChange) onCountChange(comments.length);
    }, [comments.length, loading]);

    const loadComments = async (silent = false) => {
        if (!silent) setLoading(true);
        const data = await commentService.getComments(postSlug);
        setComments(data);
        setLoading(false);
    };

    const { roots, childrenMap } = useMemo(() => {
        const map = {};
        const topLevel = [];
        comments.forEach((c) => {
            if (c.parentId) {
                (map[c.parentId] ||= []).push(c);
            } else {
                topLevel.push(c);
            }
        });
        Object.values(map).forEach((list) =>
            list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        );
        return { roots: topLevel, childrenMap: map };
    }, [comments]);

    const visibleRoots = showAll ? roots : roots.slice(0, INITIAL_VISIBLE);
    const hiddenCount = roots.length - INITIAL_VISIBLE;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        const result = await commentService.addComment(postSlug, newComment.trim());
        if (result) {
            setNewComment("");
            await loadComments(true);
        }
        setSubmitting(false);
    };

    const handleReply = async (parentId, text) => {
        const result = await commentService.addComment(postSlug, text, parentId);
        if (result) {
            setReplyingTo(null);
            await loadComments(true);
            return true;
        }
        return false;
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        const success = await commentService.deleteComment(commentId);
        if (success) {
            await loadComments(true);
        }
    };

    return (
        <section id="comments" className="mx-auto mt-12 max-w-3xl scroll-mt-24">
            <div className="mb-6 flex items-center gap-3">
                <h3 className="text-xl font-bold text-white sm:text-2xl">Comments</h3>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-sm font-semibold text-gray-300">
                    {comments.length}
                </span>
            </div>

            {userData ? (
                <form onSubmit={handleSubmit} className="mb-8 flex gap-3">
                    <Avatar name={userData.name} />
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            rows={3}
                            className="w-full resize-none rounded-xl border border-white/15 bg-white/10 p-3 text-white placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="mt-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting || !newComment.trim()}
                                className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition hover:from-purple-400 hover:to-indigo-400 disabled:opacity-50"
                            >
                                {submitting ? "Posting..." : "Post Comment"}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mb-8 flex flex-col items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center">
                    <p className="text-sm text-gray-400">Log in to join the conversation.</p>
                    <Link
                        to="/login"
                        className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white"
                    >
                        Log in
                    </Link>
                </div>
            )}

            {loading ? (
                <p className="animate-pulse text-gray-400">Loading comments...</p>
            ) : comments.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-10 text-center">
                    <MessageCircle className="mx-auto text-gray-500" size={28} />
                    <p className="mt-3 text-sm text-gray-400">No comments yet. Be the first!</p>
                </div>
            ) : (
                <>
                    <div className="space-y-6">
                        {visibleRoots.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                childrenMap={childrenMap}
                                userData={userData}
                                replyingTo={replyingTo}
                                setReplyingTo={setReplyingTo}
                                onReply={handleReply}
                                onDelete={handleDelete}
                                depth={0}
                            />
                        ))}
                    </div>

                    {roots.length > INITIAL_VISIBLE && (
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => setShowAll((v) => !v)}
                                className="rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-semibold text-gray-200 transition hover:bg-white/10 hover:text-white"
                            >
                                {showAll
                                    ? "Show less"
                                    : `Show all comments (${hiddenCount} more)`}
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}