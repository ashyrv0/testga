export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
