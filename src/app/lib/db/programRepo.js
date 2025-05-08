import db from "./index";
import mongoose from "mongoose";

async function getPrograms(clinicId) {
    // Get all programs for the clinic
    const programs = await db.Program.find({clinicId: clinicId}).populate("tempId");
    
    // Get all client counts in a single query
    const clientCounts = await db.Client.aggregate([
        { $match: { clinic: new mongoose.Types.ObjectId(clinicId) } },
        { $group: { _id: "$programId", count: { $sum: 1 } } }
    ]);
    
    // Convert to a map for easy lookup
    const countMap = {};
    clientCounts.forEach(item => {
        countMap[item._id] = item.count;
    });
    
    // Add client count to each program
    const result = programs.map(program => {
        const programObj = program.toObject();
        programObj.clientCount = countMap[program._id] || 0;
        return programObj;
    });
    
    return result;
}

async function getAllProgramsAdmin() {
    // Get all programs for the clinic
    const programs = await db.Program.find().populate("tempId");
    
    // Get all client counts in a single query
    const clientCounts = await db.Client.aggregate([
        { $group: { _id: "$programId", count: { $sum: 1 } } }
    ]);
    
    // Convert to a map for easy lookup
    const countMap = {};
    clientCounts.forEach(item => {
        countMap[item._id] = item.count;
    });
    
    // Add client count to each program
    const result = programs.map(program => {
        const programObj = program.toObject();
        programObj.clientCount = countMap[program._id] || 0;
        return programObj;
    });
    
    return result;
}

async function createProgram(name, type, duration, checkInFrequency, description,tempId, clinicId) {
    const program = await db.Program.create([{ name, type, duration, checkInFrequency, description,tempId, clinicId }]);
    return program[0];
}
async function getTemplates() {
    const templates = await db.Template.find();
    return templates;
}

async function getTemplateDescription(id) {
    const template = await db.Template.findById(id);
    return template;
}
async function createTemplate(type,description){
    const template = await db.Template.create([{type,description}]);
    return template[0];
}

async function updateTemplate(id, description) {
    const template = await db.Template.findByIdAndUpdate(id, {description}, { new: true, upsert: true });
    return template;
}
async function deleteTemplate(id) {
    const template = await db.Template.findByIdAndDelete(id);
    return template;
    
}
export const programRepo = {
    getTemplates,
    getPrograms,
    createProgram,
    createTemplate,
    updateTemplate,
    getTemplateDescription,
    deleteTemplate,
    getAllProgramsAdmin,
}