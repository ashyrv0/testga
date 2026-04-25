import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get token from cookies or request body
  const cookies = req.headers.cookie || '';
  const tokenMatch = cookies.match(/accessToken=([^;]*)/);
  let token = tokenMatch ? tokenMatch[1] : null;

  // If no cookie, check if token was sent in body (from localStorage)
  if (!token && req.body && req.body.token) {
    token = req.body.token;
  }

  if (!token) {
    return res.status(401).json({ valid: false });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ valid: true });
  } catch (error) {
    return res.status(401).json({ valid: false });
  }
}
