import db from "./index";

export const clinicRepo = {
  createClinic,
  getClinicById,
  deleteClinic,
};

async function createClinic(email, name, phoneNumber, primaryContact, streetAddress, city, state, zipCode, plan, addOns, hipaaAcknowledgment, legalAcknowledgment, options = {}) {
  const newClinic = await db.Clinic.create([{
    email,
    name,
    phoneNumber,
    primaryContact,
    streetAddress,
    city,
    state,
    zipCode,
    plan,
    addOns,
    hipaaAcknowledgment,
    legalAcknowledgment,
  }], options);
  return newClinic[0];
}

async function getClinicById(id) {
  const clinic = await db.Clinic.findById(id);
  return clinic;
}

async function deleteClinic(id) {
  await db.Clinic.findByIdAndDelete(id);
}
