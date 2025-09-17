import { toast } from "react-toastify";
import React from "react";

export const bedService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "room_type_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "assigned_nurse_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('bed_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching beds:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "room_type_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "assigned_nurse_c"}}
        ]
      };

      const response = await apperClient.getRecordById('bed_c', id, params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching bed ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(bedData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: bedData.number_c || bedData.Name,
          number_c: bedData.number_c,
          room_type_c: bedData.room_type_c,
          floor_c: bedData.floor_c,
          status_c: bedData.status_c || "Available",
          patient_id_c: bedData.patient_id_c ? parseInt(bedData.patient_id_c) : null,
          assigned_nurse_c: bedData.assigned_nurse_c
        }]
      };

      const response = await apperClient.createRecord('bed_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} beds:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating bed:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, bedData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (bedData.Name !== undefined) updateData.Name = bedData.Name;
      if (bedData.number_c !== undefined) updateData.number_c = bedData.number_c;
      if (bedData.room_type_c !== undefined) updateData.room_type_c = bedData.room_type_c;
      if (bedData.floor_c !== undefined) updateData.floor_c = bedData.floor_c;
      if (bedData.status_c !== undefined) updateData.status_c = bedData.status_c;
      if (bedData.patient_id_c !== undefined) updateData.patient_id_c = bedData.patient_id_c ? parseInt(bedData.patient_id_c) : null;
      if (bedData.assigned_nurse_c !== undefined) updateData.assigned_nurse_c = bedData.assigned_nurse_c;

      const params = { records: [updateData] };
      const response = await apperClient.updateRecord('bed_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} beds:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating bed:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { RecordIds: [parseInt(id)] };
      const response = await apperClient.deleteRecord('bed_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} beds:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting bed:", error?.response?.data?.message || error);
      return false;
    }
  },

  async assignPatient(bedId, patientId) {
    return this.update(bedId, { 
      patient_id_c: parseInt(patientId), 
      status_c: "Occupied" 
    });
  },

  async releasePatient(bedId) {
    return this.update(bedId, { 
      patient_id_c: null, 
      status_c: "Available" 
});
  }
};