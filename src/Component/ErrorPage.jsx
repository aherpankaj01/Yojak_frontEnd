
import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Home, ArrowLeft, FileQuestion, AlertTriangle } from "lucide-react";

function ErrorPage() {
    const error = useRouteError();

    const status = isRouteErrorResponse(error)
        ? error.status
        : 500;

    const errorDetails = {
        404: {
            title: "Page Not Found",
            description:
                "Looks like this page has gone missing. The article or page you're looking for may have been moved or deleted.",
            label: "PAGE NOT FOUND",
        },
        403: {
            title: "Access Denied",
            description:
                "You don't have permission to access this page. Please check your account and try again.",
            label: "ACCESS DENIED",
        },
        500: {
            title: "Something Went Wrong",
            description:
                "An unexpected error occurred. Don't worry, let's get you back on track.",
            label: "SERVER ERROR",
        },
    };

    const currentError = errorDetails[status] || errorDetails[500];

    return (
        <div className="min-h-screen flex items-center justify-center px-5 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="max-w-2xl w-full text-center">
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full"></div>

                        <div className="relative w-24 h-24 rounded-3xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center">
                            {status === 500 ? (
                                <AlertTriangle size={44} className="text-indigo-400" />
                            ) : (
                                <FileQuestion size={44} className="text-indigo-400" />
                            )}
                        </div>
                    </div>
                </div>

                <p className="text-indigo-400 font-semibold tracking-[0.3em] text-sm mb-4">
                    {currentError.label}
                </p>

                <h1 className="text-8xl sm:text-9xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    {status}
                </h1>

                <h2 className="text-2xl sm:text-3xl font-bold mt-5 mb-4">
                    {currentError.title}
                </h2>

                <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
                    {currentError.description}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                    <Link
                        to="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-1"
                    >
                        <Home size={19} />
                        Back to Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-gray-700 hover:bg-gray-800 text-gray-200 font-semibold transition-all duration-300"
                    >
                        <ArrowLeft size={19} />
                        Go Back
                    </button>
                </div>

                <div className="mt-16 pt-6 border-t border-gray-700/60">
                    <p className="text-gray-500 text-sm">
                        Lost your way? Let's get you back to
                        <span className="text-indigo-400 font-semibold">
                            {" "}Yojak.
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ErrorPage;
