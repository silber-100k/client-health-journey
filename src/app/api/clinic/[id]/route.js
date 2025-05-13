import { NextResponse } from "next/server";
import { clinicRepo } from "@/app/lib/db/clinicRepo";
import { subscriptionRepo } from "@/app/lib/db/subscriptionRepo";
import { SubscriptionPlan } from "@/app/lib/stack";

export async function GET(req, { params }) {
    const { id } = params;
    try {
        const clinic = await clinicRepo.getClinicById(id);
        const subscriptionTier = await subscriptionRepo.getSubscriptionTier(id);
        let clientLimit = 0;
        let plan = null;
        if (subscriptionTier && subscriptionTier.isActive && subscriptionTier.endDate > new Date()) {
            console.log("subscriptionTier", subscriptionTier);
            plan = SubscriptionPlan.find(plan => plan.id === subscriptionTier.planId);
            clientLimit = plan.clientLimit;
        }
        return NextResponse.json({ success: true, clinic, clientLimit, planId: plan?.id, currentPlan: subscriptionTier.planId});
    } catch (error) {
        console.error("Error fetching clinic data:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch clinic data" }, { status: 500 });
    }
}