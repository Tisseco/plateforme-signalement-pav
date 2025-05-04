import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { RESEND_API_KEY } from "astro:env/server";
import { Resend } from "resend";
import sanitizeHtml from 'sanitize-html';

const resend = new Resend(RESEND_API_KEY);

export const contactUs = defineAction({
    accept: "form",
    handler: async (formData, ctx) => {
        try {
            const payload = {
                firstName: formData.get("firstName"),
                lastName: formData.get("lastName"),
                email: formData.get("email"),
                phoneNumber: formData.get("phoneNumber"),
                message: formData.get("message"),
                agreePolicy: formData.get("agreePolicy"),
            }

            const schema = z.object({
                firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères." }),
                lastName: z.string().optional(),
                email: z.string().email({ message: "L'adresse email n'est pas valide." }),
                phoneNumber: z.string().regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, { message: "Le numéro de téléphone n'est pas valide." }),
                message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères." }),
                agreePolicy: z.string({ message: "Vous devez accepter notre politique de confidentialité si vous souhaitez nous contacter." })
            })
    
            const result = schema.safeParse(payload);
        
            if (!result.success) {
                return {
                    success: false,
                    errors: result.error.flatten().fieldErrors,
                    values: {
                        firstName: formData.get("firstName")?.toString(),
                        lastName: formData.get("lastName")?.toString() || "",
                        email: formData.get("email")?.toString(),
                        phoneNumber: formData.get("phoneNumber")?.toString(),
                        message: formData.get("message")?.toString(),
                        agreePolicy: formData.get("agreePolicy")?.toString() || "",
                    }
                };
            }

            const firstName = sanitizeHtml(result.data.firstName)
            const lastName = sanitizeHtml(result.data.lastName || "")
            const email = sanitizeHtml(result.data.email)
            const phoneNumber = sanitizeHtml(result.data.phoneNumber)
            const message = sanitizeHtml(result.data.message)

            const { error } = await resend.emails.send({
                from: "Acme <onboarding@resend.dev>",
                to: ["fverin.contactpro@gmail.com"],
                subject: `Plateforme de signalement - Formulaire de contact`,
                html: `
                    <div>
                        <p>Bonjour,</p>
                        <p>Vous avez reçu un nouveau message via le formulaire de contact de votre site :</p>
                        <ul>
                            <li><strong>Prénom:</strong> ${firstName}</li>
                            <li><strong>Nom:</strong> ${lastName}</li>
                            <li><strong>Email:</strong> ${email}</li>
                            <li><strong>Téléphone:</strong> ${phoneNumber}</li>
                        </ul>
                        <p><strong>Message:</strong></p>
                        <p>${message}</p>
                    </div>
                `,
              });
        
              if (error) {
                throw new ActionError({
                  code: "BAD_REQUEST",
                  message: error.message,
                });
              }
             
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        }
    }
})
