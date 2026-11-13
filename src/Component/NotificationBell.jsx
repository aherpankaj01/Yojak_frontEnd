import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import notificationService from "../services/notificationService";
import fileService from "../services/fileService";

const POLL_INTERVAL_MS = 10000;

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

function describe(n) {
    switch (n.type) {
        case "LIKE":
            return "liked your post";
        case "COMMENT":
            return "commented on your post";
        case "REPLY":
            return "replied to your comment";
        case "FOLLOW":
            return "started following you";
        default:
            return "sent you a notification";
    }
}

function getLink(n) {
    if (n.type === "FOLLOW") return `/profile/${n.actorId}`;
    if (n.postSlug) return `/post/${n.postSlug}`;
    return "/";
}

export default function NotificationBell() {
    const authStatus = useSelector((state) => state.auth.status);
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [unread, setUnread] = useState(0);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    const refreshCount = useCallback(async () => {
        const count = await notificationService.getUnreadCount();
        if (count !== null) setUnread(count);
    }, []);

    const loadList = useCallback(async () => {
        const data = await notificationService.getAll();
        setItems(data);
    }, []);

    useEffect(() => {
        if (!authStatus) return;

        refreshCount();

        const tick = () => {
            if (document.visibilityState !== "visible") return;
            refreshCount();
            if (open) loadList();
        };

        const interval = setInterval(tick, POLL_INTERVAL_MS);
        document.addEventListener("visibilitychange", tick);

        return () => {
            clearInterval(interval);
            document.removeEventListener("visibilitychange", tick);
        };
    }, [authStatus, open, refreshCount, loadList]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const handleEscape = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const toggleOpen = async () => {
        const next = !open;
        setOpen(next);
        if (next) {
            setLoading(true);
            await loadList();
            await refreshCount();
            setLoading(false);
        }
    };

    const handleItemClick = async (n) => {
        setOpen(false);
        if (!n.read) {
            setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
            setUnread((c) => Math.max(0, c - 1));
            notificationService.markRead(n.id);
        }
        navigate(getLink(n));
    };

    const handleMarkAll = async () => {
        const ok = await notificationService.markAllRead();
        if (ok) {
            setItems((prev) => prev.map((x) => ({ ...x, read: true })));
            setUnread(0);
        }
    };

    if (!authStatus) return null;

    return (
        <div ref={wrapperRef} className="relative">
            <button
                type="button"
                onClick={toggleOpen}
                aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
                aria-expanded={open}
                aria-haspopup="true"
                className="relative flex items-center rounded-full p-2.5 text-gray-200 transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9ZM10.3 21a1.94 1.94 0 0 0 3.4 0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                {unread > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold leading-none text-white shadow">
                        {unread > 99 ? "99+" : unread}
                    </span>
                )}
            </button>

            {open && (
                <div className="fixed left-4 right-4 top-full z-[60] mt-3 overflow-hidden rounded-xl border border-white/10 bg-gray-900/95 shadow-2xl shadow-black/40 backdrop-blur-xl sm:absolute sm:left-auto sm:right-0 sm:w-96">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                        <h3 className="text-sm font-semibold text-white">Notifications</h3>
                        {unread > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAll}
                                className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading && items.length === 0 ? (
                            <p className="px-4 py-6 text-center text-sm text-gray-400 animate-pulse">
                                Loading...
                            </p>
                        ) : items.length === 0 ? (
                            <p className="px-4 py-8 text-center text-sm text-gray-400">
                                No notifications yet.
                            </p>
                        ) : (
                            items.map((n) => {
                                const avatarUrl = n.actorAvatar
                                    ? fileService.getFilePreview(n.actorAvatar, "avatar")
                                    : "https://ui-avatars.com/api/?name=" + encodeURIComponent(n.actorName);

                                return (
                                    <button
                                        key={n.id}
                                        type="button"
                                        onClick={() => handleItemClick(n)}
                                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/10 ${
                                            n.read ? "" : "bg-indigo-500/10"
                                        }`}
                                    >
                                        <img
                                            src={avatarUrl}
                                            alt={n.actorName}
                                            className="h-9 w-9 shrink-0 rounded-full object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm text-gray-200">
                                                <span className="font-semibold text-white">{n.actorName}</span>{" "}
                                                {describe(n)}
                                                {n.postTitle && n.type !== "FOLLOW" && (
                                                    <span className="text-gray-400"> · {n.postTitle}</span>
                                                )}
                                            </p>
                                            <p className="mt-0.5 text-xs text-gray-500">{timeAgo(n.createdAt)}</p>
                                        </div>
                                        {!n.read && (
                                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}