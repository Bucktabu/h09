import {NextFunction, Request, Response} from "express";
import {ipAddressCollection} from "../../repositories/db";

export const ipAddressLimiter = async (req: Request, res: Response, next: NextFunction) => {
    const ipAddress = await ipAddressCollection.findOne({ipAddress: req.ip})

    if (!ipAddress) {
        await ipAddressCollection.insertOne({
            ipAddress: req.ip,
            at: Date.now(),
            timer: 0,
            count: 1
        })

        return next()
    }

    const count = ipAddress.count++
    const timer = Date.now() - ipAddress.at
    await ipAddressCollection.updateOne({ipAddress: req.ip}, {$set: {count, timer}})

    if (ipAddress.timer > 10) {
        await ipAddressCollection.updateOne({ipAddress: req.ip}, {$set: {at: Date.now(), count: 0}})
    }

    if (ipAddress.count === 5) {
        await ipAddressCollection.updateOne({ipAddress: req.ip}, {$set: {count: 0}})
        return res.sendStatus(429)
    }

    return next()
}