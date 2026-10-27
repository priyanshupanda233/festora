import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_festive_diwali_glow_default_secure_key_123';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_RAW = process.env.ADMIN_PASSWORD || 'diwaliglow2024';

// Hash admin password on start for secure comparison
let adminPasswordHash = null;
try {
  adminPasswordHash = bcrypt.hashSync(ADMIN_PASSWORD_RAW, 10);
} catch (e) {
  console.error('Error generating initial password hash:', e);
}

export function verifyCredentials(username, password) {
  if (!username || !password) return false;
  if (username !== ADMIN_USERNAME) return false;

  if (adminPasswordHash) {
    return bcrypt.compareSync(password, adminPasswordHash);
  }
  return password === ADMIN_PASSWORD_RAW;
}

export function generateToken(payload = { role: 'admin', username: ADMIN_USERNAME }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized: Authentication token is required for administrative operations.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges.' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized: Invalid or expired session token. Please log in again.'
    });
  }
}
