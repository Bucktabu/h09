import {securityRepository} from "../repositories/security-repository";
import {DeviceSecurityType} from "../types/deviceSecurity-type";
import {v4 as uuidv4} from "uuid";
import {activeSessionsOutputType} from "../dataMapping/toActiveSessionsOutputType";

export const securityService = {
    async createUserDevice(userId: string, tokenInfo: any, userDevice: string, ipAddress: string) {
        console.log('--->> userId from security service', userId)
        const createDevice: DeviceSecurityType = {
            userId,
            userDevice: {
                deviceTitle: userDevice,
                deviceId: uuidv4(),
                ipAddress,
                iat: tokenInfo.iat,
                exp: tokenInfo.exp
            }
        }

        const createdDevice = await securityRepository.createUserDevice(createDevice)

        if (!createdDevice) {
            return null
        }

        return await securityRepository.giveUserDevice(createDevice.userId, createDevice.userDevice.deviceTitle)
    },

    async checkUserDevice(userId: string, deviceId: string) {
        return await securityRepository.checkUserDevice(userId, deviceId)
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

    async giveDeviseById(deviceId: string) {
        return await securityRepository.giveUserId(deviceId)
    },

    async deleteDeviceById(deviceId: string) {
        return await securityRepository.deleteDeviceById(deviceId)
    },

    async deleteAllActiveSessions(userId: string): Promise<boolean> {
        await securityRepository.deleteAllActiveSessions(userId)
        const activeSessions = await securityRepository.giveAllActiveSessions(userId)

        if (activeSessions.length !== 1) {
           return false
        }

        if (activeSessions[0].userId !== userId) {
            return false
        }

        return true
    }
}