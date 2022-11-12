import {RateLimiterMemory} from "rate-limiter-flexible";
import {Request, Response, NextFunction} from "express";
import {securityRepository} from "../../repositories/security-repository";

const loginLimiter = async (req: Request, res: Response, next: NextFunction) => {
    const lastSessions = await securityRepository.giveLastSeveralSessions(req.ip, 5)
    if (lastSessions.length < 5) {
        return next()
    }

    if (Date.now() - Number(lastSessions[lastSessions.length - 1].userDevice.iat) * 1000 <= 10000) {
        return res.sendStatus(429) // More than 5 attempts from one IP-address during 10 seconds
    }

    return next()

    // const opts = {
    //     points: 5,
    //     duration: 10,
    // }
    // console.log('1')
    // const rateLimiter = new RateLimiterMemory(opts)
    //
    // rateLimiter.consume(req.ip, 1)
    //     .then((rateLimiterRes) => {
    //         console.log('2')
    //         next()
    //     })
    //     .catch((rateLimiterRes) => {
    //         return res.sendStatus(429)
    //     });
}