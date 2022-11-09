import {UserDeviceType} from "./userDevice-type";

export type DeviceSecurityType = {
    userId: string,
    /**
     *  UserDeviceType: deviceId
     *                  deviceTitle
     *                  brouser
     *                  ip-address
     *                  iat
     *                  end
     */
    userDevice: UserDeviceType
}