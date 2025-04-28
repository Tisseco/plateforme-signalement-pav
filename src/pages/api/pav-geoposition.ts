import type { APIRoute } from "astro";

export const GET: APIRoute = ({ request }) => {
    const url = new URL(request.url)
    const containerRef = url.searchParams.get('containerRef')

    // fetch container geoposition by his ref

    return new Response(
        JSON.stringify({
            coordinates: {
                latitude: 48.79299629655366,
                longitude: 2.649141057635186
            },
            city: 'Sucy-en-Brie'
        }),
    );
};
