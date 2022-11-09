import bcrypt from "bcrypt";
import {UserDBType} from "./types/user-type";
import {jwsService} from "./application/jws-service";

export const giveSkipNumber = (pageNumber: string,
                               pageSize: string) => {

    return (Number(pageNumber) - 1) * Number(pageSize)
}

export const givePagesCount = (totalCount: number, pageSize: string) => {
    return Math.ceil(totalCount / Number(pageSize))
}

export const _generateHash = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt)
}

export const createToken = async (deviceId: string) => {
    const accessToken = await jwsService.createJWT(deviceId, 10)
    const refreshToken = await jwsService.createJWT(deviceId, 20)

    return {accessToken, refreshToken}
}