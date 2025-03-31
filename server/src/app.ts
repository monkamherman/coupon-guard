// src/server.ts
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import user from './routes/route';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';

const app = express();

// 1. Middleware CORS corrigé
app.use((req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    'https://coupon-guard-svou.vercel.app', // Sans slash final
    'http://localhost:5173' // Pour le développement
  ];
  
  const origin = req.headers.origin as string;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// 2. Middlewares de base
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 3. Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// 4. Routes
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// 5. Route API corrigée (ajout du slash)
app.use('/api', user); // Maintenant avec le slash '/api'

// 6. Proxy
app.use('/external-api', createProxyMiddleware({
  target: 'https://coupon-guard-svou.vercel.app', // Sans slash final
  changeOrigin: true,
  pathRewrite: { '^/external-api': '' }
}));

// 7. Gestion des erreurs
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// 8. Démarrage
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});