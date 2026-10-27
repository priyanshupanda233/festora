import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_festive_diwali_glow_default_secure_key_123';
export function getAdminUsername() {
  return process.env.ADMIN_USERNAME || 'nrusingha40690';
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || 'nrusingha';
}

export function verifyCredentials(username, password) {
  if (!username || !password) return false;
  const currentUsername = getAdminUsername();
  const currentPassword = getAdminPassword();

  if (username.trim() !== currentUsername.trim()) return false;

  // Compare directly or with bcrypt
  return password === currentPassword;
}

export function generateToken(payload = { role: 'admin', username: getAdminUsername() }) {
  const secret = process.env.JWT_SECRET || 'dev_secret_festive_diwali_glow_default_secure_key_123';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
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
