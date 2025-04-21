import mongoose, { Schema } from "mongoose";
import Crypto from "crypto";

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/client-health-journey')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
mongoose.Promise = global.Promise;

const db = {
    User: userModel(),
    Clinic: clinicModel(),
}

function userModel() {
    const UserSchema = new Schema({
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ["admin", "coach", "client", "clinic_admin"],
        },
        clinic: {
            type: Schema.Types.ObjectId,
            ref: "Clinic",
        },
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
        },
        image: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    });

    // Define the hashPassword method
    UserSchema.methods.hashPassword = function (password) {
        return Crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');
    };

    // Compared hased password from user with database's password so if exist, then res is true, not false
    UserSchema.methods.authenticate = function (password) {
        return this.password === this.hashPassword(password);
    };

    UserSchema.pre('save', function (next) {
        if (this.isModified('password')) {
            this.salt = Crypto.randomBytes(16).toString('base64');
            this.password = this.hashPassword(this.password);
        }
        next();
    });

    return mongoose.models.User || mongoose.model('User', UserSchema);
}

function clinicModel() {
    const ClinicSchema = new Schema({
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
        },
        primaryContact: {
            type: String,
        },
        streetAddress: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        zipCode: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    });
    
    return mongoose.models.Clinic || mongoose.model('Clinic', ClinicSchema);
}

export default db;