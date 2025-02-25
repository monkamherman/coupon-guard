// src/server.ts
// Configurations de Middlewares
import express from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { setupSwagger } from './swagger';
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
app.use(compression());
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
app.use(cors(corsOptions));
app.use("/", user)
setupSwagger(app);
app.listen(envs.PORT, () => {
	console.log(`Server running on port http://localhost:${envs.PORT}/`);
	console.log(`Documentation  : http://localhost:${envs.PORT}/api-docs`);
});