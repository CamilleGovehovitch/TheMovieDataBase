import { Request, Response } from "express";
import axios from "axios";
import { moviesPdfProcessor } from "../processors/pdfProcessor";
import path from "path";

// interface Movies {
//   results: []
// }
type Movies = {
  results: [];
};
export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    // GET movies from TMDB
    const tmdbResponse = await axios.get<Movies>(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}`);

    // IF response is empty return an 404 error
    if (!tmdbResponse.data.results) {
      res.status(404).json({ message: "An error occured during the process" });
      return;
    }

    // // DEFINE Headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=moviesFromTMDB.pdf");

    // CREATE pdf document
    await moviesPdfProcessor(res, tmdbResponse.data.results);
    return;
  } catch (error) {
    console.error(error);
  }
  res.status(500).json({ message: "An error occured during the generating process" });
  return;
};
