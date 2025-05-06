import db from "./index";

async function getAdminUsers() {
    const users = await db.User.find({ role: "admin" });
    return users;
}

async function createAdminUser(name, email, phoneNumber, role, password, clinic, options = {}) {
    const user = await db.User.create([{ name, email, phoneNumber, role, password, clinic }], options);
    return user[0];
}

async function createClientUser(name, email, phoneNumber, role, password, clinic, coachId, options = {}) {
    const user = await db.User.create([{ name, email, phoneNumber, role, password, clinic, coachId }], options);
    return user[0];
}

async function updateAdminUser(id, name, email, phone, role, isActive) {
    const user = await db.User.findByIdAndUpdate(
        id, 
        { name, email, phone, role, isActive }, 
        { new: true, upsert: true }
    );
    return user;
}

async function deleteAdminUser(id) {
    const user = await db.User.findByIdAndDelete(id);
    return user;
}

async function authenticate(email, password) {
    const user = await db.User.findOne({ email });
    if (!user) {
        throw new Error("Invalid email");
    }

    const isAuthenticated = user.authenticate(password);
    if (!isAuthenticated) {
        return null;
    }

    if (!user.isActive) {
        throw new Error("User is not active");
    }
    return user;
}

async function getUserById(id) {
    const user = await db.User.findById(id);
    return user;
}

async function getUserByEmail(email) {
    const user = await db.User.findOne({ email }).populate("clinic");
    return user;
}

async function getCoachesByClinicId(clinicId) {
    const coaches = await db.User.find({ role: "coach", clinic: clinicId }).populate("clinic");
    return coaches;
}

async function getNumCoachesByClinicId(clinicId) {
    const coaches = await db.User.find({ role: "coach", clinic: clinicId }).populate("clinic");
    return coaches.length;
}

async function updateCoach(id, name, email, phone) {
    const user = await db.User.findByIdAndUpdate(id, { name, email, phone }, { new: true, upsert: true });
    return user;
}

async function deleteCoach(id) {
    const user = await db.User.findByIdAndDelete(id);
    return user;
}

async function resetPassword(id, newPassword) {
    const user = await db.User.findById(id);
    if (!user) return null;
    user.password = newPassword;
    await user.save();
    return user;
}

async function updateCoachNum(id) {
    const user = await db.Clinic.findByIdAndUpdate(id, { $inc: { coaches: 1 } });
    return user;
}

async function getCoaches() {
    const coaches = await db.User.find({ role: "coach" }).populate("clinic");
    return coaches;
}

async function getNumClinics() {
    const clinics = await db.Clinic.find();
    console.log("clinisaaaaaaaaaaaaaaa", clinics.length);
    return clinics.length;
}

async function getNumTotalCoaches() {
    const coaches = await db.User.find({ role: "coach" });
    return coaches.length;
}

export const userRepo = {
    resetPassword,
    updateCoach,
    getAdminUsers,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    deleteCoach,
    authenticate,
    getUserById,
    getUserByEmail,
    getCoachesByClinicId,
    getNumCoachesByClinicId,
    createClientUser,
    updateCoachNum,
    getCoaches,
    getNumClinics,
    getNumTotalCoaches
};