import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import {resourceRepo } from "@/app/lib/db/resourceRepo";
import { userRepo } from "@/app/lib/db/userRepo";

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const email = session.user.email;
        const user = await userRepo.getUserByEmail(email);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        let videos;
        if (user.role === "admin") {
            videos = await resourceRepo.getAllVideos();
        }
        if (user.role === "clinic_admin") {
            videos = await resourceRepo.getAllVideosForClinic();
        }
        if (user.role === "coach") {
            videos = await resourceRepo.getAllVideosForCoach();
        }

        return NextResponse.json({ status: true, videos });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const userEmail = session.user.email;
        const user = await userRepo.getUserByEmail(userEmail);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        if (user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { title, role, type, content } = await request.json();
        const video = await resourceRepo.saveVideo(
            title, role, type, content 
        );

        return NextResponse.json({ status: true, video });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}