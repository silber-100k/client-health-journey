import db from "./index";

async function getAdminUsers() {
    const users = await db.User.find({ role: "admin" });
    return users;
}

async function createAdminUser(name, email, phone, role, password, clinic, options = {}) {
    const user = await db.User.create([{ name, email, phone, role, password, clinic }], options);
    return user[0];
}

async function updateAdminUser(id, name, email, phone, role, isActive) {
    const user = await db.User.findByIdAndUpdate(id, { name, email, phone, role, isActive }, { new: true, upsert: true });
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

export const userRepo = {
    getAdminUsers,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    authenticate,
    getUserById,
};