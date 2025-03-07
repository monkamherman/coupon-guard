// src/server.ts
import express from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import cors from 'cors';
import { ONE_HUNDRED, SIXTY } from './core/constants';
import { logger } from 'env-var';
import user from './routes/route';


import helmet from 'helmet';



const morganStream = {
  write: (message: string) => {
    logger('http', message.trim());
  }
};

const app = express();

// Configuration CORS dynamique
const allowedOrigins = [
  // 'http://localhost:5173', // Développement local
  'https://coupon-guard.vercel.app', // Production frontend
  'https://coupon-guard.onrender.com' // Backup
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    console.log('origin recived',origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With','accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares critiques en premier
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
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

app.get('/keep-alive', (req, res) => res.send('OK'))

// Rate limiting (après les routes critiques)
const limiter = rateLimit({
  windowMs: SIXTY * 1000,
  max: ONE_HUNDRED,
  message: 'Trop de requêtes depuis cette adresse IP',
  skip: (req) => req.path === '/health'
});

app.use(limiter);

// Logging
app.use(morgan('combined', { stream: morganStream }));

app.use(express.static('public'));

// Route racine modifiée
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use("/", user); // Préfixe plus clair

// Gestion des erreurs CORS
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.message.includes('CORS')) {
    res.status(403).json({ error: err.message });
  } else {
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

