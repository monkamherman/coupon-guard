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
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
.split(',')
.map((origin) => origin.trim()) // Supprime les espaces inutiles
.filter((origin) => origin !== ''); // Supprime les chaînes vides;
const CORS_ORIGIN = (process.env.CORS_ORIGIN)

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    console.log('origin received:', origin);

    // Ajout d'un fallback pour localhost en développement
if (process.env.NODE_ENV === 'development') {
  allowedOrigins.push('http://localhost:5173');
}
    // Normalise l'origine reçue en supprimant le trailing slash
    const normalizedOrigin = origin?.replace(/\/$/, '');

    if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true); // Autorise l'origine
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Blocked by CORS policy')); // Bloque l'origine
    }
    console.log('Allowed origins:', allowedOrigins);
// console.log('Normalized origin:', normalizedOrigin);
  },
  // origin: CORS_ORIGIN, // Autorise toutes les origines
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'accept'],
  credentials: true,
  optionsSuccessStatus: 200,
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

