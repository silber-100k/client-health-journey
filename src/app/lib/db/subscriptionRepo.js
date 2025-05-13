import db from "./index";

const SubscriptionTier = db.SubscriptionTier;
const SubscriptionHistory = db.SubscriptionHistory;

async function createSubscriptionTier(clinicId, planId, customerId) {
    const existingSubscriptionTier = await SubscriptionTier.findOne({ clinicId });
    if (existingSubscriptionTier) {
        return existingSubscriptionTier;
    }
    const subscriptionTier = await SubscriptionTier.create({
        clinicId,
        planId,
        customerId,
        isActive: false
    });
    return subscriptionTier;
};

async function createSubscriptionHistory(clinicId, subscriptionId, paymentAmount) {
    const existingSubscriptionHistory = await SubscriptionHistory.findOne({ subscriptionId });
    if (existingSubscriptionHistory) {
        return existingSubscriptionHistory;
    }
    const subscriptionHistory = await SubscriptionHistory.create({
        clinicId,
        subscriptionId,
        paymentAmount,
    });
    return subscriptionHistory;
};

async function subscriptionActive(clinicId, { isActive, subscriptionId }) {
    const subscriptionTier = await SubscriptionTier.findOneAndUpdate(
        { clinicId },
        { 
            isActive,
            subscriptionId,
            startDate: new Date(),
            endDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        },
        { new: true }
    );
    return subscriptionTier;
};

async function getSubscriptionTier(clinicId) {
    const subscriptionTier = await SubscriptionTier.findOne({ clinicId });
    return subscriptionTier;
};

async function deleteSubscriptionTier(id) {
    await SubscriptionTier.findByIdAndDelete(id);
}

async function updateSubscriptionTier(clinicId, planId) {
    const subscriptionTier = await SubscriptionTier.findOneAndUpdate(
        { clinicId },
        { 
            planId,
            isActive: false,
        },
        { new: true }
    );
    return subscriptionTier;
}

async function getSubscriptionTierByCustomerId(customerId) {
    const subscriptionTier = await SubscriptionTier.findOne({ customerId });
    return subscriptionTier;
}

async function deleteSessionByClinicId(clinicId) {
    await SubscriptionTier.findOneAndDelete({ clinicId });
}

async function getSubscriptionHistory() {
    const subscriptionHistory = await SubscriptionHistory.find();
    return subscriptionHistory;
}

export const subscriptionRepo = {
    createSubscriptionTier,
    createSubscriptionHistory,
    subscriptionActive,
    getSubscriptionTier,
    deleteSubscriptionTier,
    updateSubscriptionTier,
    deleteSessionByClinicId,
    getSubscriptionTierByCustomerId,
    getSubscriptionHistory,
};