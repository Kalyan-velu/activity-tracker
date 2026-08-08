import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { activitiesRouter } from "./routes/activities.js";

const app = new Hono();

// app.use(
//   '*',
//   slidingWindowRateLimiter({
//     windowMs: 60 * 1000,
//     limit: 30,
//     keyGenerator: (c) =>
//       c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? 'unknown',
//   }),
// );

app.use("*", logger());

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : [];

app.use("*", cors({ origin: corsOrigins }));
app.route("/api/activities", activitiesRouter);

const server = serve(
  {
    fetch: app.fetch,
    port: parseInt(process.env.PORT || "8000", 10),
  },
  (info) => {
    console.log(`Server running on http://localhost:${info.port}`);
    console.log(`Swagger UI at http://localhost:${info.port}/docs`);
  },
);

const shutdown = (signal: string) => {
  console.log(`${signal} received, shutting down`);
  if (schedulerTimer) clearInterval(schedulerTimer);
  server.close((err) => {
    if (err) console.error(err);
    pool.end(async () => {
      await redis.disconnect();
      process.exit(err ? 1 : 0);
    });
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => {
  shutdown("SIGTERM");
  setTimeout(() => process.exit(1), 10_000).unref();
});