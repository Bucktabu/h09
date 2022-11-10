import {securityRepository} from "../repositories/security-repository";
import {DeviceSecurityType} from "../types/deviceSecurity-type";
import {activeSessionsOutputType} from "../dataMapping/toActiveSessionsOutputType";
import UserAgent from "user-agents";

export const securityService = {
    async createUserDevice(tokenPayload: any, ipAddress: string): Promise<boolean> {
        const userDevice: any = new UserAgent().data

        const createDevice: DeviceSecurityType = {
            userId: tokenPayload.userId,
            userDevice: {
                deviceId: tokenPayload.deviceId,
                deviceTitle: userDevice.deviceCategory,
                browser: userDevice.userAgent,
                ipAddress,
                iat: tokenPayload.iat,
                exp: tokenPayload.exp
            }
        }

        const createdDevice = await securityRepository.createUserDevice(createDevice)

        if (!createdDevice) {
            return false
        }

        return true
    },

    async giveAllActiveSessions(userId: string) {
        const activeSessions = await securityRepository.giveAllActiveSessions(userId)

        if (!activeSessions) {
            return null
        }

        return activeSessions.map(activeSession => activeSessionsOutputType(activeSession))
    },

    async giveDeviceById(deviceId: string): Promise<DeviceSecurityType | null> {
        const device = await securityRepository.giveDeviseById(deviceId)

        if (!device) {
            return null
        }

        return device
    },

    async updateCurrentActiveSessions(deviceId: string, iat: string, exp: string) {
        return await securityRepository.updateCurrentActiveSessions(deviceId, iat, exp)
    },

    async deleteDeviceById(deviceId: string): Promise<boolean> {
        return await securityRepository.deleteDeviceById(deviceId)
    },

    async deleteAllActiveSessions(userId: string, deviceId: string): Promise<boolean> {
        const result = await securityRepository.deleteAllActiveSessions(userId, deviceId)

        if (!result) {
            return false
        }

        return true
    }
}