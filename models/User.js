const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['super_admin', 'admin'],
        default: 'admin'
    },
    lodgeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lodge',
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Virtual populate for lodge
userSchema.virtual('lodge', {
    ref: 'Lodge',
    localField: 'lodgeId',
    foreignField: '_id',
    justOne: true
});


const User = mongoose.model('User', userSchema);

module.exports = User;
