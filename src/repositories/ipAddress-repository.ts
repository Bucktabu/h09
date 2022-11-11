import {ipAddressCollection} from "./db";

export const ipAddressRepository = {
    async deleteAll(): Promise<boolean> {
        try {
            await ipAddressCollection.deleteMany({})
            return true
        } catch (e) {
            console.log('ipAddressCollection => deleteAll =>', e)
            return false
        }
    }
}