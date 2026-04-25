import { redis } from "./redis";

export default async function handler(req, res) {
    const user = req.headers["x-forwarded-for"] || "unknown";
    const now = Date.now();

    const lastClick = await redis.get(`user:${user}`);

    if (lastClick && now - lastClick < 24 * 60 * 60 * 1000) {
        const count = await redis.get("totalClicks") || 0;
        return res.json({ allowed: false, count });
    }

    // update user + global counter
    await redis.set(`user:${user}`, now);

    let count = await redis.get("totalClicks") || 0;
    count++;

    await redis.set("totalClicks", count);

    res.json({ allowed: true, count });
}