import { toast } from "react-toastify";
import React from "react";

export const medicalRecordService = {
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
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "visit_date_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "treatment_c"}},
          {"field": {"Name": "prescriptions_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "follow_up_date_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('medical_record_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching medical records:", error?.response?.data?.message || error);
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
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "visit_date_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "treatment_c"}},
          {"field": {"Name": "prescriptions_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "follow_up_date_c"}}
        ]
      };

      const response = await apperClient.getRecordById('medical_record_c', id, params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching medical record ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByPatientId(patientId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "visit_date_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "treatment_c"}},
          {"field": {"Name": "prescriptions_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "follow_up_date_c"}}
        ],
        where: [
          {"FieldName": "patient_id_c", "Operator": "EqualTo", "Values": [parseInt(patientId)]}
        ]
      };

      const response = await apperClient.fetchRecords('medical_record_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching medical records for patient ${patientId}:`, error?.response?.data?.message || error);
      return [];
    }
  },

  async create(recordData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: recordData.diagnosis_c || `Medical Record - ${new Date().toLocaleDateString()}`,
          patient_id_c: recordData.patient_id_c ? parseInt(recordData.patient_id_c) : null,
          visit_date_c: recordData.visit_date_c || new Date().toISOString().split("T")[0],
          doctor_id_c: recordData.doctor_id_c ? parseInt(recordData.doctor_id_c) : null,
          diagnosis_c: recordData.diagnosis_c,
          treatment_c: recordData.treatment_c,
          prescriptions_c: recordData.prescriptions_c,
          notes_c: recordData.notes_c,
          follow_up_date_c: recordData.follow_up_date_c
        }]
      };

      const response = await apperClient.createRecord('medical_record_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} medical records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating medical record:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, recordData) {
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
      if (recordData.Name !== undefined) updateData.Name = recordData.Name;
      if (recordData.patient_id_c !== undefined) updateData.patient_id_c = recordData.patient_id_c ? parseInt(recordData.patient_id_c) : null;
      if (recordData.visit_date_c !== undefined) updateData.visit_date_c = recordData.visit_date_c;
      if (recordData.doctor_id_c !== undefined) updateData.doctor_id_c = recordData.doctor_id_c ? parseInt(recordData.doctor_id_c) : null;
      if (recordData.diagnosis_c !== undefined) updateData.diagnosis_c = recordData.diagnosis_c;
      if (recordData.treatment_c !== undefined) updateData.treatment_c = recordData.treatment_c;
      if (recordData.prescriptions_c !== undefined) updateData.prescriptions_c = recordData.prescriptions_c;
      if (recordData.notes_c !== undefined) updateData.notes_c = recordData.notes_c;
      if (recordData.follow_up_date_c !== undefined) updateData.follow_up_date_c = recordData.follow_up_date_c;

      const params = { records: [updateData] };
      const response = await apperClient.updateRecord('medical_record_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} medical records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating medical record:", error?.response?.data?.message || error);
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
      const response = await apperClient.deleteRecord('medical_record_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} medical records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting medical record:", error?.response?.data?.message || error);
return false;
    }
  }
};