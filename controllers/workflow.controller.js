import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { serve } = require("@upstash/workflow/express");
import Subscription from "../models/subscription.model.js";
import dayjs from 'dayjs';
import { sendReminderEmail } from '../utils/send-email.js';

const REMINDERS = [7, 3, 1]

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId)

    if (!subscription || subscription.status !== 'Active') return;

    await triggerReminder(context, 'welcome', subscription);

    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal Date has passed for ${subscription.user.name} with ${subscriptionId}`)
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');
        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `reminder-${daysBefore}`, reminderDate)
        }
        await triggerReminder(context, `reminder-${daysBefore}`, subscription)

    }
})

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder for ${date}`)
    await context.sleepUntil(label, date.toDate())
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`)
        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription
        })
    })
}

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email')
    })
}