import { Schema, model, Types } from 'mongoose';

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
    resetTokenExpires: Date,
    winningAuctions: [{
        type: Types.ObjectId,
        ref: 'Auction'
    }],
    deals: [{ 
        type: Types.ObjectId, 
        ref: 'Deal' 
    }], 
}, {
    timestamps: true
});

export const User = model('User', userSchema);
