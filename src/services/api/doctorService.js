import doctorsData from "@/services/mockData/doctors.json";

let doctors = [...doctorsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const doctorService = {
  async getAll() {
    await delay(300);
    return [...doctors];
  },

  async getById(id) {
    await delay(200);
    const doctor = doctors.find(d => d.Id === parseInt(id));
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    return { ...doctor };
  },

  async create(doctorData) {
    await delay(400);
    const maxId = Math.max(...doctors.map(d => d.Id), 0);
    const newDoctor = {
      ...doctorData,
      Id: maxId + 1,
      currentPatients: []
    };
    doctors.push(newDoctor);
    return { ...newDoctor };
  },

  async update(id, doctorData) {
    await delay(300);
    const index = doctors.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Doctor not found");
    }
    doctors[index] = { ...doctors[index], ...doctorData };
    return { ...doctors[index] };
  },

  async delete(id) {
    await delay(200);
    const index = doctors.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Doctor not found");
    }
    doctors.splice(index, 1);
    return true;
  }
};