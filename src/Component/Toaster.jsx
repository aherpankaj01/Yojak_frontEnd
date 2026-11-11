import { useEffect, useState } from "react";
import { subscribe } from "../utils/toast";

export default function Toaster() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const unsubscribe = subscribe((toast) => {
            setToasts((prev) => [...prev, toast]);
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== toast.id));
            }, 5000);
        });
        return unsubscribe;
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    role="alert"
                    className="bg-red-600 text-white text-sm px-4 py-3 rounded-lg shadow-lg"
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );
}