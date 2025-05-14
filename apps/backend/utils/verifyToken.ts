import dotenv from 'dotenv';
dotenv.config();
import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function verifyToken(request: FastifyRequest, reply: FastifyReply) {
    const auth = request.headers.authorization
    console.log("🔐 Authorization:", request.headers.authorization);
    if (!auth || !auth.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'Unauthorized' })
    }

    const token = auth.split(' ')[1]

    try {
        console.log("🧪 JWT_SECRET:", JWT_SECRET);
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username?: string };
        console.log("✅ JWT decoded:", decoded);
        request.user = decoded;
    } catch (err) {
        console.error("💥 Ошибка в jwt.verify:", err);
        return reply.status(401).send({ error: 'Invalid token' });
    }

}
