import db from "./index";

async function getActivities(id) {
    const activities = await db.Activity.find({ clinicId: id });
    return activities;
}

async function createActivity(type,description,clinicId) {
    const activity = await db.Activity.create([{type,description,clinicId }]);
    return activity[0];
}

async function createActivitywithCoach(type,description,clinicId) {
    const activity = await db.Activity.create([{type,description,clinicId }]);
    return activity[0];
}

async function updateclientActivity(email) {
    const currentTime = new Date();
    const activity = await db.Client.findOneAndUpdate({email:email},{ $set: { lastCheckIn: currentTime } },
        { new: true } // Return the updated document
      );
    return activity;
}

export const activityRepo = {
    getActivities,
    createActivity,
    createActivitywithCoach,
    updateclientActivity
};