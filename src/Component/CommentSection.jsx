import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import commentService from "../services/commentService";

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
                className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <div className="mt-2 flex gap-2">
                <button
                    type="submit"
                    disabled={busy || !text.trim()}
                    className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                    {busy ? "Replying..." : "Reply"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-1.5 bg-white/10 text-gray-300 rounded-lg text-sm hover:bg-white/20"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

function CommentItem({ comment, childrenMap, userData, replyingTo, setReplyingTo, onReply, onDelete, depth }) {
    const replies = childrenMap[comment.id] || [];
    const indent = depth < 3 ? "ml-4 sm:ml-6 pl-3 border-l border-white/10" : "";

    return (
        <div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-white text-sm">{comment.userName}</span>
                    {userData && userData.$id === comment.userId && (
                        <button
                            onClick={() => onDelete(comment.id)}
                            className="text-red-400 hover:text-red-300 text-xs"
                        >
                            Delete
                        </button>
                    )}
                </div>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{comment.content}</p>

                {userData && (
                    <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="mt-2 text-xs font-medium text-indigo-400 hover:text-indigo-300"
                    >
                        Reply
                    </button>
                )}

                {replyingTo === comment.id && (
                    <ReplyForm
                        onSubmit={(text) => onReply(comment.id, text)}
                        onCancel={() => setReplyingTo(null)}
                    />
                )}
            </div>

            {replies.length > 0 && (
                <div className={`mt-3 space-y-3 ${indent}`}>
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
    );
}

export default function CommentSection({ postSlug }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);

    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        loadComments();
    }, [postSlug]);

    const loadComments = async () => {
        setLoading(true);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        const result = await commentService.addComment(postSlug, newComment.trim());
        if (result) {
            setNewComment("");
            await loadComments();
        }
        setSubmitting(false);
    };

    const handleReply = async (parentId, text) => {
        const result = await commentService.addComment(postSlug, text, parentId);
        if (result) {
            setReplyingTo(null);
            await loadComments();
            return true;
        }
        return false;
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        const success = await commentService.deleteComment(commentId);
        if (success) {
            await loadComments();
        }
    };

    return (
        <div className="mt-10 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">
                Comments ({comments.length})
            </h3>

            {userData ? (
                <form onSubmit={handleSubmit} className="mb-6">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        rows={3}
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                    <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className="mt-2 px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium disabled:opacity-50"
                    >
                        {submitting ? "Posting..." : "Post Comment"}
                    </button>
                </form>
            ) : (
                <p className="text-gray-400 mb-6">Log in to leave a comment.</p>
            )}

            {loading ? (
                <p className="text-gray-400 animate-pulse">Loading comments...</p>
            ) : comments.length === 0 ? (
                <p className="text-gray-400">No comments yet. Be the first!</p>
            ) : (
                <div className="space-y-4">
                    {roots.map((comment) => (
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
            )}
        </div>
    );
}