import type { RequestHandler } from "express";

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return header.split(";").reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rawVal] = part.trim().split("=");
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rawVal.join("=") || "");
    return acc;
  }, {});
}

export function adminAuth(): RequestHandler {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  return (req, res, next) => {
    if (!user || !pass) {
      return res
        .status(503)
        .send("Admin auth is not configured. Set ADMIN_USER and ADMIN_PASSWORD.");
    }

    // Allow the login/logout pages without auth.
    if (req.path === "/login" || req.path === "/logout") return next();

    const cookieHeader = req.headers.cookie;
    if (typeof cookieHeader === "string" && cookieHeader.includes("admin_auth=1"))
      return next();

    // Fallback parse (handles cases where cookie header formatting differs)
    const cookies = parseCookies(typeof cookieHeader === "string" ? cookieHeader : undefined);
    if (cookies.admin_auth === "1") return next();

    // Redirect to a nicer login UI instead of browser basic-auth prompt.
    return res.redirect(302, "/admin/login");
  };
}

