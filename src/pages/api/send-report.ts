import type { APIRoute } from "astro";
import { WebhookClient } from "discord.js";

import { DISCORD_WEBHOOK_ID, DISCORD_WEBHOOK_TOKEN } from "astro:env/server";

export const POST: APIRoute = async ({ request }) => {
    const secret = request.headers.get('x-action-secret');
    console.log("🚀 ~ constPOST:APIRoute= ~ secret:", secret)
    
    
    const origin = new URL(request.url).origin;
    const domain = new URL(request.url).hostname;
    if (origin && !origin.includes(domain)) return new Response('Invalid origin', { status: 403 });

    const body = await request.json()

    const webhookClient = new WebhookClient({ id: DISCORD_WEBHOOK_ID, token: DISCORD_WEBHOOK_TOKEN });

    return new Response(
        JSON.stringify({
            message: 'ok'
        }),
    );
};
