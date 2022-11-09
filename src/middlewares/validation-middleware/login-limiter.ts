import {RateLimiterMemory} from "rate-limiter-flexible";
import {Request, Response, NextFunction} from "express";

export const loginLimiter = (req: Request, res: Response, next: NextFunction) => {
    const opts = {
        points: 5,
        duration: 10,
    }

    const rateLimiter = new RateLimiterMemory(opts)

    rateLimiter.consume(req.ip, 1)
        .then((rateLimiterRes) => {
            next()
        })
        .catch((rateLimiterRes) => {
            return res.sendStatus(429)
        });
}