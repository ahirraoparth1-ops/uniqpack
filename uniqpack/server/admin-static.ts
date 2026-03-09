import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveAdminStatic(app: Express) {
  const distPath = path.resolve(__dirname, "..", "dist", "admin", "public");
  if (!fs.existsSync(distPath)) {
    console.warn(`Admin build directory not found at ${distPath}, skipping admin static serving.`);
    return;
  }

  app.use("/admin", express.static(distPath));

  // fall through to admin index.html for /admin routes
  app.use("/admin/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
