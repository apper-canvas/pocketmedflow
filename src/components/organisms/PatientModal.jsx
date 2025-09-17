import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { patientService } from "@/services/api/patientService";
import { toast } from "react-toastify";

const PatientModal = ({ onClose, onPatientCreated }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    bloodType: "",
    allergies: ""
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
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.bloodType) newErrors.bloodType = "Blood type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const patientData = {
        ...formData,
        allergies: formData.allergies ? formData.allergies.split(",").map(a => a.trim()) : []
      };
      
      const newPatient = await patientService.create(patientData);
      onPatientCreated(newPatient);
    } catch (err) {
      toast.error("Failed to register patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">Register New Patient</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="First Name" required error={errors.firstName}>
              <Input
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                error={errors.firstName}
                placeholder="Enter first name"
              />
            </FormField>

            <FormField label="Last Name" required error={errors.lastName}>
              <Input
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                error={errors.lastName}
                placeholder="Enter last name"
              />
            </FormField>

            <FormField label="Date of Birth" required error={errors.dateOfBirth}>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                error={errors.dateOfBirth}
              />
            </FormField>

            <FormField label="Gender" required error={errors.gender}>
              <Select
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                error={errors.gender}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </FormField>

            <FormField label="Phone Number" required error={errors.phone}>
              <Input
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                error={errors.phone}
                placeholder="(555) 123-4567"
              />
            </FormField>

            <FormField label="Email" required error={errors.email}>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={errors.email}
                placeholder="patient@email.com"
              />
            </FormField>

            <FormField label="Blood Type" required error={errors.bloodType}>
              <Select
                value={formData.bloodType}
                onChange={(e) => handleChange("bloodType", e.target.value)}
                error={errors.bloodType}
              >
                <option value="">Select blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </Select>
            </FormField>

            <FormField label="Allergies">
              <Input
                value={formData.allergies}
                onChange={(e) => handleChange("allergies", e.target.value)}
                placeholder="Penicillin, Peanuts (comma-separated)"
              />
            </FormField>
          </div>

          <FormField label="Address">
            <Input
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="123 Main St, City, State 12345"
            />
          </FormField>

          <FormField label="Emergency Contact">
            <Input
              value={formData.emergencyContact}
              onChange={(e) => handleChange("emergencyContact", e.target.value)}
              placeholder="Jane Smith - (555) 123-4568"
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
                  Registering...
                </>
              ) : (
                <>
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Register Patient
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PatientModal;