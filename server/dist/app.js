"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
// Configurations de Middlewares
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const constants_1 = require("./core/constants");
const env_var_1 = require("env-var");
const env_1 = require("./core/config/env");
const route_1 = __importDefault(require("./routes/route"));
const cors_1 = __importDefault(require("cors"));
// Créer un stream pour Morgan avec niveau HTTP spécifique
const morganStream = {
    write: (message) => {
        (0, env_var_1.logger)('http', message.trim()); // Utilise le format correct pour le logger
    }
};
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_rate_limit_1.default)({
    max: constants_1.ONE_HUNDRED,
    windowMs: constants_1.SIXTY,
    message: 'Trop de Requete à partir de cette adresse IP '
}));
app.use((0, morgan_1.default)('combined', {
    stream: morganStream
}));
const corsOptions = {
    origin: env_1.envs.CORS_ORIGIN || '*', // Autoriser toutes les origines en développement ou restreindre en production
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers autorisés
    credentials: true, // Autoriser les cookies et autres informations d'authentification
};
app.use((0, cors_1.default)(corsOptions));
app.use("/api/users", route_1.default);
app.listen(env_1.envs.PORT, () => {
    console.log(`Server running on port http://localhost:${env_1.envs.PORT}/`);
    console.log(`Documentation  : http://localhost:${env_1.envs.PORT}/api-docs`);
});
//# sourceMappingURL=app.js.map