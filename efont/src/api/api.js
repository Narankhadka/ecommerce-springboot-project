import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACK_END_URL}/api`,
    withCredentials: true,
});

/**
 * Extracts the raw JWT value from the Set-Cookie string stored in localStorage.
 *
 * The backend stores the token as a full cookie string, e.g.:
 *   "springBootEcom=eyJhbGci...; Path=/api; Max-Age=86400; HttpOnly=false"
 *
 * We extract only the token portion (between '=' and the first ';').
 */
function extractJwtFromCookieString(cookieStr) {
    if (!cookieStr || typeof cookieStr !== "string") return null;
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
        }
        return Promise.reject(error);
    }
);

export default api;
