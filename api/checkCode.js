<<<<<<< HEAD
export default function handler(req, res) {
=======
// Simple in-memory rate limiter
const rateLimitMap = new Map();

// Configuration
const MAX_ATTEMPTS = 5; // Max attempts per IP
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const ATTEMPT_WINDOW = 5 * 60 * 1000; // 5 minute window for counting attempts

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || 
         req.headers['cf-connecting-ip'] ||
         req.socket.remoteAddress || 
         'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip);

  if (!clientData) {
    // First request from this IP
    rateLimitMap.set(ip, {
      attempts: 1,
      firstAttemptTime: now,
      lockedUntil: null
    });
    return { allowed: true, attemptsLeft: MAX_ATTEMPTS - 1 };
  }

  // Check if IP is currently locked out
  if (clientData.lockedUntil && now < clientData.lockedUntil) {
    const minutesLeft = Math.ceil((clientData.lockedUntil - now) / 1000 / 60);
    return { 
      allowed: false, 
      reason: `Too many attempts. Try again in ${minutesLeft} minutes.`
    };
  }

  // Check if attempt window has expired
  if (now - clientData.firstAttemptTime > ATTEMPT_WINDOW) {
    // Reset counter
    rateLimitMap.set(ip, {
      attempts: 1,
      firstAttemptTime: now,
      lockedUntil: null
    });
    return { allowed: true, attemptsLeft: MAX_ATTEMPTS - 1 };
  }

  // Still within the window, increment attempts
  clientData.attempts += 1;

  if (clientData.attempts > MAX_ATTEMPTS) {
    // Lock out this IP
    clientData.lockedUntil = now + LOCKOUT_DURATION;
    return { 
      allowed: false, 
      reason: `Too many attempts. Locked out for 15 minutes.`
    };
  }

  return { 
    allowed: true, 
    attemptsLeft: MAX_ATTEMPTS - clientData.attempts 
  };
}

export default function handler(req, res) {
  // Only allow POST requests
>>>>>>> 75293ec847d31ab02c9c83a320025f55d178e36e
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

<<<<<<< HEAD
  const { code } = req.body;
  const correctCode = "foidslayer911";

  // Basic rate limiting: check if IP has made too many requests
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  // Compare the codes
  if (code === correctCode) {
    return res.status(200).json({ valid: true });
  } else {
    return res.status(200).json({ valid: false });
  }
=======
  const clientIp = getClientIp(req);
  
  // Check rate limit first
  const rateLimitCheck = checkRateLimit(clientIp);
  if (!rateLimitCheck.allowed) {
    return res.status(429).json({ 
      valid: false, 
      error: rateLimitCheck.reason 
    });
  }

  // Validate request body
  const { code } = req.body;
  
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ 
      valid: false, 
      error: 'Invalid request' 
    });
  }

  // Trim and check code (case-sensitive)
  const trimmedCode = code.trim();
  const correctCode = "foidslayer911";

  // Simulate a small delay to prevent timing attacks
  const delay = Math.random() * 100; // 0-100ms random delay
  
  setTimeout(() => {
    // Use constant-time comparison to prevent timing attacks
    const isValid = constantTimeCompare(trimmedCode, correctCode);

    if (isValid) {
      // Clear attempts on successful login
      rateLimitMap.delete(clientIp);
      
      return res.status(200).json({ valid: true });
    } else {
      return res.status(200).json({ 
        valid: false,
        attemptsLeft: rateLimitCheck.attemptsLeft,
        warning: rateLimitCheck.attemptsLeft <= 2 ? 
          `${rateLimitCheck.attemptsLeft} attempts remaining before lockout` : null
      });
    }
  }, delay);
}

// Prevent timing attacks - compare strings in constant time
function constantTimeCompare(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
>>>>>>> 75293ec847d31ab02c9c83a320025f55d178e36e
}
