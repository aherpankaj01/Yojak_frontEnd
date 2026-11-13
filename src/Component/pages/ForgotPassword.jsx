import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/authService";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }

        setBusy(true);
        try {
            await authService.forgotPassword(email.trim());
            setSent(true);
        } catch (err) {
            setError(err?.response?.data?.message || err.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
            <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8 text-white">
                <h2 className="text-2xl font-bold text-center mb-2">Forgot password?</h2>

                {sent ? (
                    <>
                        <p className="text-center text-gray-300 text-sm mt-4">
                            If an account exists for <span className="font-semibold">{email}</span>,
                            we've sent a reset link. It expires in 30 minutes. Check your spam folder too.
                        </p>
                        <div className="text-center mt-6">
                            <Link to="/login" className="text-indigo-300 hover:text-indigo-200 text-sm">
                                Back to sign in
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-center text-gray-300 text-sm mb-6">
                            Enter your email and we'll send you a link to reset your password.
                        </p>

                        {error && (
                            <p className="text-red-400 text-center text-sm mb-4 bg-red-500/10 py-2 rounded-lg">
                                {error}
                            </p>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full bg-white/20 text-white rounded-lg px-4 py-2.5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                type="submit"
                                disabled={busy}
                                className="w-full py-2.5 rounded-lg font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 disabled:opacity-50"
                            >
                                {busy ? "Sending..." : "Send reset link"}
                            </button>
                        </form>

                        <div className="text-center mt-5">
                            <Link to="/login" className="text-gray-400 hover:text-gray-200 text-sm">
                                Back to sign in
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}