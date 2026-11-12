import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmed = query.trim();

        if (trimmed.length < 2) return;

        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="relative flex w-full sm:w-96 lg:w-[30rem] items-center"
        >
            <div className="relative flex w-full items-center">
                <svg
                    className="absolute left-5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <circle cx="11" cy="11" r="7" strokeWidth="2" />
                    <path
                        d="m16 16 4 4"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>

                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search posts, people..."
                    aria-label="Search posts and users"
                    className="w-full rounded-full border border-white/10 bg-white/[0.06] py-3.5 pl-13 pr-28 text-base text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-purple-500/60 focus:bg-white/[0.09] focus:ring-2 focus:ring-purple-500/20"
                />

                <button
                    type="submit"
                    disabled={query.trim().length < 2}
                    className="absolute right-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/20 transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                >
                    Search
                </button>
            </div>
        </form>
    );
}