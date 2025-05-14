import dotenv from 'dotenv';
dotenv.config();

import { verifyTelegramAuth } from '../utils/verifyTelegram';
import { verifyToken } from '../utils/verifyToken';
import jwt from 'jsonwebtoken';
import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma/prisma';

if (!process.env.BOT_TOKEN || !process.env.JWT_SECRET) {
    throw new Error('Missing required environment variables');
}

const BOT_TOKEN = process.env.BOT_TOKEN!;
const JWT_SECRET = process.env.JWT_SECRET!;

export async function authRoutes(fastify: FastifyInstance) {
    // ✅ Чистая POST-авторизация
    fastify.post('/telegram', async (request, reply) => {
        const data = request.body as Record<string, string>;

        const isValid = verifyTelegramAuth(data, BOT_TOKEN);
        if (!isValid) {
            return reply.status(401).send({ error: 'Invalid Telegram signature' });
        }

        const telegramId = String(data.id);

        const user = await prisma.user.upsert({
            where: { id: telegramId },
            update: {
                username: data.username,
                firstName: data.first_name,
                languageCode: data.language_code,
            },
            create: {
                id: telegramId,
                username: data.username,
                firstName: data.first_name,
                languageCode: data.language_code,
            },
        });
        console.log(user)
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log(token)
        reply.send({ token }); // 👈 фронту только это и нужно
    });

    // Защищённый маршрут
    fastify.get('/me', { preHandler: verifyToken }, async (request, reply) => {
        console.log("🔥 /me хендлер, request.user:", (request as any).user); // <- так безопаснее
        const userId = (request as any).user?.id;

        if (!userId) {
            return reply.status(401).send({ error: 'Missing user in request' });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return reply.status(404).send({ error: 'User not found' });

        reply.send({
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            balance: user.balance,
        });
    });

}
