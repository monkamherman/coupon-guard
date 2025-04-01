import { Request, Response } from 'express';
import ejs from 'ejs';
import path from 'path';
import { HttpCode } from '../core/constants';
import sendMail from '../nodemailer/sendmail';
import { envs } from '../core/config/env';

interface Type {
    mount: number;
    recharge: string;
    devise: string;
    code1: string;
    code2?: string;
    code3?: string;
    code4?: string;
    code5?: string;
    email: string;
}

const userController = {
    sendMails: async (req: Request, res: Response, next: unknown) => {
        const { mount, recharge, devise, code1, code2, code3, code4, code5, email }: Type = req.body;

        if (!mount || !recharge || !devise || !code1 || !email) {
            return res.status(HttpCode.BAD_REQUEST).json({ msg: "Tous les champs sont obligatoires" });
        }

        const data = { mount, recharge, devise, code1, code2, code3, code4, code5, email };

        try {
            // Générer le contenu HTML des emails avec EJS
            const userEmailHtml = await ejs.renderFile(
                path.join(__dirname, '../utils/user_email.ejs'),
                data
            );
            const adminEmailHtml = await ejs.renderFile(
                path.join(__dirname, '../utils/admin_email.ejs'),
                data
            );
            

            // Envoi des emails
            await Promise.all([
                sendMail(envs.address_mail, `Nouvelle recharge client ${adminEmailHtml}`),
                sendMail(email, `Confirmation de votre recharge ${userEmailHtml}`)
            ]);

            return res.status(HttpCode.OK).json({ msg: "Emails envoyés avec succès" });

        } catch (error) {
            console.error(error);
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "Erreur interne du serveur" });
        }
    }
};

export default userController;
