import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const copySdk = viteStaticCopy({
  targets: ['core', 'barcode'].map((module) => ({
    src: `./node_modules/@scandit/web-datacapture-${module}/sdc-lib/*`,
    dest: './sdc-lib',
  })),
});

export default defineConfig({ plugins: [react(), copySdk] });
