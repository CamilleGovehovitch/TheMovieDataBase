import { Router} from 'express';
import { getMoviesDownload, getMovieByIdDownload, getMovies, getMovieById} from '../controllers/movieController';

const router: Router = Router();

// GET all movies
router.get('/movies', getMovies);
// GET movie by id
router.get('/movie/:id', getMovieById);
// GET list of movies to download
router.get('/movies-download', getMoviesDownload);
// GET movie to download
router.get('/movies-download/:id', getMovieByIdDownload);



export default router;
