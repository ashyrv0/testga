import jwt from 'jsonwebtoken';

const attempts = new Map();

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  const limit = 5;
  const window = 15 * 60 * 1000;

  if (!attempts.has(clientIp)) {
    attempts.set(clientIp, []);
  }

  const ipAttempts = attempts.get(clientIp).filter(time => now - time < window);

  if (ipAttempts.length >= limit) {
    return res.status(429).json({ error: 'Too many attempts' });
  }

  ipAttempts.push(now);
  attempts.set(clientIp, ipAttempts);

  const correctCode = process.env.ACCESS_CODE;

  if (!correctCode) {
    console.error('ACCESS_CODE not set');
    return res.status(500).json({ error: 'Server error' });
  }

  if (code === correctCode) {
    const token = jwt.sign(
      { access: 'granted', iat: Date.now() },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.setHeader('Set-Cookie', [
      `accessToken=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
    ]);

    return res.status(200).json({ valid: true, token });
  } else {
    return res.status(200).json({ valid: false });
  }
}
