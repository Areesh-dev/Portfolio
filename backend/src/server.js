import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// ── Render ke peeche hai — trust the first proxy ──
// Bina iske rate limiting sahi kaam nahi karegi (sab users ek IP pe count honge)
app.set('trust proxy', 1);

// ── Security headers ──
app.use(helmet());

// ── CORS ──
// Support multiple origins (dev + prod) comma-separated
const allowedOrigins = env.corsOrigin
  ? env.corsOrigin.split(',').map((o) => o.trim())
  : true;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ── Body parsers ──
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ── Rate limiting ──
app.use(apiLimiter);

// ── Health check ──
app.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// ── API routes ──
app.use('/api', apiRouter);

// ── 404 + error handlers (always last) ──
app.use(notFoundHandler);
app.use(errorHandler);

// ── Start server ──
const server = app.listen(env.port, '0.0.0.0', () => {
  console.log(`API listening on port ${env.port}`);
});

// ── Graceful shutdown (Render sends SIGTERM on redeploy) ──
const shutdown = (signal) => {
  console.log(`${signal} received, shutting down gracefully…`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
  // Force exit if not closed in 10s
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
