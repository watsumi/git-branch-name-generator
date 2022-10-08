import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx, defineManifest } from '@crxjs/vite-plugin';

const manifest = defineManifest({
  manifest_version: 3,
  name: 'git-branch-name-generator',
  description:
    'An extension that generate git branch name from the GitHub issue page.',
  version: '1.0.0',
  icons: {
    '16': 'icon.png',
    '48': 'icon.png',
    '128': 'icon.png',
  },
  permissions: [
    "tabs"
  ],
  host_permissions: [
    "https://developer.chrome.com/*"
  ],
  action: {
    default_popup: 'index.html',
  },
  commands: {
    _execute_action: {
      suggested_key: {
        default: "Ctrl+Shift+L",
      },
    },
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
});
