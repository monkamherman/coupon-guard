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

// Middlewares de sécurité en premier
app.use(cors({
  origin: envs.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rateLimit({
  max: ONE_HUNDRED,
  windowMs: SIXTY * 1000, // Correction: conversion en millisecondes
  message: 'Trop de requêtes depuis cette adresse IP'
}));

app.use(morgan('combined', { stream: morganStream }));

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
  } else {
    res.status(403).json({ 
      error: 'Accès interdit en production' 
    });
  }
});

// Routes applicatives
app.use("/api/users", user);

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
});