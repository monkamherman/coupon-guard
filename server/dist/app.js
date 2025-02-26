"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const constants_1 = require("./core/constants");
const env_var_1 = require("env-var");
const env_1 = require("./core/config/env");
const route_1 = __importDefault(require("./routes/route"));
const cors_1 = __importDefault(require("cors"));
const morganStream = {
    write: (message) => {
        (0, env_var_1.logger)('http', message.trim());
    }
};
const app = (0, express_1.default)();
// Middlewares de sécurité en premier
app.use((0, cors_1.default)({
    origin: env_1.envs.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_rate_limit_1.default)({
    max: constants_1.ONE_HUNDRED,
    windowMs: constants_1.SIXTY * 1000, // Correction: conversion en millisecondes
    message: 'Trop de requêtes depuis cette adresse IP'
}));
app.use((0, morgan_1.default)('combined', { stream: morganStream }));
// Endpoint de santé sécurisé
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});
// Endpoint /env sécurisé
app.get('/env', (req, res) => {
    if (process.env.NODE_ENV !== 'production') {
        // En développement seulement
        res.json({
            node_env: process.env.NODE_ENV,
            port: process.env.PORT,
            cors_origin: process.env.CORS_ORIGIN
        });
    }
    else {
        res.status(403).json({
            error: 'Accès interdit en production'
        });
    }
});
// Routes applicatives
app.use("/api/users", route_1.default);
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
});
//# sourceMappingURL=app.js.map