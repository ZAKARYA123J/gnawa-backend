// @deno-types="npm:@types/express"
import { Request, Response } from "express";
import { Event } from "../models/Event.ts";

export const getEvents = async (_req: Request, res: Response) => {
  try {
    const events = await Event.findAll();

    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.name,
      date: event.date,
      location: event.location,
      description: event.description,
      bannerUrl: event.imageUrl,
    }));

    res.json(events);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      date,
      location,
      address,
      price,
      maxCapacity,
      availableTickets,
      status,
      imageUrl,
    } = req.body;

    // Required fields validation (match model)
    if (!name || !description || !date || !location) {
      return res.status(400).json({
        message: "Name, description, date, and location are required",
      });
    }

    const event = await Event.create({
      name,
      description,
      date: new Date(date),
      location,
      address,
      price: price ?? 0,
      maxCapacity,
      availableTickets,
      status: status ?? "planned",
      imageUrl,
    });

    // Response formatting (frontend-friendly)
    const formattedEvent = {
      id: event.id,
      title: event.name,
      description: event.description,
      date: event.date,
      location: event.location,
      address: event.address,
      price: event.price,
      maxCapacity: event.maxCapacity,
      availableTickets: event.availableTickets,
      status: event.status,
      bannerUrl: event.imageUrl,
      createdAt: event.createdAt,
    };

    return res.status(201).json(event);
  } catch (error: any) {
    console.error("Create event error:", error);

    // Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: error.errors.map((e: any) => e.message),
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    await event.destroy();

    return res.status(204).json();
  } catch (error: any) {
    console.error("Delete event error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
