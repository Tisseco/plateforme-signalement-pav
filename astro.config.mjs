// @ts-check
import { defineConfig, envField } from 'astro/config';
import netlify from '@astrojs/netlify';
import tailwindcss from "@tailwindcss/vite";
// import node from '@astrojs/node';
import react from "@astrojs/react";
import 'dotenv/config';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify(),
  // adapter: node({
  //   mode: 'standalone',
  // }),

  env: {
    schema: {
      X_ACTION_SECRET: envField.string({ context: "server", access: "secret" }),
      DISCORD_WEBHOOK_ID: envField.string({ context: "server", access: "secret" }),
      DISCORD_WEBHOOK_TOKEN: envField.string({ context: "server", access: "secret" }),
      RESEND_API_KEY: envField.string({ context: "server", access: "secret" }),
    }
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: true,
      cssMinify: true,
    },
  },

  integrations: [react()]
});
