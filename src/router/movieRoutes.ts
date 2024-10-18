import { Router} from 'express';
import { getMoviesDownload, getMovieByIdDownload, getMoviesSearch} from '../controllers/movieController';

const router: Router = Router();

// GET movie pdf list
router.get('/movies-download', getMoviesDownload);
// GET movie pdf
router.get('/movies-download/:id', getMovieByIdDownload);
// SEARCH movie
router.get('/movies-search', getMoviesSearch);



export default router;

// const url = 'https://api.themoviedb.org/3/search/movie?query=Deadpool&include_adult=false&language=en-US&page=3';
