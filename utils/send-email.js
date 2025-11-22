import { emailTemplates } from "./email-template.js";
import dayjs from "dayjs";
import transporter from "../config/nodemailer.js";
import { SERVER_URL } from "../config/env.js";

export const sendReminderEmail = async ({ to, type, subscription }) => {
    if (!to || !type) throw new Error('Missing required parameters');

    let template;
    if (type === 'welcome') {
        template = emailTemplates.find(t => t.label === 'welcome');
    } else {
        const daysBefore = parseInt(type.split('-')[1]);
        template = emailTemplates.find(t => t.days === daysBefore);
    }

    if (!template) return;

    const emailData = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod,
        accountSettingsLink: `${SERVER_URL}/account/settings`,
        supportLink: 'mailto:support@subdub.com'
    }

    const subject = template.generateSubject(emailData);
    const html = template.generateBody(emailData);

    await transporter.sendMail({
        to,
        subject,
        html
    })
}
