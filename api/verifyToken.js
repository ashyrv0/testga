import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get token from cookies
  const cookies = req.headers.cookie || '';
  const tokenMatch = cookies.match(/accessToken=([^;]*)/);
  const token = tokenMatch ? tokenMatch[1] : null;

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
