/**
 * Role helpers that handle every shape the backend might send:
 *   - plain string:   "ROLE_ADMIN"
 *   - Spring object:  { authority: "ROLE_ADMIN" }
 *   - custom object:  { roleName: "ROLE_ADMIN" } or { name: "ROLE_ADMIN" }
 */
const matchesRole = (r, role) =>
    r === role ||
    r?.authority === role ||
    r?.roleName === role ||
    r?.name === role;

export const checkIsAdmin = (user) =>
    user?.roles?.some((r) => matchesRole(r, "ROLE_ADMIN")) ?? false;

export const checkIsSeller = (user) =>
    user?.roles?.some((r) => matchesRole(r, "ROLE_SELLER")) ?? false;
