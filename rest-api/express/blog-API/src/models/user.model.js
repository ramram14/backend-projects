import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import env from '../config/dotenv.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minLength: [3, 'Name must be at least 3 characters'],
        maxLength: [20, 'Name cannot exceed 20 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    refreshToken: {
        type: String
    },
}, {
    timestamps: true
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();

    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id
    },
        env.JWT_ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn: env.JWT_ACCESS_TOKEN_EXPIRY
        });
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    },
        env.JWT_REFRESH_TOKEN_SECRET_KEY,
        {
            expiresIn: env.JWT_REFRESH_TOKEN_EXPIRY
        });
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;