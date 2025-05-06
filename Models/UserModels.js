import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    role: {
        type: String,
        enum: ['user', 'company', 'admin'],
        required: true,
    },
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: String,
    password: {
        type: String,
        required: true
    },
    inn: String,
    organizationName: String,
    representativeFullName: String,
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    resetPasswordToken: String,
    resetTokenExpires: Date
}, {
    timestamps: true
});

export const User = model('User', userSchema);
