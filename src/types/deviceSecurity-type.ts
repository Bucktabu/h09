import {UserDeviceType} from "./userDevice-type";

export type DeviceSecurityType = {
    userId: string,
    /**
     *  UserDeviceType: deviceTitle
     *                  deviceId
     *                  ip-address
     *                  iat
     *                  end
     */
    userDevice: UserDeviceType
}