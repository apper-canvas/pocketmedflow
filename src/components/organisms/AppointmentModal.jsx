import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { appointmentService } from "@/services/api/appointmentService";
import { toast } from "react-toastify";

const AppointmentModal = ({ onClose, onAppointmentCreated, patients, doctors, selectedDate }) => {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: selectedDate,
    time: "",
    duration: "30",
    reason: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.patientId) newErrors.patientId = "Patient is required";
    if (!formData.doctorId) newErrors.doctorId = "Doctor is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.reason.trim()) newErrors.reason = "Reason is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const newAppointment = await appointmentService.create(formData);
      onAppointmentCreated(newAppointment);
    } catch (err) {
      toast.error("Failed to schedule appointment");
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [];
  for (let hour = 8; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      timeSlots.push(timeString);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">Schedule Appointment</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Patient" required error={errors.patientId}>
              <Select
                value={formData.patientId}
                onChange={(e) => handleChange("patientId", e.target.value)}
                error={errors.patientId}
              >
                <option value="">Select patient</option>
                {patients.map((patient) => (
                  <option key={patient.Id} value={patient.Id}>
                    {patient.firstName} {patient.lastName} (ID: {patient.Id})
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Doctor" required error={errors.doctorId}>
              <Select
                value={formData.doctorId}
                onChange={(e) => handleChange("doctorId", e.target.value)}
                error={errors.doctorId}
              >
                <option value="">Select doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.Id} value={doctor.Id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Date" required error={errors.date}>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                error={errors.date}
              />
            </FormField>

            <FormField label="Time" required error={errors.time}>
              <Select
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                error={errors.time}
              >
                <option value="">Select time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </Select>
            </FormField>

            <FormField label="Duration (minutes)">
              <Select
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Reason for Visit" required error={errors.reason}>
            <Input
              value={formData.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
              error={errors.reason}
              placeholder="Follow-up consultation, routine checkup, etc."
            />
          </FormField>

          <FormField label="Notes">
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Additional notes or special instructions..."
              className="w-full px-3 py-2.5 border border-secondary-200 rounded-lg text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors duration-200 resize-none"
              rows="3"
            />
          </FormField>

          <div className="flex justify-end space-x-4 pt-4 border-t border-secondary-200">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <ApperIcon name="Calendar" size={16} className="mr-2" />
                  Schedule Appointment
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AppointmentModal;