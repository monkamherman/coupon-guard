
import dotenvSafe from 'dotenv-safe';
import { get } from 'env-var';

dotenvSafe.config({
	allowEmptyValues: true,
	example: '.env.example'
});

export const envs = {
	PORT: get('PORT').required().asPortNumber(),
	API_PREFIX: get('DEFAULT_API_PREFIX').default('/api/v1').asString(),
	NODE_ENV: get('NODE_ENV').default('development').asString(),
	MONGO_INITDB_ROOT_USERNAME: get('MONGO_INITDB_ROOT_USERNAME').default('cesaristo5').asString(),
	MONGO_INITDB_ROOT_PASSWORD: get('MONGO_INITDB_ROOT_PASSWORD').required().asString(),
	MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
	MONGO_HOST: get('MONGO_HOST').default('localhost').asString(),
	MONGO_PORT: get('MONGO_PORT').default('27017').asString(),

	mot_de_passe: "ecry udqv bknf nese",
	address_mail: "plateformetestonline@gmail.com",
	CORS_ORIGIN: get('CORS_ORIGIN').default('*').asString(),
};

export const CONNECTION_STRING = `mongodb://${envs.MONGO_INITDB_ROOT_USERNAME}:${envs.MONGO_INITDB_ROOT_PASSWORD}@${envs.MONGO_HOST}:${envs.MONGO_PORT}/${envs.MONGO_DB_NAME}?authSource=admin`;
