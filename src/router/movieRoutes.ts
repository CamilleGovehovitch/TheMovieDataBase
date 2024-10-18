import { Router} from 'express';
import { getMoviesDownload, getMovieByIdDownload, getMovies, getMovieById, getMoviesSearch} from '../controllers/movieController';

const router: Router = Router();



// GET all movies
router.get('/movies', getMovies);
// GET movie by id
router.get('/movie/:id', getMovieById);
// GET list of movies to download
router.get('/movies-download', getMoviesDownload);
// GET movie to download
router.get('/movies-download/:id', getMovieByIdDownload);
// SEARCH movie
router.get('/movies-search', getMoviesSearch);



export default router;

// const url = 'https://api.themoviedb.org/3/search/movie?query=Deadpool&include_adult=false&language=en-US&page=3';
