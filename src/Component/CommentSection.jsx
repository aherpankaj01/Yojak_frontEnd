import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import commentService from "../services/commentService";

export default function CommentSection({ postSlug }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

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
                <p className="text-gray-400 mb-6">
                    Log in to leave a comment.
                </p>
            )}

            {loading ? (
                <p className="text-gray-400 animate-pulse">Loading comments...</p>
            ) : comments.length === 0 ? (
                <p className="text-gray-400">No comments yet. Be the first!</p>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="bg-white/5 border border-white/10 rounded-lg p-4"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-white text-sm">
                                    {comment.userName}
                                </span>
                                {userData && userData.$id === comment.userId && (
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="text-red-400 hover:text-red-300 text-xs"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-300 text-sm">{comment.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}