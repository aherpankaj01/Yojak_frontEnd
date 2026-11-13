import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authService from "../../services/authService";
import { login } from "../../store/authSlice";

const messageOf = (err) =>
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong. Please try again.";

export default function VerifyEmail() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const initial = location.state;

    const [expiresAt, setExpiresAt] = useState(initial?.expiresAt || 0);
    const [resendAt, setResendAt] = useState(initial?.resendAt || 0);
    const [now, setNow] = useState(Date.now());
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    if (!initial?.email) {
        return <Navigate to="/signup" replace />;
    }

    const email = initial.email;
    const secondsLeft = Math.max(0, Math.ceil((expiresAt - now) / 1000));
    const resendIn = Math.max(0, Math.ceil((resendAt - now) / 1000));
    const expired = secondsLeft === 0;
    const timer = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`;

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");
        setInfo("");

        if (!/^\d{6}$/.test(otp)) {
            setError("Enter the 6-digit code.");
            return;
        }

        setBusy(true);
        try {
            await authService.verifyOtp({ email, otp });
            const userData = await authService.getCurrentUser();
            if (userData) dispatch(login(userData));
            navigate("/");
        } catch (err) {
            setError(messageOf(err));
        } finally {
            setBusy(false);
        }
    };

    const handleResend = async () => {
        setError("");
        setInfo("");
        setBusy(true);
        try {
            const res = await authService.resendOtp(email);
            const nextExpires = Date.now() + res.expiresInSeconds * 1000;
            const nextResend = Date.now() + res.resendAfterSeconds * 1000;
            setExpiresAt(nextExpires);
            setResendAt(nextResend);
            setOtp("");
            setInfo("A new code has been sent.");
            // keep the timers correct if the page is refreshed
            navigate(location.pathname, {
                replace: true,
                state: { email, expiresAt: nextExpires, resendAt: nextResend },
            });
        } catch (err) {
            setError(messageOf(err));
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
            <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8 text-white">
                <h2 className="text-2xl font-bold text-center mb-2">Verify your email</h2>
                <p className="text-center text-gray-300 text-sm mb-6">
                    We sent a 6-digit code to <span className="font-semibold">{email}</span>
                </p>

                {error && (
                    <p className="text-red-400 text-center text-sm mb-4 bg-red-500/10 py-2 rounded-lg">
                        {error}
                    </p>
                )}
                {info && (
                    <p className="text-green-400 text-center text-sm mb-4 bg-green-500/10 py-2 rounded-lg">
                        {info}
                    </p>
                )}

                <form onSubmit={handleVerify} className="space-y-4">
                    <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="••••••"
                        className="w-full text-center text-2xl tracking-[0.5em] bg-white/20 text-white rounded-lg py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    <p className={`text-center text-sm ${expired ? "text-red-400" : "text-gray-300"}`}>
                        {expired ? "This code has expired." : `Code expires in ${timer}`}
                    </p>

                    <button
                        type="submit"
                        disabled={busy || expired || otp.length !== 6}
                        className="w-full py-2.5 rounded-lg font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 disabled:opacity-50"
                    >
                        {busy ? "Please wait..." : "Verify and create account"}
                    </button>
                </form>

                <div className="text-center mt-5 text-sm">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={busy || resendIn > 0}
                        className="text-indigo-300 hover:text-indigo-200 disabled:text-gray-500"
                    >
                        {resendIn > 0 ? `Resend code in ${resendIn}s` : "Didn't get the code? Resend"}
                    </button>
                </div>

                <div className="text-center mt-3 text-sm">
                    <button
                        type="button"
                        onClick={() => navigate("/signup")}
                        className="text-gray-400 hover:text-gray-200"
                    >
                        Use a different email
                    </button>
                </div>
            </div>
        </div>
    );
}