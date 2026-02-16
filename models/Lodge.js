const mongoose = require('mongoose');

const lodgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    tagline: String,
    images: {
        type: [String],
        default: []
    },
    distance: String,
    distanceType: {
        type: String,
        enum: ['walkable', 'auto'],
        default: 'walkable'
    },
    rating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    priceStarting: {
        type: Number,
        required: true
    },
    availability: {
        type: String,
        enum: ['available', 'limited', 'full'],
        default: 'available'
    },
    featured: {
        type: Boolean,
        default: false
    },
    amenities: {
        type: [String],
        default: []
    },
    address: String,
    phone: String,
    whatsapp: String,
    description: String
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for id
lodgeSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Associations (virtual populate)
lodgeSchema.virtual('rooms', {
    ref: 'Room',
    localField: '_id',
    foreignField: 'lodgeId'
});

const Lodge = mongoose.model('Lodge', lodgeSchema);

module.exports = Lodge;
