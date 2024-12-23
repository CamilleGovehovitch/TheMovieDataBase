import express, { Application } from 'express';
import moviesRoutes from './router/movieRoutes';
// import cors from 'cors';

const app: Application = express();

// Middleware pour traiter le JSON
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
// Routes
app.use(moviesRoutes);

export default app;
