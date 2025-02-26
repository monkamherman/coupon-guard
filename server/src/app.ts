// src/server.ts
// Configurations de Middlewares
import express from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { ONE_HUNDRED, SIXTY } from './core/constants';
import { logger } from 'env-var';
import { envs } from './core/config/env';
import user from './routes/route';
import cors from 'cors';


// Créer un stream pour Morgan avec niveau HTTP spécifique
const morganStream = {
	write: (message: string) => {
		logger('http', message.trim()); // Utilise le format correct pour le logger
	}
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	rateLimit({
		max: ONE_HUNDRED,
		windowMs: SIXTY,
		message: 'Trop de Requete à partir de cette adresse IP '
	})
);

app.use(morgan('combined', {
	stream: morganStream
}));
const corsOptions = {
    origin: envs.CORS_ORIGIN ||'*', // Autoriser toutes les origines en développement ou restreindre en production
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers autorisés
    credentials: true, // Autoriser les cookies et autres informations d'authentification
};
app.get('/env', (req, res) => {
	res.json(process.env);
  });
app.use(cors(corsOptions));
app.use("/api/users", user);
  
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
