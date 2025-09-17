import bedsData from "@/services/mockData/beds.json";

let beds = [...bedsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const bedService = {
  async getAll() {
    await delay(300);
    return [...beds];
  },

  async getById(id) {
    await delay(200);
    const bed = beds.find(b => b.Id === parseInt(id));
    if (!bed) {
      throw new Error("Bed not found");
    }
    return { ...bed };
  },

  async create(bedData) {
    await delay(400);
    const maxId = Math.max(...beds.map(b => b.Id), 0);
    const newBed = {
      ...bedData,
      Id: maxId + 1,
      status: "Available",
      patientId: null
    };
    beds.push(newBed);
    return { ...newBed };
  },

  async update(id, bedData) {
    await delay(300);
    const index = beds.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Bed not found");
    }
    beds[index] = { ...beds[index], ...bedData };
    return { ...beds[index] };
  },

  async delete(id) {
    await delay(200);
    const index = beds.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Bed not found");
    }
    beds.splice(index, 1);
    return true;
  },

  async assignPatient(bedId, patientId) {
    await delay(300);
    const index = beds.findIndex(b => b.Id === parseInt(bedId));
    if (index === -1) {
      throw new Error("Bed not found");
    }
    beds[index] = { ...beds[index], patientId: patientId, status: "Occupied" };
    return { ...beds[index] };
  },

  async releasePatient(bedId) {
    await delay(300);
    const index = beds.findIndex(b => b.Id === parseInt(bedId));
    if (index === -1) {
      throw new Error("Bed not found");
    }
    beds[index] = { ...beds[index], patientId: null, status: "Available" };
    return { ...beds[index] };
  }
};