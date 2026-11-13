import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import authService from "../../services/authService";

export default function ResetPassword() {
    const [params] = useSearchParams();
    const token = params.get("token") || "";
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setBusy(true);
        try {
            await authService.resetPassword({ token, newPassword, confirmPassword });
            setDone(true);
            setTimeout(() => navigate("/login"), 2500);
        } catch (err) {
            setError(err?.response?.data?.message || err.message);
        } finally {
            setBusy(false);
        }
    };

    const fieldClass =
        "w-full bg-white/20 text-white rounded-lg px-4 py-2.5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
            <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8 text-white">
                <h2 className="text-2xl font-bold text-center mb-6">Choose a new password</h2>

                {!token ? (
                    <div className="text-center">
                        <p className="text-red-400 text-sm mb-4">
                            This reset link is missing its token. Please use the link from your email, or request a new one.
                        </p>
                        <Link to="/forgot-password" className="text-indigo-300 hover:text-indigo-200 text-sm">
                            Request a new link
                        </Link>
                    </div>
                ) : done ? (
                    <p className="text-green-400 text-center text-sm bg-green-500/10 py-3 rounded-lg">
                        Your password has been updated. Taking you to sign in...
                    </p>
                ) : (
                    <>
                        {error && (
                            <p className="text-red-400 text-center text-sm mb-4 bg-red-500/10 py-2 rounded-lg">
                                {error}
                            </p>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New password"
                                autoComplete="new-password"
                                className={fieldClass}
                            />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                                className={fieldClass}
                            />
                            <button
                                type="submit"
                                disabled={busy}
                                className="w-full py-2.5 rounded-lg font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 disabled:opacity-50"
                            >
                                {busy ? "Saving..." : "Update password"}
                            </button>
                        </form>

                        <div className="text-center mt-5 text-sm">
                            <Link to="/forgot-password" className="text-gray-400 hover:text-gray-200">
                                Request a new link
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}