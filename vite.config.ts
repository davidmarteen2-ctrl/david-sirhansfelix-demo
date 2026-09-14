import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env = { ...process.env, ...env };

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'lead-api-middleware',
        configureServer(server) {
          server.middlewares.use('/api/leads', async (req, res) => {
            if (req.method === 'POST') {
              let raw = '';
              for await (const chunk of req) {
                raw += chunk;
              }
              let body = {};
              try {
                body = raw ? JSON.parse(raw) : {};
              } catch {
                // Ignore parse errors
              }
              try {
                const { default: handler } = await server.ssrLoadModule('./api/leads.ts');
                (req as any).body = body;
                await handler(req, res);
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: false, error: err?.message || 'Server error' }));
              }
            } else {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: false, error: 'Method not allowed.' }));
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
