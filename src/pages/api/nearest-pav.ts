import type { APIRoute } from "astro";

const places = [
    {
        "id": 1,
        "name": "Bibliothèque François-Mitterrand",
        "address": "Quai François-Mauriac, 75013 Paris",
        "latitude": 48.8337,
        "longitude": 2.3757,
        "category": "Bibliothèque"
    },
    {
        "id": 2,
        "name": "Les Gobelins",
        "address": "Avenue des Gobelins, 75013 Paris",
        "latitude": 48.8355,
        "longitude": 2.3534,
        "category": "Quartier historique"
    },
    {
        "id": 3,
        "name": "Place d'Italie",
        "address": "Place d'Italie, 75013 Paris",
        "latitude": 48.8312,
        "longitude": 2.3559,
        "category": "Place publique"
    },
    {
        "id": 4,
        "name": "Parc de Choisy",
        "address": "128 Avenue de Choisy, 75013 Paris",
        "latitude": 48.8261,
        "longitude": 2.3658,
        "category": "Parc"
    },
    {
        "id": 5,
        "name": "Hôpital de la Pitié-Salpêtrière",
        "address": "47-83 Boulevard de l'Hôpital, 75013 Paris",
        "latitude": 48.8374,
        "longitude": 2.3619,
        "category": "Hôpital"
    }
]

export const GET: APIRoute = () => {
    return new Response(
        JSON.stringify(places),
    );
};
