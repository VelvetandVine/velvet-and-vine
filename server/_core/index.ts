import express from "express";
import cookieParser from "cookie-parser";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { getDb } from "../db";

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// OAuth callback
app.get("/api/oauth/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.status(400).json({ error: "Missing code or state" });
    }

    // Parse state to get origin and return path
    let returnPath = "/";
    try {
      const decodedState = JSON.parse(Buffer.from(state as string, "base64").toString());
      returnPath = decodedState.returnPath || "/";
    } catch (e) {
      // Use default return path
    }

    // TODO: Exchange code for token with Manus OAuth server
    // For now, just redirect to home
    res.redirect(returnPath);
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).json({ error: "OAuth callback failed" });
  }
});

// tRPC handler
app.all("/api/trpc/:path*", async (req, res) => {
  const url = new URL(`http://localhost${req.url}`);
  
  try {
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: new Request(url, {
        method: req.method,
        headers: Object.entries(req.headers).reduce((acc, [key, value]) => {
          if (typeof value === "string") {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, string>),
        body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
      }),
      router: appRouter,
      createContext: async () => {
        return createContext({ req, res });
      },
    });

    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    res.end(await response.text());
  } catch (error) {
    console.error("tRPC error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Vite dev server integration
if (process.env.NODE_ENV === "development") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
  });
  app.use(vite.middlewares);
}

// Serve static files
app.use(express.static("client/dist"));

// SPA fallback
app.get("*", (_req, res) => {
  res.sendFile("client/dist/index.html", { root: process.cwd() });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}/`);
  
  // Test database connection
  const db = await getDb();
  if (db) {
    console.log("✓ Database connected");
  } else {
    console.warn("⚠ Database connection failed - using in-memory mode");
  }
});
