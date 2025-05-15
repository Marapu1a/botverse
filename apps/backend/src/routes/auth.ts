import { FastifyInstance } from "fastify";
import { verifyTelegramAuth } from "../utils/verifyTelegram";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function authRoutes(app: FastifyInstance) {
    app.post("/auth/telegram", async (req, reply) => {
        const body = req.body as any;

        try {
            const isValid = verifyTelegramAuth(body, process.env.TELEGRAM_BOT_TOKEN!);
            if (!isValid) return reply.status(401).send({ error: "Invalid auth" });

            const { id, username, first_name, language_code } = body;

            const user = await prisma.user.upsert({
                where: { telegramId: id.toString() },
                update: {
                    username,
                    firstName: first_name,
                    languageCode: language_code,
                },
                create: {
                    telegramId: id.toString(),
                    username,
                    firstName: first_name,
                    languageCode: language_code,
                },
            });

            const token = app.jwt.sign(
                { telegramId: user.telegramId },
                { expiresIn: "7d" }
            );

            reply.send({ token });
        } catch (err) {
            console.error("AUTH ERROR", err);
            console.log("BODY:", req.body);
            console.log("TOKEN:", process.env.TELEGRAM_BOT_TOKEN);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });
}
