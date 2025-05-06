import mongoose, { Schema } from "mongoose";
import Crypto from "crypto";

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/client-health-journey')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
mongoose.Promise = global.Promise;

const db = {
    User: userModel(),
    Clinic: clinicModel(),
    Program: programModel(),
    Client: clientModel(),
    Template: templateModel(),
    CheckIn: checkInModel(),
    Message: MessageModel(),
    Notification: NotificationModel(),
    Activity: ActivityModel(),
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
        salt: {
            type: String
        },
        coachId:{
            type: Schema.Types.ObjectId,
        }
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
            unique: true,
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
        plan: {
            type: String,
        },
        addOns: {
            type: [String],
        },
        hipaaAcknowledgment: {
            type: Boolean,
        },
        legalAcknowledgment: {
            type: Boolean,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        coaches: {
            type:Number,
            default:0,
        },
        clients: {
            type:Number,
            default:0,
        },
        billingContactName: {type: String},
        billingEmail: {type: String},
        billingPhone: {type: String},
        billingAddress: {type: String},
        billingCity: {type: String},
        billingState: {type: String},
        billingZip: {type: String},
        paymentMethod: {type: String},
        subscriptionTier: {type: String},
    });

    return mongoose.models.Clinic || mongoose.model('Clinic', ClinicSchema);
}

function programModel() {
    const ProgramSchema = new Schema({
        name: {
            type: String,
        },
        type: {
            type: String,
        },
        duration: {
            type: String,
        },
        description: {
            type: String,
        },
        tempId: {
            type: Schema.Types.ObjectId,
            ref: "Template",
        },
        clinicId: {
            type: Schema.Types.ObjectId,
            ref: "Clinic",
        },
    });

    return mongoose.models.Program || mongoose.model('Program', ProgramSchema);
}

function clientModel() {
    const ClientSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        programId: {
            type: Schema.Types.ObjectId,
            ref: "Program",
        },
        programCategory: {
            type: String,
        },
        startDate: {
            type: Date,
        },
        notes: {
            type: String,
        },
        coachId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        clinic: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        weightDate: {
            type: Date,
        },
        initialWeight: {
            type: Number,
        },
        lastCheckIn: {
            type: Date,
        },
        goals: [
            {
                type: String,
            }
        ]
    });
    return mongoose.models.Client || mongoose.model('Client', ClientSchema);
}

function templateModel() {
    const TempSchema = new Schema({
        type: {
            type: String,
        },
        description: {
            type: String,
        }
    });
    return mongoose.models.Template || mongoose.model('Template', TempSchema);
}

function checkInModel() {
    const CheckInSchema = new Schema({
        name:{
            type:String,
            required:true,
        },
        email:{
            type: String,
            required: true,
        },
        coachId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        clinic: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        selectedDate: {
            type: Date,
        },
        weight: {
            type: Number,
        },
        waist: {
            type: Number,
        },
        waterIntake: { type: String },
        energyLevel: [{ type: Number }],
        moodLevel: [{ type: Number }],
        exerciseType: { type: String },
        exercise: { type: String },
        exerciseTime: { type: String },
        sleepHours: { type: String },
        breakfastProtein: { type: String },
        breakfastProteinPortion: { type: String },
        breakfastFruit: { type: String },
        breakfastFruitPortion: { type: String },
        breakfastVegetable: { type: String },
        breakfastVegetablePortion: { type: String },
        lunchProtein: { type: String },
        lunchProteinPortion: { type: String },
        lunchFruit: { type: String },
        lunchFruitPortion: { type: String },
        lunchVegetable: { type: String },
        lunchVegetablePortion: { type: String },
        dinnerProtein: { type: String },
        dinnerProteinPortion: { type: String },
        dinnerFruit: { type: String },
        dinnerFruitPortion: { type: String },
        dinnerVegetable: { type: String },
        dinnerVegetablePortion: { type: String },
        snacks: { type: String },
        snackPortion: { type: String },
        supplements: { type: String },
        notes: { type: String },
    });
    return mongoose.models.CheckIn || mongoose.model('CheckIn', CheckInSchema);
};
function MessageModel() {
    const MessageSchcema = new Schema({
        id:{type:String,required:true},
        message: { type: String, required: true },
        receiver: { type: String, required: true },
        sender: { type: String, required: true },
        status: {type: String, required: true},
        timeStamp: {type: Date, default: Date.now,}
    });
  return mongoose.models.Message || mongoose.model('Message', MessageSchcema);
};

function NotificationModel() {
    const NotificationSchcema = new Schema({
        email:{type:String, required: true},
        unreadCount:{type:Number, default:0}
    });
  return mongoose.models.Notification || mongoose.model('Notification', NotificationSchcema);
};

function ActivityModel() {
    const ActivitySchcema = new Schema({
        type: { type: String, required: true },
        description: { type: String, required: true },
        clinicId: {type: Schema.Types.ObjectId,},
        timeStamp: {type: Date, default: Date.now,},
    });
  return mongoose.models.Activity || mongoose.model('Activity', ActivitySchcema);
}
export default db;