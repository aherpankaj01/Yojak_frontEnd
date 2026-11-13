
import React, { useId, useState } from "react";

const Input = React.forwardRef(function Input(
    { label, type = "text", className = "", error, ...props },
    ref
) {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
        <div className="w-full flex flex-col gap-1.5 sm:gap-2">
            {label && (
                <label
                    htmlFor={id}
                    className="text-xs sm:text-sm font-medium text-gray-300"
                >
                    {label}
                </label>
            )}

            <div className="relative w-full">
                <input
                    id={id}
                    type={inputType}
                    ref={ref}
                    {...props}
                    className={`
            w-full
            px-3 sm:px-4 py-2.5
            ${isPassword ? "pr-12" : ""}
            text-sm sm:text-base
            rounded-lg
            bg-white/20 text-white
            placeholder-gray-300
            border border-white/20
            backdrop-blur-md
            outline-none
            transition-all duration-300

            focus:ring-2 focus:ring-indigo-500
            focus:bg-white/30

            ${error ? "border-red-400 focus:ring-red-500" : ""}

            ${className}
          `}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        onMouseDown={(e) => e.preventDefault()}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setShowPassword((prev) => !prev);
                            }
                        }}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                        className="
              absolute right-3 top-1/2 -translate-y-1/2
              flex items-center justify-center
              w-8 h-8 rounded-full
              text-gray-300
              hover:text-white
              hover:bg-white/10
              focus:outline-none focus:ring-2 focus:ring-indigo-400
              transition-all duration-200
            "
                    >
                        {showPassword ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="19"
                                height="19"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M3 3l18 18" />
                                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                                <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.3 4.5 9 7-.3 1.2-1.1 2.5-2.2 3.6" />
                                <path d="M6.2 6.2C4.1 7.5 2.6 9.7 2 12c.7 2.5 4 7 10 7 1 0 2-.2 2.9-.5" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="19"
                                height="19"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                )}
            </div>

            {error && (
                <span className="text-xs sm:text-sm text-red-400 mt-1">
          {error}
        </span>
            )}
        </div>
    );
});

export default Input;
