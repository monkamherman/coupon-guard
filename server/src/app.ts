import express from 'express';
import user from './routes/route';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/', user);

// Démarrer uniquement en local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Local: http://localhost:${PORT}`);
  });
}

// Export pour Fly.io
export default app;