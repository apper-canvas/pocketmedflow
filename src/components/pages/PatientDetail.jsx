import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { patientService } from "@/services/api/patientService";
import { medicalRecordService } from "@/services/api/medicalRecordService";
import { appointmentService } from "@/services/api/appointmentService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const loadPatientData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [patientData, recordsData, appointmentsData] = await Promise.all([
        patientService.getById(id),
        medicalRecordService.getByPatientId(id),
        appointmentService.getAll()
      ]);
      
      setPatient(patientData);
      setMedicalRecords(recordsData);
      setAppointments(appointmentsData.filter(app => app.patientId === id));
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load patient details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatientData();
  }, [id]);

  if (loading) return <Loading rows={4} />;
  if (error) return <Error message={error} onRetry={loadPatientData} />;
  if (!patient) return <Error message="Patient not found" onRetry={() => navigate("/patients")} />;

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Critical": return "critical";
      case "Urgent": return "urgent";
      case "Stable": return "stable";
      case "Discharged": return "discharged";
      default: return "default";
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "User" },
    { id: "medical", label: "Medical Records", icon: "FileText" },
    { id: "appointments", label: "Appointments", icon: "Calendar" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate("/patients")}>
          <ApperIcon name="ArrowLeft" size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            {patient.firstName} {patient.lastName}
          </h1>
          <p className="text-secondary-600 mt-2">Patient ID: {patient.Id}</p>
        </div>
        <Badge variant={getStatusBadgeVariant(patient.currentStatus)}>
          {patient.currentStatus}
        </Badge>
      </div>

      {/* Patient Summary Card */}
      <Card gradient className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Patient</p>
              <p className="text-xl font-bold text-secondary-900">
                {patient.firstName} {patient.lastName}
              </p>
              <p className="text-sm text-secondary-600">{patient.gender}, {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-secondary-500">Blood Type</p>
            <p className="text-2xl font-bold text-error-600">{patient.bloodType}</p>
            <p className="text-sm text-secondary-600">Critical Info</p>
          </div>
          
          <div>
            <p className="text-sm text-secondary-500">Current Bed</p>
            <p className="text-2xl font-bold text-secondary-900">
              {patient.bedNumber || "N/A"}
            </p>
            <p className="text-sm text-secondary-600">Room Assignment</p>
          </div>
          
          <div>
            <p className="text-sm text-secondary-500">Admission Date</p>
            <p className="text-lg font-bold text-secondary-900">
              {format(new Date(patient.admissionDate), "MMM dd, yyyy")}
            </p>
            <p className="text-sm text-secondary-600">
              {Math.floor((new Date() - new Date(patient.admissionDate)) / (1000 * 60 * 60 * 24))} days ago
            </p>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <Card className="p-1">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex-1"
            >
              <ApperIcon name={tab.icon} size={16} className="mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card gradient>
            <h3 className="text-xl font-semibold text-secondary-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-secondary-500">Date of Birth</p>
                  <p className="font-medium text-secondary-900">
                    {format(new Date(patient.dateOfBirth), "MMMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Gender</p>
                  <p className="font-medium text-secondary-900">{patient.gender}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-secondary-500">Phone</p>
                <p className="font-medium text-secondary-900">{patient.phone}</p>
              </div>
              
              <div>
                <p className="text-sm text-secondary-500">Email</p>
                <p className="font-medium text-secondary-900">{patient.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-secondary-500">Address</p>
                <p className="font-medium text-secondary-900">{patient.address}</p>
              </div>
              
              <div>
                <p className="text-sm text-secondary-500">Emergency Contact</p>
                <p className="font-medium text-secondary-900">{patient.emergencyContact}</p>
              </div>
            </div>
          </Card>

          <Card gradient>
            <h3 className="text-xl font-semibold text-secondary-900 mb-4">Medical Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-secondary-500">Blood Type</p>
                <p className="text-2xl font-bold text-error-600">{patient.bloodType}</p>
              </div>
              
              <div>
                <p className="text-sm text-secondary-500">Known Allergies</p>
                {patient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {patient.allergies.map((allergy, index) => (
                      <Badge key={index} variant="urgent">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="font-medium text-success-600">No known allergies</p>
                )}
              </div>
              
              <div>
                <p className="text-sm text-secondary-500">Current Status</p>
                <Badge variant={getStatusBadgeVariant(patient.currentStatus)} className="mt-2">
                  {patient.currentStatus}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "medical" && (
        <Card gradient>
          <h3 className="text-xl font-semibold text-secondary-900 mb-6">Medical Records</h3>
          {medicalRecords.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="FileText" size={48} className="mx-auto text-secondary-400 mb-4" />
              <p className="text-secondary-600">No medical records found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {medicalRecords.map((record) => (
                <div key={record.Id} className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-secondary-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-secondary-900">{record.diagnosis}</h4>
                      <p className="text-sm text-secondary-600">
                        {format(new Date(record.visitDate), "MMMM dd, yyyy")}
                      </p>
                    </div>
                    <Badge variant="default">Dr. ID: {record.doctorId}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-secondary-700">Treatment:</p>
                      <p className="text-sm text-secondary-600">{record.treatment}</p>
                    </div>
                    
                    {record.prescriptions.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-secondary-700">Prescriptions:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {record.prescriptions.map((prescription, index) => (
                            <Badge key={index} variant="default">
                              {prescription}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {record.notes && (
                      <div>
                        <p className="text-sm font-medium text-secondary-700">Notes:</p>
                        <p className="text-sm text-secondary-600">{record.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === "appointments" && (
        <Card gradient>
          <h3 className="text-xl font-semibold text-secondary-900 mb-6">Appointments</h3>
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="Calendar" size={48} className="mx-auto text-secondary-400 mb-4" />
              <p className="text-secondary-600">No appointments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.Id} className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-secondary-100">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary-600">{appointment.time}</p>
                        <p className="text-sm text-secondary-500">{appointment.duration}min</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900">{appointment.reason}</h4>
                        <p className="text-sm text-secondary-600">
                          {format(new Date(appointment.date), "MMMM dd, yyyy")}
                        </p>
                        <p className="text-sm text-secondary-600">Dr. ID: {appointment.doctorId}</p>
                      </div>
                    </div>
                    <Badge variant={
                      appointment.status === "Completed" ? "stable" :
                      appointment.status === "In Progress" ? "urgent" :
                      appointment.status === "Cancelled" ? "discharged" : "default"
                    }>
                      {appointment.status}
                    </Badge>
                  </div>
                  
                  {appointment.notes && (
                    <div className="mt-3 pt-3 border-t border-secondary-100">
                      <p className="text-sm text-secondary-600">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default PatientDetail;