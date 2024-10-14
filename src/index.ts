import http from 'http';
import app from './app';
import dotenv from 'dotenv';

dotenv.config(); // Charge les variables du fichier .env dans process.env

// Normaliser le port
const normalizePort = (val: string) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Gestion des erreurs
const errorHandler = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `pipe ${port}` : `port ${port}`;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Créer le serveur
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${port}`;
  console.log(`Listening on ${bind}`);
});

server.listen(port);
