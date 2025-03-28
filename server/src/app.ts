// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import user from './routes/route';

const app = express();

// 1. Middleware de sécurité de base
app.use(helmet());

// 2. Configuration CORS complète
app.use(cors({
  origin: '*', // Autorise toutes les origines
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: [
    'Content-Length',
    'X-Powered-By',
    'Content-Type',
    'Date',
    'ETag'
  ],
  credentials: false, // À mettre à true si vous utilisez des cookies/sessions
  maxAge: 86400, // Cache les options CORS pendant 24h
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// 3. Middleware pour les requêtes JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Logging des requêtes
app.use(morgan('dev'));

// 5. Gestion explicite des OPTIONS
app.options('*', cors());

// 6. Route de santé
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// 7. Middleware de logs des origines
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Requête ${req.method} depuis ${req.headers.origin || 'origine inconnue'}`);
  next();
});

// 8. Gestion des erreurs globale
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});
app.use('/', user)

// 9. Démarrage du serveur
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Ajoutez ce contrôle d'erreur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur le port http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Erreur de démarrage:', err.message);
  process.exit(1);
});