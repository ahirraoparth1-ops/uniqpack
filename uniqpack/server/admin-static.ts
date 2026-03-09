import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveAdminStatic(app: Express) {
  const distPath = path.resolve(__dirname, "..", "dist", "admin", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the admin build directory: ${distPath}, make sure to build the admin client first`,
    );
  }

  app.use("/admin", express.static(distPath));

  // fall through to admin index.html for /admin routes
  app.use("/admin/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

