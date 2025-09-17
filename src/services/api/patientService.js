import { toast } from "react-toastify";
import React from "react";

export const patientService = {
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "current_status_c"}},
          {"field": {"Name": "admission_date_c"}},
          {"field": {"Name": "bed_number_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('patient_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching patients:", error?.response?.data?.message || error);
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "current_status_c"}},
          {"field": {"Name": "admission_date_c"}},
          {"field": {"Name": "bed_number_c"}}
        ]
      };

      const response = await apperClient.getRecordById('patient_c', id, params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching patient ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(patientData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `${patientData.first_name_c || ""} ${patientData.last_name_c || ""}`.trim(),
          first_name_c: patientData.first_name_c,
          last_name_c: patientData.last_name_c,
          date_of_birth_c: patientData.date_of_birth_c,
          gender_c: patientData.gender_c,
          phone_c: patientData.phone_c,
          email_c: patientData.email_c,
          address_c: patientData.address_c,
          emergency_contact_c: patientData.emergency_contact_c,
          blood_type_c: patientData.blood_type_c,
          allergies_c: patientData.allergies_c,
          current_status_c: patientData.current_status_c || "Stable",
          admission_date_c: patientData.admission_date_c || new Date().toISOString(),
          bed_number_c: patientData.bed_number_c
        }]
      };

      const response = await apperClient.createRecord('patient_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} patients:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating patient:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, patientData) {
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
      if (patientData.Name !== undefined) updateData.Name = patientData.Name;
      if (patientData.first_name_c !== undefined) updateData.first_name_c = patientData.first_name_c;
      if (patientData.last_name_c !== undefined) updateData.last_name_c = patientData.last_name_c;
      if (patientData.date_of_birth_c !== undefined) updateData.date_of_birth_c = patientData.date_of_birth_c;
      if (patientData.gender_c !== undefined) updateData.gender_c = patientData.gender_c;
      if (patientData.phone_c !== undefined) updateData.phone_c = patientData.phone_c;
      if (patientData.email_c !== undefined) updateData.email_c = patientData.email_c;
      if (patientData.address_c !== undefined) updateData.address_c = patientData.address_c;
      if (patientData.emergency_contact_c !== undefined) updateData.emergency_contact_c = patientData.emergency_contact_c;
      if (patientData.blood_type_c !== undefined) updateData.blood_type_c = patientData.blood_type_c;
      if (patientData.allergies_c !== undefined) updateData.allergies_c = patientData.allergies_c;
      if (patientData.current_status_c !== undefined) updateData.current_status_c = patientData.current_status_c;
      if (patientData.admission_date_c !== undefined) updateData.admission_date_c = patientData.admission_date_c;
      if (patientData.bed_number_c !== undefined) updateData.bed_number_c = patientData.bed_number_c;

      const params = { records: [updateData] };
      const response = await apperClient.updateRecord('patient_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} patients:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating patient:", error?.response?.data?.message || error);
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
      const response = await apperClient.deleteRecord('patient_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} patients:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting patient:", error?.response?.data?.message || error);
      return false;
    }
  },

  async searchPatients(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {"fieldName": "first_name_c", "operator": "Contains", "values": [query]}
              ]
            },
            {
              conditions: [
                {"fieldName": "last_name_c", "operator": "Contains", "values": [query]}
              ]
            },
            {
              conditions: [
                {"fieldName": "phone_c", "operator": "Contains", "values": [query]}
              ]
            },
            {
              conditions: [
                {"fieldName": "email_c", "operator": "Contains", "values": [query]}
              ]
            }
          ]
        }]
      };

      const response = await apperClient.fetchRecords('patient_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching patients:", error?.response?.data?.message || error);
return [];
    }
  }
};