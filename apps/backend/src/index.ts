import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import userRoutes from './routes/users';

dotenv.config();

const app = Fastify();

// CORS
app.register(cors, {
    origin: true,
    credentials: true,
});

// JWT плагин
app.register(jwt, {
    secret: process.env.JWT_SECRET!,
});

app.register(authRoutes);
app.register(userRoutes);
app.listen({ port: 3001 }, () => {
    console.log(`Сервер запущен на ${process.env.BACK_URL}`)
});
