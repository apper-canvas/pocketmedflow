import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { patientService } from "@/services/api/patientService";
import { appointmentService } from "@/services/api/appointmentService";
import { doctorService } from "@/services/api/doctorService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Emergency = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [patientsData, appointmentsData, doctorsData] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
        doctorService.getAll()
      ]);
      
      setPatients(patientsData);
      setAppointments(appointmentsData);
      setDoctors(doctorsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load emergency data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (patientId, newStatus) => {
    try {
      await patientService.update(patientId, { currentStatus: newStatus });
      setPatients(prev => prev.map(p => p.Id === patientId ? { ...p, currentStatus: newStatus } : p));
      toast.success("Patient status updated");
    } catch (err) {
      toast.error("Failed to update patient status");
    }
  };

  if (loading) return <Loading rows={4} />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Filter patients by priority
  const emergencyPatients = patients.filter(p => 
    p.currentStatus === "Critical" || p.currentStatus === "Urgent"
  );

  const filteredPatients = priorityFilter === "All" 
    ? emergencyPatients 
    : emergencyPatients.filter(p => p.currentStatus === priorityFilter);

  // Sort by priority (Critical first, then Urgent)
  const sortedPatients = filteredPatients.sort((a, b) => {
    const priorityOrder = { "Critical": 0, "Urgent": 1 };
    return priorityOrder[a.currentStatus] - priorityOrder[b.currentStatus];
  });

  // Get active emergency appointments
  const emergencyAppointments = appointments.filter(app => 
    app.status === "In Progress" && 
    patients.find(p => p.Id === parseInt(app.patientId) && 
    (p.currentStatus === "Critical" || p.currentStatus === "Urgent"))
  );

  // Get available emergency doctors
  const availableDoctors = doctors.filter(d => 
    d.specialty === "Emergency Medicine" && 
    getTodaySchedule(d)
  );

  function getTodaySchedule(doctor) {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return doctor.schedule.includes(today);
  }

  const stats = {
    critical: patients.filter(p => p.currentStatus === "Critical").length,
    urgent: patients.filter(p => p.currentStatus === "Urgent").length,
    inProgress: emergencyAppointments.length,
    availableDoctors: availableDoctors.length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-error-600 to-warning-600 bg-clip-text text-transparent">
            Emergency Department
          </h1>
          <p className="text-secondary-600 mt-2">Priority patient queue and emergency care coordination</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="danger">
            <ApperIcon name="AlertTriangle" size={16} className="mr-2" />
            Emergency Alert
          </Button>
          <Button variant="primary">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Emergency Admission
          </Button>
        </div>
      </div>

      {/* Emergency Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-l-4 border-l-error-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Critical Patients</p>
              <p className="text-3xl font-bold text-error-600 mt-2">{stats.critical}</p>
            </div>
            <div className="p-3 bg-error-100 rounded-full">
              <ApperIcon name="AlertTriangle" size={24} className="text-error-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-warning-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Urgent Patients</p>
              <p className="text-3xl font-bold text-warning-600 mt-2">{stats.urgent}</p>
            </div>
            <div className="p-3 bg-warning-100 rounded-full">
              <ApperIcon name="Clock" size={24} className="text-warning-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Active Cases</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">{stats.inProgress}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <ApperIcon name="Activity" size={24} className="text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-success-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Available Doctors</p>
              <p className="text-3xl font-bold text-success-600 mt-2">{stats.availableDoctors}</p>
            </div>
            <div className="p-3 bg-success-100 rounded-full">
              <ApperIcon name="UserCheck" size={24} className="text-success-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Priority Filter */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <p className="font-medium text-secondary-900">Filter by Priority:</p>
          <div className="flex space-x-2">
            {["All", "Critical", "Urgent"].map((priority) => (
              <Button
                key={priority}
                variant={priorityFilter === priority ? "primary" : "ghost"}
                size="sm"
                onClick={() => setPriorityFilter(priority)}
              >
                {priority}
              </Button>
            ))}
          </div>
          <div className="flex-1"></div>
          <Button variant="ghost" size="sm" onClick={loadData}>
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emergency Queue */}
        <div className="lg:col-span-2">
          <Card gradient>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">Emergency Queue</h2>
              <Badge variant="default">{sortedPatients.length} patients</Badge>
            </div>
            
            {sortedPatients.length === 0 ? (
              <Empty
                icon="Heart"
                title="No emergency patients"
                description="All patients are stable. Great work!"
                className="py-8"
              />
            ) : (
              <div className="space-y-4">
                {sortedPatients.map((patient, index) => (
                  <div
                    key={patient.Id}
                    className={`p-4 rounded-lg border-l-4 ${
                      patient.currentStatus === "Critical"
                        ? "bg-error-50 border-l-error-500"
                        : "bg-warning-50 border-l-warning-500"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-secondary-400">
                            #{index + 1}
                          </span>
                          <div className={`w-3 h-3 rounded-full ${
                            patient.currentStatus === "Critical" ? "bg-error-500" : "bg-warning-500"
                          } animate-pulse`}></div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-secondary-900">
                            {patient.firstName} {patient.lastName}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-secondary-600 mt-1">
                            <span>ID: {patient.Id}</span>
                            <span>{patient.gender}, {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years</span>
                            <span>Blood Type: {patient.bloodType}</span>
                            {patient.bedNumber && <span>Bed: {patient.bedNumber}</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge variant={patient.currentStatus === "Critical" ? "critical" : "urgent"}>
                          {patient.currentStatus}
                        </Badge>
                        
                        <div className="flex space-x-2">
                          <Button variant="success" size="sm">
                            <ApperIcon name="UserCheck" size={14} className="mr-1" />
                            Assign
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleStatusUpdate(patient.Id, "Stable")}
                          >
                            <ApperIcon name="CheckCircle" size={14} className="mr-1" />
                            Stabilize
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-secondary-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-secondary-500">Admission Time</p>
                          <p className="font-medium text-secondary-900">
                            {format(new Date(patient.admissionDate), "MMM dd, HH:mm")}
                          </p>
                        </div>
                        <div>
                          <p className="text-secondary-500">Allergies</p>
                          <p className="font-medium text-secondary-900">
                            {patient.allergies.length > 0 ? patient.allergies.join(", ") : "None"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Emergency Staff & Active Cases */}
        <div className="space-y-6">
          {/* Available Emergency Staff */}
          <Card gradient>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Emergency Staff</h3>
            {availableDoctors.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="UserX" size={32} className="mx-auto text-secondary-400 mb-3" />
                <p className="text-secondary-600">No emergency doctors available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableDoctors.map((doctor) => (
                  <div key={doctor.Id} className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                        <ApperIcon name="Stethoscope" size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">{doctor.name}</p>
                        <p className="text-sm text-secondary-600">{doctor.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span className="text-sm text-success-600">Available</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Active Emergency Cases */}
          <Card gradient>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Active Cases</h3>
            {emergencyAppointments.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Activity" size={32} className="mx-auto text-secondary-400 mb-3" />
                <p className="text-secondary-600">No active emergency cases</p>
              </div>
            ) : (
              <div className="space-y-3">
                {emergencyAppointments.map((appointment) => {
                  const patient = patients.find(p => p.Id === parseInt(appointment.patientId));
                  const doctor = doctors.find(d => d.Id === parseInt(appointment.doctorId));
                  
                  return (
                    <div key={appointment.Id} className="p-3 bg-white/60 backdrop-blur-sm rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-secondary-900">
                          {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient"}
                        </p>
                        <Badge variant="urgent">In Progress</Badge>
                      </div>
                      <div className="text-sm text-secondary-600">
                        <p>Doctor: {doctor ? doctor.name : "Unknown"}</p>
                        <p>Reason: {appointment.reason}</p>
                        <p>Started: {appointment.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Emergency Actions */}
          <Card gradient>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="danger" className="w-full justify-start">
                <ApperIcon name="AlertTriangle" size={16} className="mr-3" />
                Code Red Alert
              </Button>
              <Button variant="warning" className="w-full justify-start">
                <ApperIcon name="Siren" size={16} className="mr-3" />
                Mass Casualty Event
              </Button>
              <Button variant="primary" className="w-full justify-start">
                <ApperIcon name="Phone" size={16} className="mr-3" />
                Call All Staff
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <ApperIcon name="FileText" size={16} className="mr-3" />
                Emergency Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Emergency;