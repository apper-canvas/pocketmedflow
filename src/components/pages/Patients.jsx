import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import PatientModal from "@/components/organisms/PatientModal";
import { patientService } from "@/services/api/patientService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await patientService.getAll();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter(patient => patient.currentStatus === statusFilter);
    }

    setFilteredPatients(filtered);
  }, [patients, searchTerm, statusFilter]);

  const handlePatientCreated = (newPatient) => {
    setPatients(prev => [newPatient, ...prev]);
    setShowModal(false);
    toast.success("Patient registered successfully");
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Critical": return "critical";
      case "Urgent": return "urgent";
      case "Stable": return "stable";
      case "Discharged": return "discharged";
      default: return "default";
    }
  };

  if (loading) return <Loading rows={6} />;
  if (error) return <Error message={error} onRetry={loadPatients} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Patients
          </h1>
          <p className="text-secondary-600 mt-2">Manage patient records and information</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search patients by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["All", "Critical", "Urgent", "Stable", "Discharged"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "primary" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Patients List */}
      {filteredPatients.length === 0 ? (
        <Empty
          icon="Users"
          title="No patients found"
          description={searchTerm || statusFilter !== "All" ? "Try adjusting your search or filters." : "Get started by registering your first patient."}
          actionLabel="Add Patient"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid gap-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.Id} hover className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-secondary-600 mt-1">
                      <span>ID: {patient.Id}</span>
                      <span>{patient.gender}</span>
                      <span>Born: {format(new Date(patient.dateOfBirth), "MMM dd, yyyy")}</span>
                      {patient.bedNumber && <span>Bed: {patient.bedNumber}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge variant={getStatusBadgeVariant(patient.currentStatus)}>
                      {patient.currentStatus}
                    </Badge>
                    <p className="text-xs text-secondary-500 mt-1">
                      Blood Type: {patient.bloodType}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/patients/${patient.Id}`)}
                    >
                      <ApperIcon name="Eye" size={16} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Phone" size={16} />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-secondary-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-secondary-500">Contact</p>
                    <p className="font-medium text-secondary-900">{patient.phone}</p>
                    <p className="text-secondary-600">{patient.email}</p>
                  </div>
                  <div>
                    <p className="text-secondary-500">Emergency Contact</p>
                    <p className="font-medium text-secondary-900">{patient.emergencyContact}</p>
                  </div>
                  <div>
                    <p className="text-secondary-500">Allergies</p>
                    <p className="font-medium text-secondary-900">
                      {patient.allergies.length > 0 ? patient.allergies.join(", ") : "None"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Patient Registration Modal */}
      {showModal && (
        <PatientModal
          onClose={() => setShowModal(false)}
          onPatientCreated={handlePatientCreated}
        />
      )}
    </div>
  );
};

export default Patients;