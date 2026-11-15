import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function FooterLink({ to, children }) {
  return (
      <li>
        <Link
            to={to}
            className="text-sm text-gray-400 transition hover:text-white"
        >
          {children}
        </Link>
      </li>
  );
}

function FooterHeading({ children }) {
  return (
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
        {children}
      </h3>
  );
}

const Footer = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  const profilePath = userData?.$id ? `/profile/${userData.$id}` : "/";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
      <footer className="border-t border-white/10 bg-gray-900 text-gray-300">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent p-6 sm:p-8 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                {authStatus ? "Have something to share?" : "Join the Yojak community"}
              </h2>
              <p className="mt-1 text-sm text-gray-400 sm:text-base">
                {authStatus
                    ? "Write a new post and let others discover your ideas."
                    : "Create a free account to write posts, follow authors and save your favourites."}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              {authStatus ? (
                  <Link
                      to="/add-post"
                      className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition hover:from-purple-400 hover:to-indigo-400"
                  >
                    Write a post
                  </Link>
              ) : (
                  <>
                    <Link
                        to="/signup"
                        className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition hover:from-purple-400 hover:to-indigo-400"
                    >
                      Sign up
                    </Link>
                    <Link
                        to="/login"
                        className="rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-gray-200 transition hover:bg-white/10"
                    >
                      Log in
                    </Link>
                  </>
              )}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-10 md:grid-cols-4">
            <div className="col-span-2">
              <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-lg font-extrabold text-white">
                Y
              </span>
                <span className="text-xl font-bold tracking-wide text-white">
                Yojak
              </span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
                A modern blogging platform where you can share ideas, explore
                content and connect with readers and writers around the world.
              </p>
            </div>

            <div>
              <FooterHeading>Explore</FooterHeading>
              <ul className="space-y-3">
                <FooterLink to="/">Home</FooterLink>
                <FooterLink to="/all-posts">All Posts</FooterLink>
                <FooterLink to="/search">Search</FooterLink>
              </ul>
            </div>

            <div>
              <FooterHeading>Account</FooterHeading>
              <ul className="space-y-3">
                {authStatus ? (
                    <>
                      <FooterLink to={profilePath}>My Profile</FooterLink>
                      <FooterLink to="/edit-profile">Edit Profile</FooterLink>
                      <FooterLink to="/saved">Saved Posts</FooterLink>
                      <FooterLink to="/add-post">Add Post</FooterLink>
                    </>
                ) : (
                    <>
                      <FooterLink to="/login">Login</FooterLink>
                      <FooterLink to="/signup">Sign Up</FooterLink>
                      <FooterLink to="/forgot-password">Forgot Password</FooterLink>
                    </>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
            <p className="text-xs text-gray-500 sm:text-sm">
              © {new Date().getFullYear()} Yojak. All rights reserved.
            </p>

            <button
                type="button"
                onClick={scrollToTop}
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white sm:text-sm"
            >
              Back to top
              <svg
                  className="h-4 w-4 transition group-hover:-translate-y-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
              >
                <path
                    d="m6 15 6-6 6 6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </footer>
  );
};

export default Footer;