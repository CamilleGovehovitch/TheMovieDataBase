import PDFDocument from "pdfkit";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import axios from "axios";

// interface Movies {
//   results: Movie[];
// }
type Movie = {
  id: number;
  title: string;
  overview: string;
  original_language: string;
  vote_average: number;
  poster_path: string;
  original_title: string
}

export const moviesPdfProcessor = async (req: Request, res: Response, movies: Movie[]): Promise<void> => {
  const arrayMovies = Array.isArray(movies) ? movies : [movies];

  // Create new pdf document
  const doc = new PDFDocument();

  // Create output
  doc.pipe(res);

  // SETUP police size, font
  doc.font("Helvetica-Bold").fontSize(26).text("Movie list from TMDB", { align: "center" });

  doc.moveDown(1);

  for (const movie of arrayMovies) {
    try {
      let yCoordinates = doc.widthOfString(movie.original_title);
      
      if (arrayMovies.length <= 1) {
        // CREATE image path
        const imagePath = `https://image.tmdb.org/t/p/w500/${movie.poster_path}.jpg`;

        // DOWNLOAD img temp
        const imageResponse = await axios.get(imagePath, { responseType: "arraybuffer" });

        doc.image(imageResponse.data, {
          fit: [150, 150],
          align: "center",
          valign: "center",
        });
        doc.moveDown(5);
      }

      doc
        .font("Helvetica")
        .text(movie.original_title)
        .fontSize(20)
        .link(doc.x, doc.y, yCoordinates, -35, `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.API_KEY}`);
      doc.text("Overview" + ":" + movie.overview).fontSize(16);
      doc.text("Langue Originale" + ":" + movie.original_language).fontSize(16);
      doc.moveDown(1);
    } catch (error) {}
  }

  doc.end();
};
