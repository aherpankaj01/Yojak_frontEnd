import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full sm:w-72 flex">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts or users..."
                className="w-full bg-white/10 text-white placeholder-gray-400 text-sm px-4 py-2 rounded-l-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold text-white rounded-r-full bg-gradient-to-r from-purple-500 to-indigo-500"
            >
                Search
            </button>
        </form>
    );
}