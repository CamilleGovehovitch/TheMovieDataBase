import { Request, Response } from "express";
import axios from "axios";
import { moviesPdfProcessor } from "../processors/pdfProcessor";

interface Movies {
  results: [];
}
type Movie = {
  id: number;
  title: string;
  overview: string;
  original_language: string;
  vote_average: number;
  poster_path: string;
}

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

// GET movie by id
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

const url = 'https://api.themoviedb.org/3/search/movie?include_adult=true&language=en-US&page=1';
