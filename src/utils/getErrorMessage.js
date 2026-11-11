const STATUS_MESSAGES = {
    400: "That request wasn't valid. Please check what you entered.",
    401: "Please log in to continue.",
    403: "You don't have permission to do that.",
    404: "We couldn't find what you were looking for.",
    405: "That action isn't supported.",
    409: "That already exists.",
    413: "That file is too large.",
    429: "Too many requests. Please wait a moment and try again.",
    500: "Something went wrong on our side. Please try again.",
    502: "The server is temporarily unavailable. Please try again shortly.",
    503: "The server is temporarily unavailable. Please try again shortly.",
    504: "The server took too long to respond. Please try again.",
};

export default function getErrorMessage(error) {
    if (!error || !error.response) {
        if (error && error.code === "ECONNABORTED") {
            return "The server took too long to respond. Please try again.";
        }
        return "Can't reach the server. It may be waking up, which can take up to a minute. Please try again.";
    }

    const { status, data } = error.response;

    if (data && typeof data.message === "string" && data.message.trim()) {
        return data.message;
    }

    return STATUS_MESSAGES[status] || `Something went wrong (error ${status}).`;
}