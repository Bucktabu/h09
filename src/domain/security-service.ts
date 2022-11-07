import {securityRepository} from "../repositories/security-repository";
import {DeviceSecurityType} from "../types/deviceSecurity-type";
import {v4 as uuidv4} from "uuid";
import {activeSessionsOutputType} from "../dataMapping/toActiveSessionsOutputType";

export const securityService = {
    async createUserDevice(tokenInfo: any, userDevice: string, ipAddress: string) {
        const createDevice: DeviceSecurityType = {
            userId: tokenInfo.id,
            userDevice: {
                deviceTitle: userDevice,
                deviceId: uuidv4(),
                ipAddress,
                iat: tokenInfo.iat,
                end: tokenInfo.end
            }
        }

        const createdDevice = await securityRepository.createUserDevice(createDevice)

        if (!createdDevice) {
            return null
        }

        return await securityRepository.giveUserDevice(createDevice.userId, createDevice.userDevice.deviceTitle)
    },

    async giveUserDevice(userId: string, userDevice: string): Promise<DeviceSecurityType | null> {
        return await securityRepository.giveUserDevice(userId, userDevice)
    },

    async giveAllActiveSessions(userId: string) {
        const activeSessions = await securityRepository.giveAllActiveSessions(userId)

        if (!activeSessions) {
            return null
        }

        return activeSessions.map(activeSession => activeSessionsOutputType(activeSession))
    },

    async deleteAllActiveSessions(userId: string) {
        await securityRepository.deleteAllActiveSessions(userId)
        const activeSessions = await securityRepository.giveAllActiveSessions(userId)
    }
}