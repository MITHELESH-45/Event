/**
 * Backend API base URL (no trailing slash).
 * - Local: http://localhost:5000
 * - Production: Set NEXT_PUBLIC_API_URL in Vercel (e.g. https://your-backend.onrender.com)
 */
const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const API_URL = raw.replace(/\/+$/, '');
