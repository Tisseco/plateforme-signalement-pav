import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    console.log("🚀 ~ constPOST:APIRoute= ~ request:", request)
    const body = await request.json()
    console.log("🚀 ~ request.body:", body)

    return new Response(
        JSON.stringify({
            message: 'ok'
        }),
    );
};
