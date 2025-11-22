import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required']
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        minValue: [0, 'Subscription price must be greater than 0']
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'LKR'],
        default: 'LKR',

    },
    frequency: {
        type: String,
        enum: ['Monthly', 'Yearly'],
        default: 'Monthly',

    },
    category: {
        type: String,
        enum: ['Basic', 'Standard', 'Premium'],

        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'PayPal', 'Bank Transfer'],
        default: 'Credit Card',

    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',

    },
    startDate: {
        type: Date,
        required: [true, 'Subscription start date is required'],
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (v) {
                return v >= this.startDate;
            },
            message: 'Renewal date cannot be before start date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }



}, { timestamps: true })

subscriptionSchema.pre('save', function () {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            Monthly: 30,
            Yearly: 365
        }
        this.renewalDate = new Date(this.startDate)
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency])
    }
    if (this.renewalDate < new Date()) {
        this.status = 'Inactive'
    }
})

const Subscription = mongoose.model('Subscription', subscriptionSchema)


export default Subscription