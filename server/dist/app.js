"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const constants_1 = require("./core/constants");
const env_var_1 = require("env-var");
const route_1 = __importDefault(require("./routes/route"));
const helmet_1 = __importDefault(require("helmet"));
const morganStream = {
    write: (message) => {
        (0, env_var_1.logger)('http', message.trim());
    }
};
const app = (0, express_1.default)();
// Configuration CORS dynamique
const allowedOrigins = [
    // 'http://localhost:5173', // Développement local
    'https://coupon-guard.vercel.app', // Production frontend
    'https://coupon-guard.onrender.com' // Backup
];
const corsOptions = {
    origin: (origin, callback) => {
        console.log('origin recived', origin);
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Blocked by CORS policy'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'accept'],
    credentials: true,
    optionsSuccessStatus: 200
};
// Middlewares critiques en premier
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // Désactiver temporairement pour tests
    hsts: {
        maxAge: 63072000,
        includeSubDomains: true,
        preload: true
    }
}));
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        version: '1.0.0'
    });
});
app.get('/keep-alive', (req, res) => res.send('OK'));
// Rate limiting (après les routes critiques)
const limiter = (0, express_rate_limit_1.default)({
    windowMs: constants_1.SIXTY * 1000,
    max: constants_1.ONE_HUNDRED,
    message: 'Trop de requêtes depuis cette adresse IP',
    skip: (req) => req.path === '/health'
});
app.use(limiter);
// Logging
app.use((0, morgan_1.default)('combined', { stream: morganStream }));
app.use(express_1.default.static('public'));
// Route racine modifiée
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'online',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});
app.use("/", route_1.default); // Préfixe plus clair
// Gestion des erreurs CORS
app.use((err, req, res, next) => {
    if (err.message.includes('CORS')) {
        res.status(403).json({ error: err.message });
    }
    else {
        next(err);
    }
});
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 10000;
// Ajoutez ce contrôle d'erreur
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
}).on('error', (err) => {
    console.error('Erreur de démarrage:', err.message);
    process.exit(1);
});
//# sourceMappingURL=app.js.map