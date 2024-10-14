import PDFDocument, { heightOfString, widthOfString } from "pdfkit";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
interface Movie {
  id: number;
  title: string;
  overview: string;
  original_language: string;
  vote_average: number;
}

export const moviesPdfProcessor = async (res: Response, movies: []): Promise<void> => {
  // Create new pdf document
  const doc = new PDFDocument();

  // Create output
  doc.pipe(res);

  // SETUP police size, font
  doc.font("Helvetica-Bold").fontSize(26).text("Movie list from TMDB");
  doc.moveDown(1);

  // FOREACH movie use
  movies.forEach((movie: Movie) => {
    let yCoordinates = doc.widthOfString(movie.title);
    doc
      .font("Helvetica")
      .text(movie.title)
      .fontSize(20)
      .link(doc.x, doc.y, yCoordinates, -35, `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.API_KEY}`);
    doc.text("Overview" + ":" + movie.overview).fontSize(16);
    doc.text("Langue Originale" + ":" + movie.original_language).fontSize(16);
    doc.moveDown(1);
  });
  doc.end();
};
