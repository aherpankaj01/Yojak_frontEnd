
import Logo from "../Logo";
import LogoutBtn from "./LogOutBtn";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar";

const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
    {
      name: "My Profile",
      slug: userData ? `/profile/${userData.$id}` : "/",
      active: authStatus,
    },
  ];

  return (
      <header
          className="sticky top-0 z-50 border-b border-white/10 bg-gray-900/85 shadow-lg backdrop-blur-xl"
          style={{
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
      >
        <div className="w-full px-4 sm:px-5 lg:px-6">
          <nav className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-5">

            <Link
                to="/"
                className="flex shrink-0 items-center gap-2"
            >
              <Logo width="55px" />
              <span className="text-xl font-bold tracking-wide text-white sm:text-2xl">
                            Yojak
                        </span>
            </Link>

            <div className="w-full lg:w-auto lg:flex-1 lg:max-w-[280px]">
              <SearchBar />
            </div>

            <ul className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 lg:justify-end">
              {navItems.map(
                  (item) =>
                      item.active && (
                          <li key={item.name}>
                            <button
                                onClick={() => navigate(item.slug)}
                                className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 hover:shadow-lg"
                            >
                              {item.name}
                            </button>
                          </li>
                      )
              )}

              {authStatus && (
                  <li className="flex items-center">
                    <LogoutBtn />
                  </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
  );
};

export default Header;
