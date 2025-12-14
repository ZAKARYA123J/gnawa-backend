// @deno-types="npm:@types/express"
import { Request, Response } from "express";
import { Artist } from "../models/Artist.ts";

// const mapArtistResponse = (artist: Artist) => {
//   const photos = (artist.photos as unknown as string[]) || [];
//   return {
//     id: artist.id,
//     name: artist.name,
//     style: artist.genre,
//     bio: artist.biography,
//     photoUrl: photos.length > 0 ? photos[0] : "",
//     schedule: artist.performances || [],
//   };
// };

export const getArtists = async (_req: Request, res: Response) => {
  try {
    const artists = await Artist.findAll();
    res.json(artists);
  } catch (error) {
    console.error("Get artists error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getArtistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findByPk(id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    res.json(artist);
  } catch (error) {
    console.error("Get artist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createArtist = async (req: Request, res: Response) => {
  try {
    const { name, style, bio, photoUrl, schedule } = req.body;

    // Basic validation
    if (!name || !style || !bio) {
      return res
        .status(400)
        .json({ message: "Name, style, and bio are required" });
    }
    if (typeof bio !== "string" || bio.length < 50 || bio.length > 10000) {
      return res.status(400).json({
        field: "biography",
        message: "La biographie doit contenir entre 50 et 10000 caractères",
      });
    }
    const newArtist = await Artist.create({
      name,
      genre: style,
      biography: bio,
      photos: photoUrl ? [photoUrl] : [],
      performances: schedule || [],
      status: "active",
      isHeadliner: false,
    });

    res.status(201).json(newArtist);
  } catch (error) {
    console.error("Create artist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateArtist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, style, bio, photoUrl, schedule } = req.body;

    const artist = await Artist.findByPk(id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    const updates: any = {};
    if (name) updates.name = name;
    if (style) updates.genre = style;
    if (bio) updates.biography = bio;
    if (photoUrl) updates.photos = [photoUrl]; // Overwrites existing photos based on simplistic requirement
    if (schedule) updates.performances = schedule;

    await artist.update(updates);

    res.json(artist);
  } catch (error) {
    console.error("Update artist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteArtist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findByPk(id);

    if (!artist) {
      // Ideally 404, but idempotent delete can be 200/204. User asked for 200/204.
      return res.status(404).json({ message: "Artist not found" });
    }

    await artist.destroy();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete artist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
