import { Router} from 'express';
import { getMoviesDownload, getMovieByIdDownload} from '../controllers/movieController';

const router: Router = Router();

// GET all movies
router.get('/movies-download', getMoviesDownload);
router.get('/movies-download/:id', getMovieByIdDownload);



export default router;
