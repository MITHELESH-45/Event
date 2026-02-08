/**
 * Backend API base URL.
 * - Local: http://localhost:5000
 * - Production: Set NEXT_PUBLIC_API_URL in Vercel (e.g. https://your-backend.railway.app)
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
