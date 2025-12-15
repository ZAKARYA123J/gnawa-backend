import { Request, Response } from "express";
import { Booking } from "../models/Booking.ts";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.create(req.body);
    return res.status(201).json(booking);
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * UPDATE booking
 */
export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.update(req.body);
    return res.status(200).json(booking);
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({
      message: "Failed to update booking",
      error: error.message,
    });
  }
};

/**
 * DELETE booking (soft delete because paranoid: true)
 */
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
