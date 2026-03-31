import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACK_END_URL}/api`,
    withCredentials: true,
});

/**
 * Extracts the raw JWT from whatever shape is stored in localStorage.
 *
 * Handles two cases:
 *  1. Raw JWT  — "eyJhbGci..."  (already the token, return directly)
 *  2. Cookie string — "springBootEcom=eyJhbGci...; Path=/api; Max-Age=86400"
 *     (parse out the value between '=' and the first ';')
 */
function extractJwtFromCookieString(cookieStr) {
    if (!cookieStr || typeof cookieStr !== "string") return null;
    // Case 1: already a raw JWT
    if (cookieStr.startsWith("eyJ")) return cookieStr.trim();
    // Case 2: full cookie string
    const eqIdx = cookieStr.indexOf("=");
    if (eqIdx === -1) return null;
    const scIdx = cookieStr.indexOf(";", eqIdx);
    const token = scIdx !== -1
        ? cookieStr.slice(eqIdx + 1, scIdx)
        : cookieStr.slice(eqIdx + 1);
    return token.trim() || null;
}

/**
 * REQUEST INTERCEPTOR
 * Attaches the JWT as a Bearer Authorization header on every outgoing request.
 * This is more reliable than relying solely on the browser cookie mechanism,
 * especially during cross-origin requests between different localhost ports.
 */
api.interceptors.request.use(
    (config) => {
        try {
            const raw = localStorage.getItem("auth");
            if (raw) {
                const user = JSON.parse(raw);
                const token = extractJwtFromCookieString(user?.jwtToken);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (_) {
            // Silently ignore — request proceeds without the header
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * On 401 Unauthorized: show a session-expired message, clear stale auth
 * data, and redirect to the login page.
 *
 * A guard prevents multiple simultaneous 401 responses from triggering
 * multiple redirects.
 */
let isRedirectingToLogin = false;

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401 && !isRedirectingToLogin) {
            isRedirectingToLogin = true;

            // Clear all auth-related storage
            localStorage.removeItem("auth");
            localStorage.removeItem("cartItems");
            localStorage.removeItem("CHECKOUT_ADDRESS");
            localStorage.removeItem("client-secret");

            // Notify the user before redirecting
            toast.error("Session expired. Please log in again.", { duration: 3000 });

            // Give the toast time to appear before navigating
            setTimeout(() => {
                isRedirectingToLogin = false;
                if (!window.location.pathname.includes("/login")) {
                    window.location.href = "/login";
                }
            }, 1500);
        } else if (error?.response?.status === 403) {
            toast.error("Access Denied: you don't have permission to perform this action.", { duration: 4000 });
        }
        return Promise.reject(error);
    }
);

export default api;
