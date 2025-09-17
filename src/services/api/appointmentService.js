import { toast } from 'react-toastify';

export const appointmentService = {
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
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('appointment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching appointments:", error?.response?.data?.message || error);
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
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}}
        ]
      };

      const response = await apperClient.getRecordById('appointment_c', id, params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(appointmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `Appointment - ${appointmentData.reason_c || ""}`,
          date_c: appointmentData.date_c,
          time_c: appointmentData.time_c,
          duration_c: appointmentData.duration_c ? parseInt(appointmentData.duration_c) : 30,
          reason_c: appointmentData.reason_c,
          status_c: appointmentData.status_c || "Scheduled",
          notes_c: appointmentData.notes_c,
          patient_id_c: appointmentData.patient_id_c ? parseInt(appointmentData.patient_id_c) : null,
          doctor_id_c: appointmentData.doctor_id_c ? parseInt(appointmentData.doctor_id_c) : null
        }]
      };

      const response = await apperClient.createRecord('appointment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} appointments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating appointment:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, appointmentData) {
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
      if (appointmentData.Name !== undefined) updateData.Name = appointmentData.Name;
      if (appointmentData.date_c !== undefined) updateData.date_c = appointmentData.date_c;
      if (appointmentData.time_c !== undefined) updateData.time_c = appointmentData.time_c;
      if (appointmentData.duration_c !== undefined) updateData.duration_c = appointmentData.duration_c ? parseInt(appointmentData.duration_c) : null;
      if (appointmentData.reason_c !== undefined) updateData.reason_c = appointmentData.reason_c;
      if (appointmentData.status_c !== undefined) updateData.status_c = appointmentData.status_c;
      if (appointmentData.notes_c !== undefined) updateData.notes_c = appointmentData.notes_c;
      if (appointmentData.patient_id_c !== undefined) updateData.patient_id_c = appointmentData.patient_id_c ? parseInt(appointmentData.patient_id_c) : null;
      if (appointmentData.doctor_id_c !== undefined) updateData.doctor_id_c = appointmentData.doctor_id_c ? parseInt(appointmentData.doctor_id_c) : null;

      const params = { records: [updateData] };
      const response = await apperClient.updateRecord('appointment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} appointments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating appointment:", error?.response?.data?.message || error);
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
      const response = await apperClient.deleteRecord('appointment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} appointments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting appointment:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getByDate(date) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}}
        ],
        where: [
          {"FieldName": "date_c", "Operator": "EqualTo", "Values": [date]}
        ]
      };

      const response = await apperClient.fetchRecords('appointment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching appointments for date ${date}:`, error?.response?.data?.message || error);
      return [];
    }
  },

  async getByDoctor(doctorId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}}
        ],
        where: [
          {"FieldName": "doctor_id_c", "Operator": "EqualTo", "Values": [parseInt(doctorId)]}
        ]
      };

      const response = await apperClient.fetchRecords('appointment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching appointments for doctor ${doctorId}:`, error?.response?.data?.message || error);
      return [];
    }
  }
};