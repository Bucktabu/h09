import {authentication} from "./validation-middleware/authentication";
import {inputValidation} from "./validation-middleware/input-validation";
import {userEmailValidation,
        userLoginValidation,
        userPasswordValidation} from "./validation-middleware/userRouter-validation";
import {loginOrEmailExistValidation} from "./validation-middleware/loginOrEmailExist-validation";
import {checkCredential} from "./validation-middleware/checkCredential";
import {loginLimiter} from "./validation-middleware/login-limiter";
import {ipAddressLimiter} from "./validation-middleware/ipAddressLimiter";

export const getAuthRouterMiddleware = [authentication]
export const postAuthRouterMiddleware = [userLoginValidation, userPasswordValidation, inputValidation, checkCredential, /*loginLimiter*/ ipAddressLimiter]
export const postRegistrationMiddleware = [userLoginValidation, userPasswordValidation, userEmailValidation, inputValidation, loginOrEmailExistValidation, ipAddressLimiter]
export const postResendingRegistrationEmailMiddleware = [userEmailValidation, inputValidation, ipAddressLimiter]