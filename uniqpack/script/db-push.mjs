import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { spawn } from "node:child_process";

// Load .env
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env");

try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const equalIndex = trimmed.indexOf("=");
      const key = trimmed.substring(0, equalIndex).trim();
      const value = trimmed.substring(equalIndex + 1).trim();
      if (key) {
        process.env[key] = value;
      }
    }
  }
} catch (err) {
  console.error("Warning: Could not load .env file:", err.message);
}

// Run drizzle-kit
const drizzleKit = spawn("npx", ["drizzle-kit", "push"], {
  stdio: "inherit",
  shell: true,
});

drizzleKit.on("close", (code) => {
  process.exit(code || 0);
});
