import { NextResponse } from "next/server";
import { clinicRepo } from "@/app/lib/db/clinicRepo";
import { userRepo } from "@/app/lib/db/userRepo";

export async function PUT(request, { params }) {
    const { id } = params;
    const clinic = await request.json();
            console.log(id,clinic)
    try {
        const updatedClinic = await clinicRepo.updateClinic(id, clinic);

        const clinicAdmin = await userRepo.getClinicAdmin(id);
        await userRepo.updateAdminUser(
            clinicAdmin.id,
            clinic.primaryContact,
            clinic.email,
            clinic.clinicPhone,
            "clinic_admin",
            true
        );
        return NextResponse.json({ success: true, message: "Clinic updated successfully", clinic: updatedClinic });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Clinic update failed", error: error.message });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    const clinic = await request.json();
    try {        
        await userRepo.deleteClinicMembers(id);
        await clinicRepo.deleteClinic(id);

        return NextResponse.json({ success: true, message: "Clinic deleted successfully"});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Clinic delete failed", error: error.message });
    }
}

export async function PATCH(request, { params }) {
    const { id } = params;
    try {
        const clinicAdmin = await userRepo.getClinicAdmin(id);
        await userRepo.resetPassword(clinicAdmin.id, "password123");
        return NextResponse.json({ success: true, message: "Clinic password reset successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Clinic password reset failed", error: error.message });
    }
}

