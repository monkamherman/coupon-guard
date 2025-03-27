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


app.use(cors({
  origin: '*'
}));


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://coupon-guard-org.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.options('*', (req, res) => res.sendStatus(200));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));



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



const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Ajoutez ce contrôle d'erreur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
}).on('error', (err) => {
  console.error('Erreur de démarrage:', err.message);
  process.exit(1);
});

