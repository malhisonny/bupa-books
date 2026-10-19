// DEV ONLY: serves mock/data.json at /api/v1/bookowners so you can work without the live API.
// Run with `npm run dev:mock`. To remove: delete this file, the mock/ folder and the dev:mock script.
import { mergeConfig, type Plugin } from 'vite';
import { readFileSync } from 'node:fs';
import baseConfig from './vite.config';

const mockApi: Plugin = {
  name: 'mock-book-owners-api',
  configureServer(server) {
    server.middlewares.use('/api/v1/bookowners', (_req, res) => {
      // Read on every request so edits to mock/data.json show up on refresh.
      const body = readFileSync(new URL('./mock/data.json', import.meta.url), 'utf8');
      res.setHeader('Content-Type', 'application/json');
      res.end(body);
    });
  },
};

export default mergeConfig(baseConfig, { plugins: [mockApi] });
