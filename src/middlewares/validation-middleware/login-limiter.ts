import {RateLimiterMemory} from "rate-limiter-flexible";
import {Request, Response, NextFunction} from "express";

export const loginLimiter = (req: Request, res: Response, next: NextFunction) => {
    const opts = {
        points: 5,
        duration: 10,
    }
    console.log('1')
    const rateLimiter = new RateLimiterMemory(opts)

    rateLimiter.consume(req.ip, 1)
        .then((rateLimiterRes) => {
            console.log('2')
            next()
        })
        .catch((rateLimiterRes) => {
            return res.sendStatus(429)
        });
}