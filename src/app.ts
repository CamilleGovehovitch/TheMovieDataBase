import express, { Application } from 'express';
import moviesRoutes from './router/movieRoutes';

const app: Application = express();

// Middleware pour traiter le JSON
app.use(express.json());

// Routes
app.use(moviesRoutes);

export default app;
