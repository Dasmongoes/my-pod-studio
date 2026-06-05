// Vercel serverless function entry point.
// Vercel's @vercel/node runtime detects an Express app as the default export
// and wraps it automatically — no manual req/res adapter needed.
import app from "../artifacts/api-server/src/app";

export default app;
