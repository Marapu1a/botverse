import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function userRoutes(app: FastifyInstance) {
    app.get('/me', async (req, reply) => {
        try {
            const auth = req.headers.authorization;
            if (!auth) return reply.status(401).send({ error: "No token" });

            const token = auth.replace("Bearer ", "");
            const payload = await app.jwt.verify<{ telegramId: string }>(token);

            const user = await prisma.user.findUnique({
                where: { telegramId: payload.telegramId },
            });

            if (!user) {
                return reply.status(404).send({ error: 'User not found' });
            }

            reply.send(user);
        } catch {
            reply.status(401).send({ error: "Invalid or expired token" });
        }
    });
}
