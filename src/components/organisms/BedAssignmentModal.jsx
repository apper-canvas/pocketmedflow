import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { bedService } from "@/services/api/bedService";
import { toast } from "react-toastify";

const BedAssignmentModal = ({ onClose, onBedAssigned, bed, availablePatients }) => {
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPatientId) {
      setError("Please select a patient");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const updatedBed = await bedService.assignPatient(bed.Id, selectedPatientId);
      onBedAssigned(updatedBed);
    } catch (err) {
      setError("Failed to assign bed");
      toast.error("Failed to assign bed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">Assign Bed</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {bed && (
            <div className="p-4 bg-secondary-50 rounded-lg">
              <h3 className="font-semibold text-secondary-900 mb-2">Bed Information</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-secondary-500">Number:</span> {bed.number}</p>
                <p><span className="text-secondary-500">Type:</span> {bed.roomType}</p>
                <p><span className="text-secondary-500">Floor:</span> {bed.floor}</p>
                <p><span className="text-secondary-500">Assigned Nurse:</span> {bed.assignedNurse}</p>
              </div>
            </div>
          )}

          <FormField label="Select Patient" required error={error}>
            <Select
              value={selectedPatientId}
              onChange={(e) => {
                setSelectedPatientId(e.target.value);
                setError("");
              }}
              error={error}
            >
              <option value="">Choose a patient</option>
              {availablePatients.map((patient) => (
                <option key={patient.Id} value={patient.Id}>
                  {patient.firstName} {patient.lastName} - {patient.currentStatus} (ID: {patient.Id})
                </option>
              ))}
            </Select>
          </FormField>

          {availablePatients.length === 0 && (
            <div className="text-center py-4 text-secondary-600">
              <ApperIcon name="Users" size={32} className="mx-auto mb-2 text-secondary-400" />
              <p>No available patients to assign</p>
              <p className="text-sm text-secondary-500">All patients are already assigned to beds</p>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4 border-t border-secondary-200">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading || !selectedPatientId || availablePatients.length === 0}
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <ApperIcon name="Bed" size={16} className="mr-2" />
                  Assign Bed
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BedAssignmentModal;