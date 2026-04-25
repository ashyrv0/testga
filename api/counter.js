import { redis } from "./redis";

export default async function handler(req, res) {
    const count = await redis.get("totalClicks") || 0;

    res.status(200).json({ count });
}