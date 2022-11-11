import {NextFunction, Request, Response} from "express";
import {ipAddressCollection} from "../../repositories/db";

export const ipAddressLimiter = async (req: Request, res: Response, next: NextFunction) => {
    const ipAddress = await ipAddressCollection.findOne({ipAddress: req.ip})

    if (!ipAddress) {
        await ipAddressCollection.insertOne({
            ipAddress: req.ip,
            at: Date.now(),
            timer: 0,
            count: 0
        })

        return next()
    }

    const count = ipAddress.count + 1
    const timer = Date.now() - ipAddress.at
    console.log(count, timer)
    await ipAddressCollection.updateOne({ipAddress: req.ip}, {$set: {count: count, timer}})

    if (ipAddress.timer > 10000) {
        await ipAddressCollection.updateOne({ipAddress: req.ip}, {$set: {at: Date.now(), count: 1}})
    }

    if (ipAddress.count === 5) {
        await ipAddressCollection.updateOne({ipAddress: req.ip}, {$set: {count: 4}})
        return res.sendStatus(429)
    }

    return next()
}