import jwt from 'jsonwebtoken';
import {
  getAdminJwtSecret,
  getAdminPassword,
  getAdminUsername,
} from './config';

const ADMIN_COOKIE_NAME = 'admin_token';
const ADMIN_JWT_EXPIRATION = '6h';

type AdminJwtPayload = {
  username: string;
  iat: number;
  exp: number;
};

export const adminCookieName = ADMIN_COOKIE_NAME;

export const validateAdminCredentials = (username: string, password: string) => {
  const expectedUsername = getAdminUsername();
  const expectedPassword = getAdminPassword();

  if (!expectedUsername || !expectedPassword) {
    return false;
  }

  return (
    username.trim() === expectedUsername.trim() &&
    password === expectedPassword
  );
};

const ensureJwtSecret = () => {
  const secret = getAdminJwtSecret();

  if (!secret) {
    throw new Error('Admin JWT secret is not configured.');
  }

  return secret;
};

export const createAdminToken = (username: string) => {
  const secret = ensureJwtSecret();
  return jwt.sign({ username }, secret, { expiresIn: ADMIN_JWT_EXPIRATION });
};

export const verifyAdminToken = (token: string): AdminJwtPayload | null => {
  const secret = ensureJwtSecret();

  try {
    return jwt.verify(token, secret) as AdminJwtPayload;
  } catch (error) {
    return null;
  }
};

const parseCookies = (cookieHeader: string | null) => {
  if (!cookieHeader) {
    return {} as Record<string, string>;
  }

  return cookieHeader.split(';').reduce((acc, cookie) => {
    const [name, ...rest] = cookie.split('=');
    if (!name) {
      return acc;
    }
    acc[name.trim()] = decodeURIComponent(rest.join('=').trim());
    return acc;
  }, {} as Record<string, string>);
};

export const extractAdminTokenFromRequest = (req: Request) => {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring('Bearer '.length);
  }

  const cookies = parseCookies(req.headers.get('cookie'));
  if (cookies[ADMIN_COOKIE_NAME]) {
    return cookies[ADMIN_COOKIE_NAME];
  }

  return null;
};

export const authenticateAdminRequest = (req: Request) => {
  const token = extractAdminTokenFromRequest(req);
  if (!token) {
    return null;
  }

  return verifyAdminToken(token);
};
