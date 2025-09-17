import { toast } from 'react-toastify';

export const doctorService = {
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "specialty_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "availability_c"}},
          {"field": {"Name": "current_patients_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('doctor_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching doctors:", error?.response?.data?.message || error);
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "specialty_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "availability_c"}},
          {"field": {"Name": "current_patients_c"}}
        ]
      };

      const response = await apperClient.getRecordById('doctor_c', id, params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching doctor ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(doctorData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: doctorData.name_c || doctorData.Name,
          name_c: doctorData.name_c,
          specialty_c: doctorData.specialty_c,
          phone_c: doctorData.phone_c,
          email_c: doctorData.email_c,
          schedule_c: doctorData.schedule_c,
          availability_c: doctorData.availability_c,
          current_patients_c: doctorData.current_patients_c || ""
        }]
      };

      const response = await apperClient.createRecord('doctor_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} doctors:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating doctor:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, doctorData) {
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
      if (doctorData.Name !== undefined) updateData.Name = doctorData.Name;
      if (doctorData.name_c !== undefined) updateData.name_c = doctorData.name_c;
      if (doctorData.specialty_c !== undefined) updateData.specialty_c = doctorData.specialty_c;
      if (doctorData.phone_c !== undefined) updateData.phone_c = doctorData.phone_c;
      if (doctorData.email_c !== undefined) updateData.email_c = doctorData.email_c;
      if (doctorData.schedule_c !== undefined) updateData.schedule_c = doctorData.schedule_c;
      if (doctorData.availability_c !== undefined) updateData.availability_c = doctorData.availability_c;
      if (doctorData.current_patients_c !== undefined) updateData.current_patients_c = doctorData.current_patients_c;

      const params = { records: [updateData] };
      const response = await apperClient.updateRecord('doctor_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} doctors:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating doctor:", error?.response?.data?.message || error);
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
      const response = await apperClient.deleteRecord('doctor_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} doctors:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting doctor:", error?.response?.data?.message || error);
      return false;
    }
  }
};