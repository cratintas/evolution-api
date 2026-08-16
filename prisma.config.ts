import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const provider = process.env.DATABASE_PROVIDER === 'mysql' ? 'mysql' : 'postgresql';

export default defineConfig({
  schema: `prisma/${provider}-schema.prisma`,
  migrations: {
    path: `prisma/${provider}-migrations`,
  },
  datasource: {
    url: process.env.DATABASE_CONNECTION_URI ?? '',
  },
});
