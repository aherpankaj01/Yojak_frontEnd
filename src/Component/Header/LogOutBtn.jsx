
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { logout } from "../../store/authSlice";

const LogoutBtn = ({ onLogout }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      onLogout?.();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
      <button
          type="button"
          onClick={handleLogout}
          className="
                flex w-full items-center gap-3
                rounded-lg px-3 py-3
                text-sm font-semibold
                text-red-400
                transition-all duration-200
                hover:bg-red-500/10 hover:text-red-300
                focus:outline-none focus:ring-2 focus:ring-red-400/50
            "
      >
        <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
          <path
              d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5m5 5H3"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
          />
        </svg>

        Logout
      </button>
  );
};

export default LogoutBtn;
