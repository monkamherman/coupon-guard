// src/server.ts
import express from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { ONE_HUNDRED, SIXTY } from './core/constants';
import { logger } from 'env-var';
import { envs } from './core/config/env';
import user from './routes/route';
import cors from 'cors';

const morganStream = {
  write: (message: string) => {
    logger('http', message.trim());
  }
};

const app = express();

// Middlewares essentiels en premier
app.use(cors({
  origin: envs.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Health check IMMÉDIATEMENT après CORS
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Middlewares standards
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting après les routes critiques
app.use(rateLimit({
  max: ONE_HUNDRED,
  windowMs: SIXTY * 1000,
  message: 'Trop de requêtes depuis cette adresse IP',
  skip: (req) => req.path === '/health' // Exclure les health checks
}));

app.use(morgan('combined', { stream: morganStream }));

// Endpoint racine obligatoire
app.get('/', (req, res) => {
  res.status(200).send('API Opérationnelle');
});

// ... reste du code inchangé ...