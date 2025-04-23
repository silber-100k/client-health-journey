import { NextRequest, NextResponse } from "next/server";
import { clinicRepo } from "@/app/lib/db/clinicRepo";
import { userRepo } from "@/app/lib/db/userRepo";

export async function POST(request) {
    const {
        clinicName,
        clinicEmail,
        clinicPhone,
        streetAddress,
        city,
        state,
        zipCode,
        primaryContact,
        email,
        password,
        confirmPassword,
        hipaaAcknowledgment,
        legalAcknowledgment,
        selectedPlan,
        addOns,
        additionalCoaches,
    } = await request.json();

    if (!clinicName || !clinicEmail || !clinicPhone || !streetAddress || !city || !state || !zipCode || !primaryContact || !email || !password || !confirmPassword || !hipaaAcknowledgment || !legalAcknowledgment || !selectedPlan) {
        return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    if (password !== confirmPassword) {
        return NextResponse.json({ success: false, message: "Passwords do not match" }, { status: 400 });
    }

    let clinic = null;
    let adminUser = null;
    const createdCoachUsers = [];

    try {
        // Create clinic
        clinic = await clinicRepo.createClinic(
            clinicEmail, 
            clinicName, 
            clinicPhone, 
            primaryContact, 
            streetAddress, 
            city, 
            state, 
            zipCode, 
            selectedPlan, 
            addOns, 
            hipaaAcknowledgment, 
            legalAcknowledgment
        );

        // Create admin user
        adminUser = await userRepo.createAdminUser(
            primaryContact, 
            email, 
            clinicPhone, 
            "clinic_admin", 
            password, 
            clinic._id
        );

        // Create coach users if any
        if (additionalCoaches && additionalCoaches.length > 0) {
            for (const coach of additionalCoaches) {
                if (!coach.name || !coach.email || !coach.phone) {
                    continue;
                }
                const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                const coachUser = await userRepo.createAdminUser(
                    coach.name, 
                    coach.email, 
                    coach.phone, 
                    "coach", 
                    randomPassword, 
                    clinic._id
                );
                createdCoachUsers.push(coachUser);
            }
        }

        return NextResponse.json({ success: true, message: "Clinic created successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        // Rollback in reverse order
        try {
            // Delete all created coach users
            for (const coachUser of createdCoachUsers) {
                await userRepo.deleteAdminUser(coachUser._id);
            }
            
            // Delete admin user if created
            if (adminUser) {
                await userRepo.deleteAdminUser(adminUser._id);
            }
            
            // Delete clinic if created
            if (clinic) {
                await clinicRepo.deleteClinic(clinic._id);
            }
        } catch (rollbackError) {
            console.error("Error during rollback:", rollbackError);
        }
        
        return NextResponse.json({ success: false, message: "Error creating clinic" }, { status: 500 });
    }
} 