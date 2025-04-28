import { AttachmentBuilder, EmbedBuilder, WebhookClient } from "discord.js";
import { DISCORD_WEBHOOK_ID, DISCORD_WEBHOOK_TOKEN } from "astro:env/server";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

import { fetchContainerInfos } from "../services/fetchContainerInfos";
import { containerInfosCache } from "../cache/containerInfos";

export const sendReport = defineAction({
    accept: "form",
    input: z.object({
        reportType: z.enum(["filled", "degraded", "both"]),
        containerRef: z.string(),
        // picture: z.object({
        //     name: z.string(),
        //     type: z.string().refine(
        //         (type) => type.startsWith('image/'),
        //     { message: "Le fichier doit être une image." }
        //     ),
        //     size: z.number().max(5 * 1024 * 1024, { message: "La taille de l'image ne doit pas dépasser 5 Mo." }), // Exemple de limite de taille
        // })
    }),
    handler: async ({ containerRef, reportType, picture }, ctx) => {
        try {
            const isContainerInfosCached = containerInfosCache.getContainerInfosCached(containerRef)
            
            if(!isContainerInfosCached) {
                const containerInfos = await fetchContainerInfos(ctx.url.origin)(containerRef)

                if (!containerInfos.success) throw containerInfos.error
                if (containerInfos.success) containerInfosCache.cacheContainerInfos(containerRef, containerInfos.data)
            }

            const containerInfos = containerInfosCache.getContainerInfosCached(containerRef)
            if (!containerInfos) throw new Error('Something went wrong in cache')
            
            // Do something with the data
        
            const webhookClient = new WebhookClient({ id: DISCORD_WEBHOOK_ID, token: DISCORD_WEBHOOK_TOKEN });
        
            const tata: File = picture
            // const popo= await tata.arrayBuffer()
            // const attachment = new AttachmentBuilder(Buffer.from(popo))
            const embed = new EmbedBuilder()
                .setTitle('Tisseco | Signalement')
                .setColor(0x00FFFF)
                .setDescription("Signalement sur un point d'apport volontaire")
                
            if (reportType && containerRef) {
                embed.addFields(
                    { name: 'Référence', value: containerRef },
                    { name: 'Type de signalement', value: reportType },
                    { name: 'Ville', value: containerInfos.city }
                )
            }
      
            //   webhookClient.send({
            //     username: 'Tisseco Bot',
            //     avatarURL: 'https://i.imgur.com/AfFp7pu.png',
            //     embeds: [embed],
            //     files: [attachment]
            //   });
      
            // fetch(`${Astro.url.origin}/api/send-report`, {
            //   method: 'POST',
            //   body: JSON.stringify({ containerRef, reportType }),
            //   headers: {
            //       "Content-Type": "application/json"
            //   }
            // })
      
            return {
                succes: false,
                status: 400,
                error: "Email is required."
            };
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        }
    }
})