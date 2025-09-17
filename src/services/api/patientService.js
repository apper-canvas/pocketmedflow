import patientsData from "@/services/mockData/patients.json";

let patients = [...patientsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const patientService = {
  async getAll() {
    await delay(300);
    return [...patients];
  },

  async getById(id) {
    await delay(200);
    const patient = patients.find(p => p.Id === parseInt(id));
    if (!patient) {
      throw new Error("Patient not found");
    }
    return { ...patient };
  },

  async create(patientData) {
    await delay(400);
    const maxId = Math.max(...patients.map(p => p.Id), 0);
    const newPatient = {
      ...patientData,
      Id: maxId + 1,
      admissionDate: new Date().toISOString(),
      currentStatus: "Stable"
    };
    patients.push(newPatient);
    return { ...newPatient };
  },

  async update(id, patientData) {
    await delay(300);
    const index = patients.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Patient not found");
    }
    patients[index] = { ...patients[index], ...patientData };
    return { ...patients[index] };
  },

  async delete(id) {
    await delay(200);
    const index = patients.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Patient not found");
    }
    patients.splice(index, 1);
    return true;
  },

  async searchPatients(query) {
    await delay(250);
    const searchTerm = query.toLowerCase();
    return patients.filter(patient => 
      patient.firstName.toLowerCase().includes(searchTerm) ||
      patient.lastName.toLowerCase().includes(searchTerm) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm)
    );
  }
};