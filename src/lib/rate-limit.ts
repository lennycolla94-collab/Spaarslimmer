/**
 * Rate Limiting voor API routes
 * Beschermt tegen brute force attacks en abuse
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (gebruik Redis in productie!)
const store: RateLimitStore = {};

interface RateLimitConfig {
  windowMs: number;  // Tijdvenster in milliseconden
  maxRequests: number; // Max aantal requests per venster
}

const defaultConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minuten
  maxRequests: 100, // 100 requests per 15 min
};

// Specifieke limieten per endpoint
export const rateLimitConfigs = {
  login: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 login pogingen per 15 min
  api: { windowMs: 60 * 1000, maxRequests: 60 }, // 60 requests per minuut
  leads: { windowMs: 60 * 1000, maxRequests: 30 }, // 30 lead operaties per minuut
  export: { windowMs: 60 * 60 * 1000, maxRequests: 10 }, // 10 exports per uur
};

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = defaultConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;
  
  // Oude entries opruimen
  if (store[key] && store[key].resetTime < now) {
    delete store[key];
  }
  
  // Nieuwe entry of bestaande updaten
  if (!store[key]) {
    store[key] = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: store[key].resetTime,
    };
  }
  
  // Check limiet
  if (store[key].count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: store[key].resetTime,
    };
  }
  
  // Increment counter
  store[key].count++;
  
  return {
    allowed: true,
    remaining: config.maxRequests - store[key].count,
    resetTime: store[key].resetTime,
  };
}

// Helper voor IP-based rate limiting
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// Express-style middleware voor Next.js API routes
export async function rateLimitMiddleware(
  request: Request,
  config: RateLimitConfig = defaultConfig
): Promise<{ allowed: boolean; headers: Record<string, string> }> {
  const ip = getClientIP(request);
  const path = new URL(request.url).pathname;
  const identifier = `${ip}:${path}`;
  
  const result = rateLimit(identifier, config);
  
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': Math.max(0, result.remaining).toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  };
  
  if (!result.allowed) {
    headers['Retry-After'] = Math.ceil((result.resetTime - Date.now()) / 1000).toString();
  }
  
  return { allowed: result.allowed, headers };
}
