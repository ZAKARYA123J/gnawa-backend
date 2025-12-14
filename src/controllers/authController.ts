
// @deno-types="npm:@types/express"
import { Request, Response } from "express";
import { User } from "../models/user.ts";
// @deno-types="npm:@types/bcrypt"
import bcrypt from "bcrypt";
// @deno-types="npm:@types/jsonwebtoken"
import jwt from "jsonwebtoken";
import { env } from "../../configue.ts";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashedPassword,
            name: name || email.split("@")[0], // Default name from email if not provided
        });

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            env.JWT_SECRET,
            { expiresIn: env.JWT_EXPIRES_IN as any }
        );

        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
            },
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            env.JWT_SECRET,
            { expiresIn: env.JWT_EXPIRES_IN as any }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
