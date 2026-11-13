
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import authService from "../../services/authService";
import Input from "../Input";
import Logo from "../Logo";
import Button from "../Button";

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
            await authService.resetPassword({
                token,
                newPassword,
                confirmPassword,
            });

            setDone(true);
            setTimeout(() => navigate("/login"), 2500);
        } catch (err) {
            setError(err?.response?.data?.message || err.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-10">
            <div className="w-full max-w-md">
                <div className="backdrop-blur-lg bg-white/10 border border-white/10 shadow-2xl rounded-2xl p-6 sm:p-8 text-white">

                    <div className="flex flex-col items-center mb-7">
                        <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center mb-5">
                            <Logo width="55px" />
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
                            Choose a New Password
                        </h2>

                        <p className="text-center text-gray-300 text-sm">
                            Create a strong password for your account.
                        </p>
                    </div>

                    {!token ? (
                        <div className="text-center">
                            <p className="text-red-400 text-sm mb-5 bg-red-500/10 py-3 px-4 rounded-lg">
                                This reset link is missing its token. Please use the link from your email, or request a new one.
                            </p>

                            <Link
                                to="/forgot-password"
                                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                            >
                                Request a new link
                            </Link>
                        </div>
                    ) : done ? (
                        <div className="text-center">
                            <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 py-3 px-4 rounded-lg">
                                Your password has been updated successfully. Redirecting you to sign in...
                            </p>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <p className="text-red-400 text-center text-sm mb-5 bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-lg">
                                    {error}
                                </p>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">

                                <Input
                                    label="New Password"
                                    type="password"
                                    placeholder="Enter your new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />

                                <Input
                                    label="Confirm New Password"
                                    type="password"
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        disabled={busy}
                                        className="w-full"
                                    >
                                        {busy ? "Updating Password..." : "Update Password"}
                                    </Button>
                                </div>

                            </form>

                            <div className="text-center mt-6 text-sm">
                                <Link
                                    to="/forgot-password"
                                    className="text-gray-400 hover:text-gray-200 transition-colors"
                                >
                                    Request a new reset link
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
