import dotenv from 'dotenv';
dotenv.config();

import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { authRoutes } from './routes/auth';

async function start() {
    const app = Fastify();

    await app.register(fastifyCors, {
        origin: ['https://4824-91-246-41-65.ngrok-free.app'],
        credentials: true,
    });

    app.register(authRoutes, { prefix: '/auth' });


    await app.listen({ port: 3001 });

    console.log('Сервер запущен на http://localhost:3001');
}

start().catch((err) => {
    console.error('Ошибка при запуске сервера:', err);
    process.exit(1);
});
