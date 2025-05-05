import db from "./index";

async function getPrograms() {
    const programs = await db.Program.find().populate("tempId");
    return programs;
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
}