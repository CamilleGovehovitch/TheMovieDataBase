import { Request, Response } from "express";
import axios from "axios";
import { moviesPdfProcessor } from "../processors/pdfProcessor";

type Movies ={
  results: Movie[];
  data: Movie[];
}
type Movie = {
  id: number;
  title: string;
  overview: string;
  original_language: string;
  vote_average: number;
  poster_path: string;
  original_title: string
}

// GET movies list
export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const tmdbResponse = await axios.get<Movies>(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}`);
    console.log(tmdbResponse);
    if (!tmdbResponse.data.results || !tmdbResponse.data) {
      res.status(404).json({message: 'An error occured during the process, no list is available'});
    }
    res.status(200).json(tmdbResponse.data.results );
  } catch (error) {
    res.status(500).json({message: 'An error occured during the fetch process'});
    console.error(error);
  }
}
// GET movie by ID
export const getMovieById = async (req: Request, res: Response): Promise<void> => {
  try {
    let idParam: string = req.params.id;
    const tmdbResponse = await axios.get<Movies>(`https://api.themoviedb.org/3/movie/${idParam}?api_key=${process.env.API_KEY}`);
    if (!tmdbResponse.data) {
      res.status(404).json({message: 'An error occured during the process, no movie was found'});
      return
    }
    res.status(200).json(tmdbResponse.data);
  } catch (error) {
    res.status(500).json({message: 'An error occured during the fetch process'});
    console.error(error);
  }
}

// GET movies list to download
export const getMoviesDownload = async (req: Request, res: Response): Promise<void> => {
  try {

    // GET movies from TMDB
    const tmdbResponse = await axios.get<Movies>(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}`);

    // IF response is empty return an 404 error
    if (!tmdbResponse.data.results) {
      res.status(404).json({ message: "An error occured during the process" });
      return;
    }

    // DEFINE Headers to send the pdf as a download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=moviesFromTMDB.pdf");

    // CREATE pdf document and send it to the response
    await moviesPdfProcessor(req, res, tmdbResponse.data.results);
    return;
  } catch (error) {
    console.error(error);
  }
  res.status(500).json({ message: "An error occured during the generating process" });
  return;
};

// GET movie by id to download
// GET movie by id to download
export const getMovieByIdDownload = async (req: Request, res: Response): Promise<void> => {
  const movieId = req.params.id;

  try {
    const movieResponse = await axios.get<Movie>(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}`);

    // DEFINE Headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=" + movieResponse.data.title + ".pdf");
    await moviesPdfProcessor(req, res, [movieResponse.data]);

  } catch (error) {}
};

export const getMoviesSearch = async (req: Request, res: Response): Promise<void> => {
  let query:any;
  try {
    if (!req.query) {
      res.status(404).json({message: 'An error occured, some querries are empty'});
      return;
    } else {
       query = req.query;
    }
    const searchResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${query.query}&include_adult=true&language=${query.languages}&api_key=${process.env.API_KEY}`);
    if (!searchResponse.data.results || !searchResponse.data) {
      res.status(404).json({message: 'No movies was found'});
      return
    }
    res.status(200).json(searchResponse.data.results);
    return
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'An error occured during the process'});
    return
  }
}
export const getMoviesSearchDownload = async (req: Request, res: Response): Promise<void> => {
  let query:any;
  const searchQuery = req.query.query as string;

  try {
    if (!req.query) {
      res.status(404).json({message: 'An error occured, some querries are empty'});
      return;
    } else {
       query = req.query;
    }
    const moviesResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${{query}}&api_key=${process.env.API_KEY}`);

    if (!moviesResponse.data.results || !moviesResponse.data) {
      res.status(404).json({message: 'No movies was found'});
      return
    }
    console.log(moviesResponse.data.results, 'RESULTS');
     // Define headers for file download
     res.setHeader("Content-Type", "application/pdf");
     res.setHeader("Content-Disposition", `attachment; filename=${searchQuery}.pdf`);
     
     await moviesPdfProcessor(req, res, moviesResponse.data.results);

    return
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'An error occured during the process'});
    return
  }
}


