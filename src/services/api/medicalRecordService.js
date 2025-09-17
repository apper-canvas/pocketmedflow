import recordsData from "@/services/mockData/medicalRecords.json";

let medicalRecords = [...recordsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const medicalRecordService = {
  async getAll() {
    await delay(300);
    return [...medicalRecords];
  },

  async getById(id) {
    await delay(200);
    const record = medicalRecords.find(r => r.Id === parseInt(id));
    if (!record) {
      throw new Error("Medical record not found");
    }
    return { ...record };
  },

  async getByPatientId(patientId) {
    await delay(250);
    return medicalRecords.filter(record => record.patientId === patientId);
  },

  async create(recordData) {
    await delay(400);
    const maxId = Math.max(...medicalRecords.map(r => r.Id), 0);
    const newRecord = {
      ...recordData,
      Id: maxId + 1,
      visitDate: new Date().toISOString().split("T")[0]
    };
    medicalRecords.push(newRecord);
    return { ...newRecord };
  },

  async update(id, recordData) {
    await delay(300);
    const index = medicalRecords.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Medical record not found");
    }
    medicalRecords[index] = { ...medicalRecords[index], ...recordData };
    return { ...medicalRecords[index] };
  },

  async delete(id) {
    await delay(200);
    const index = medicalRecords.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Medical record not found");
    }
    medicalRecords.splice(index, 1);
    return true;
  }
};