// src/server.ts
import express from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import cors from 'cors';
import { ONE_HUNDRED, SIXTY } from './core/constants';
import { logger } from 'env-var';
import user from './routes/route';
import { envs } from './core/config/env';


import helmet from 'helmet';



const morganStream = {
  write: (message: string) => {
    logger('http', message.trim());
  }
};

const app = express();

// // Configuration CORS dynamique
// const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
// .split(',')
// .map((origin) => origin.trim()) // Supprime les espaces inutiles
// .filter((origin) => origin !== ''); // Supprime les chaînes vides;
// const CORS_ORIGIN = (process.env.CORS_ORIGIN)


const corsOptions = {
  origin: 'https://coupon-guard-org.onrender.com',
  methods: ['POST', 'OPTIONS'], // Autoriser explicitement OPTIONS
  allowedHeaders: ['Content-Type', 'x-requested-with'],
  credentials: true
};



// Middlewares critiques en premier
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://trusted.cdn.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://trusted.cdn.com"],
      imgSrc: ["'self'", "data:", "https://trusted.cdn.com"],
      fontSrc: ["'self'", "https://trusted.cdn.com"],
      connectSrc: ["'self'", "https://api.trusted.com"],
    },
  },
  hsts: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: { action: 'deny' }, // Empêche le clickjacking
  hidePoweredBy: true,           // Masque l'en-tête X-Powered-By
  noSniff: true,                 // Empêche le sniffing MIME
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }, // Politique de référent
  xssFilter: true, 
}));

app.options('*', cors(corsOptions)); // Pré-traitement pour les requêtes OPTIONS

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

app.use((req, res, next) => {
  console.log(`Requête reçue depuis : ${req.headers.origin}`);
  next();
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

