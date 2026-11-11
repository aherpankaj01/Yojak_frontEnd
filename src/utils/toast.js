const listeners = new Set();
let last = { message: "", time: 0 };

export function subscribe(listener) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export function showError(message) {
    const now = Date.now();

    if (message === last.message && now - last.time < 3000) return;
    last = { message, time: now };

    listeners.forEach((listener) =>
        listener({ id: now + Math.random(), message })
    );
}