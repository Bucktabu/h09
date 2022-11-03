import {emailAdapters} from "../adapters/email-adapter";
import {UserAccountType} from "../types/user-account-type";

export const emailsManager = {
    async sendConfirmationEmail(userAccount: UserAccountType) {
        const subject = 'Confirm your email'
        const messege = `<h1>Thank for your registration</h1><p>To finish registration please follow the link below:
                         <a href=\'https://somesite.com/confirm-email?code=${userAccount.emailConfirmation.confirmationCode}\'>complete registration</a>
                         </p>`

        return await emailAdapters.sendEmail(userAccount.accountData.email, subject, messege)
    }
}