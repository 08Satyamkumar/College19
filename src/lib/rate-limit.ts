// Sliding window in-memory rate limiter with automatic memory cleanup

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

const CLEANUP_INTERVAL = 5 * 60 * 1000; // Clean every 5 mins
let lastCleanup = Date.now();

function cleanupExpired(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, record] of rateLimitStore.entries()) {
    const validTimestamps = record.timestamps.filter((t) => now - t < windowMs);
    if (validTimestamps.length === 0) {
      rateLimitStore.delete(key);
    } else {
      record.timestamps = validTimestamps;
    }
  }
}

/**
 * Checks if a key (IP or identifier) has exceeded the max allowed requests within windowMs.
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 20,
  windowMs: number = 5 * 60 * 1000
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  cleanupExpired(windowMs);

  const now = Date.now();
  const record = rateLimitStore.get(key) || { timestamps: [] };

  // Filter timestamps strictly inside the current sliding window
  const activeTimestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (activeTimestamps.length >= maxRequests) {
    const oldest = activeTimestamps[0];
    const resetInSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: Math.max(1, resetInSeconds),
    };
  }

  activeTimestamps.push(now);
  rateLimitStore.set(key, { timestamps: activeTimestamps });

  return {
    allowed: true,
    remaining: maxRequests - activeTimestamps.length,
    resetInSeconds: Math.ceil(windowMs / 1000),
  };
}

/**
 * Safely extracts client IP address from standard reverse-proxy headers (Vercel, Cloudflare, Nginx).
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  return "127.0.0.1";
}
