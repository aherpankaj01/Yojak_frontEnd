
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "../Logo";
import LogoutBtn from "./LogOutBtn";
import SearchBar from "../SearchBar";
import NotificationBell from "../NotificationBell";

const Header = () => {
    const authStatus = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.auth.userData);

    const [openMenu, setOpenMenu] = useState(null);
    const headerRef = useRef(null);
    const location = useLocation();
    const currentPath = location.pathname;

    const profilePath = userData?.$id
        ? `/profile/${userData.$id}`
        : "/";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                headerRef.current &&
                !headerRef.current.contains(event.target)
            ) {
                setOpenMenu(null);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setOpenMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const toggleMenu = (menu) => {
        setOpenMenu((current) => current === menu ? null : menu);
    };

    const closeMenu = () => {
        setOpenMenu(null);
    };

    const navButtonClass = `
        flex items-center gap-2
        whitespace-nowrap
        rounded-full px-4 py-2.5
        text-sm sm:text-base font-semibold
        text-gray-200
        transition-all duration-200
        hover:bg-white/10 hover:text-white
    `;

    const dropdownClass = `
        absolute right-0 top-full mt-3
        w-56 overflow-hidden
        rounded-xl
        border border-white/10
        bg-gray-900/95
        shadow-2xl shadow-black/40
        backdrop-blur-xl
        py-2
        z-[60]
    `;

    const menuLinkClass = `
        flex items-center gap-3
        px-4 py-3
        text-sm font-medium text-gray-300
        transition-colors duration-200
        hover:bg-white/10 hover:text-white
    `;

    return (
        <header
            ref={headerRef}
            className="sticky top-0 z-50 border-b border-white/10 bg-gray-900/95 shadow-lg backdrop-blur-xl"
        >
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <nav className="relative flex flex-wrap items-center gap-x-6 gap-y-4 py-4 xl:flex-nowrap">


                    <Link
                        to="/"
                        onClick={closeMenu}
                        className="flex shrink-0 items-center gap-2"
                    >
                        <Logo width="55px" />
                        <span className="text-xl font-bold tracking-wide text-white sm:text-2xl">
                            Yojak
                        </span>
                    </Link>


                    <div
                        className="
                               w-full sm:max-w-[30rem]
                               xl:absolute xl:left-1/2 xl:top-1/2
                               xl:w-[30rem] xl:max-w-none
                               xl:-translate-x-1/2 xl:-translate-y-1/2"
                    >
                        <SearchBar />
                    </div>


                    <ul className="ml-auto flex w-full flex-wrap items-center justify-center gap-2 sm:w-auto sm:justify-end sm:gap-3 xl:mr-8 xl:shrink-0">

                        <li>
                            <Link
                                to="/"
                                onClick={closeMenu}
                                className={navButtonClass}
                            >
                                Home
                            </Link>
                        </li>

                        {authStatus ? (
                            <>
                                <li>
                                    <NotificationBell />
                                </li>
                                <li className="relative">
                                    <button
                                        type="button"
                                        onClick={() => toggleMenu("posts")}
                                        aria-expanded={openMenu === "posts"}
                                        aria-haspopup="true"
                                        className={navButtonClass}
                                    >
                                        Posts
                                        <svg
                                            className={`h-4 w-4 transition-transform duration-200 ${
                                                openMenu === "posts" ? "rotate-180" : ""
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="m6 9 6 6 6-6"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>

                                    {openMenu === "posts" && (
                                        <div className={dropdownClass}>
                                            <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Posts
                                            </div>

                                            <Link
                                                to="/all-posts"
                                                onClick={closeMenu}
                                                className={menuLinkClass}
                                            >
                                                <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                                All Posts
                                            </Link>

                                            <Link
                                                to="/add-post"
                                                onClick={closeMenu}
                                                className={menuLinkClass}
                                            >
                                                <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 5v14m-7-7h14" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                                Add Post
                                            </Link>

                                            <Link
                                                to="/saved"
                                                onClick={closeMenu}
                                                className={menuLinkClass}
                                            >
                                                <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path d="M6 4h12a1 1 0 0 1 1 1v16l-7-4-7 4V5a1 1 0 0 1 1-1Z" strokeWidth="2" strokeLinejoin="round" />
                                                </svg>
                                                Saved Posts
                                            </Link>
                                        </div>
                                    )}
                                </li>


                                <li className="relative">
                                    <button
                                        type="button"
                                        onClick={() => toggleMenu("profile")}
                                        aria-expanded={openMenu === "profile"}
                                        aria-haspopup="true"
                                        className={navButtonClass}
                                    >
                                        My Profile
                                        <svg
                                            className={`h-4 w-4 transition-transform duration-200 ${
                                                openMenu === "profile" ? "rotate-180" : ""
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="m6 9 6 6 6-6"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>

                                    {openMenu === "profile" && (
                                        <div className={dropdownClass}>
                                            <div className="border-b border-white/10 px-4 py-3">
                                                <p className="text-sm font-semibold text-white">
                                                    {userData?.name || "My Account"}
                                                </p>
                                                <p className="mt-1 truncate text-xs text-gray-400">
                                                    {userData?.email || ""}
                                                </p>
                                            </div>

                                            <Link
                                                to={profilePath}
                                                onClick={closeMenu}
                                                className={menuLinkClass}
                                            >
                                                <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path d="M20 21a8 8 0 0 0-16 0m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                                View Profile
                                            </Link>

                                            <Link
                                                to="/edit-profile"
                                                onClick={closeMenu}
                                                className={menuLinkClass}
                                            >
                                                <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path d="m16 4 4 4M4 20l4-.8L19.4 7.8a2 2 0 0 0-2.8-2.8L5.2 16.4 4 20Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Edit Profile
                                            </Link>

                                            <div className="my-2 border-t border-white/10" />

                                            <div className="px-2">
                                                <LogoutBtn onLogout={closeMenu} />
                                            </div>
                                        </div>
                                    )}
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        to="/login"
                                        onClick={closeMenu}
                                        className={navButtonClass}
                                    >
                                        Login
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to="/signup"
                                        onClick={closeMenu}
                                        className="
                                            whitespace-nowrap rounded-full
                                            bg-gradient-to-r from-purple-600 to-indigo-600
                                            px-5 py-2.5 text-sm sm:text-base
                                            font-semibold text-white
                                            shadow-lg shadow-purple-900/30
                                            transition-all duration-300
                                            hover:scale-105 hover:shadow-purple-500/30
                                        "
                                    >
                                        Sign Up
                                    </Link>
                                </li>
                            </>
                        )}

                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
