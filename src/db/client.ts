import { createClient } from '@libsql/client';

const url = import.meta.env.VITE_DATABASE_URL || 'file:local.db';
const authToken = import.meta.env.VITE_DATABASE_AUTH_TOKEN;

export const db = createClient({
  url,
  authToken,
});