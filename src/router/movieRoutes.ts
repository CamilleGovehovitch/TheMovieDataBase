import { Router} from 'express';
import { getMovies } from '../controllers/movieController';

const router: Router = Router();

// GET all movies
router.get('/', getMovies);
// router.get('/movies/:id', getMovieById);



export default router;
