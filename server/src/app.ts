// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import user from './routes/route';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// 1. Middleware de sécurité de base
app.use(helmet());



// 3. Middleware pour les requêtes JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Logging des requêtes
app.use(morgan('dev'));


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

// 6. Route de santé
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite par IP
  standardHeaders: true, // Retourne les infos de limite dans `RateLimit-*`
  legacyHeaders: false, // Désactive `X-RateLimit-*`
 
});

app.use('/api', createProxyMiddleware({
  target: 'https://coupon-guard.onrender.com',
  changeOrigin: true,
  pathRewrite: { '^/api': '' }, // Supprime le préfixe /api
  logLevel: 'debug'
}));


app.use(limiter);

app.set('trust proxy', 1);

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

app.use((req, res, next) => {
  req.setTimeout(120000); // 2 minutes timeout
  res.setTimeout(120000);
  next();
});


// 9. Démarrage du serveur
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Ajoutez ce contrôle d'erreur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur le port http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Erreur de démarrage:', err.message);
  process.exit(1);
});