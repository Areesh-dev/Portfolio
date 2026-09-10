import rateLimit from 'express-rate-limit';

// Helper to get a safe IP key that handles both IPv4 and IPv6
const ipKeyGenerator = (req) => {
  // Vercel sets x-forwarded-for; express `trust proxy` resolves req.ip
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  // For IPv6, mask to /64 to prevent bypass by rotating addresses
  if (ip.includes(':')) {
    return ip.split(':').slice(0, 4).join(':');
  }
  return ip;
};

// General API limiter — generous backstop
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: ipKeyGenerator,
  // Skip preflight requests so CORS doesn't eat the quota
  skip: (req) => req.method === 'OPTIONS',
});

// Tight limiter on the public contact form
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: ipKeyGenerator,
  skip: (req) => req.method === 'OPTIONS',
  message: { error: 'Too many messages sent. Please try again later.' },
});
