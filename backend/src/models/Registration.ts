import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'attended', 'pending'],
        default: 'confirmed'
    },
    feedback: {
        rating: Number,
        comment: String
    },
    certificate: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Prevent double registration
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model('Registration', registrationSchema);
