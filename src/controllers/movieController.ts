import { Request, Response } from "express";
import axios from "axios";
import { moviesPdfProcessor } from "../processors/pdfProcessor";
import path from "path";

interface Movies {
  results: [];
}
interface Movie {
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

    // DEFINE Headers
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

    // res.status(200).json(movieResponse.data);
  } catch (error) {}
};
