// @ts-check
import { defineConfig, envField } from 'astro/config';
import netlify from '@astrojs/netlify';
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify(),

  env: {
    schema: {
      DISCORD_WEBHOOK_ID: envField.string({ context: "server", access: "secret" }),
      DISCORD_WEBHOOK_TOKEN: envField.string({ context: "server", access: "secret" })
    }
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()]
});