import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import AppointmentModal from "@/components/organisms/AppointmentModal";
import { appointmentService } from "@/services/api/appointmentService";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";
import { toast } from "react-toastify";
import { format, addDays, startOfWeek } from "date-fns";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("day"); // day, week

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [appointmentsData, patientsData, doctorsData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        doctorService.getAll()
      ]);
      
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = appointments;

    // Filter by date or week
    if (viewMode === "day") {
      filtered = filtered.filter(app => app.date === selectedDate);
    } else {
      const weekStart = startOfWeek(new Date(selectedDate));
      const weekEnd = addDays(weekStart, 6);
      filtered = filtered.filter(app => {
        const appDate = new Date(app.date);
        return appDate >= weekStart && appDate <= weekEnd;
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app => {
        const patient = patients.find(p => p.Id === parseInt(app.patientId));
        const doctor = doctors.find(d => d.Id === parseInt(app.doctorId));
        return (
          app.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (patient && `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (doctor && doctor.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Sort by time
    filtered.sort((a, b) => {
      if (a.date !== b.date) {
        return new Date(a.date) - new Date(b.date);
      }
      return a.time.localeCompare(b.time);
    });

    setFilteredAppointments(filtered);
  }, [appointments, patients, doctors, searchTerm, statusFilter, selectedDate, viewMode]);

  const handleAppointmentCreated = (newAppointment) => {
    setAppointments(prev => [newAppointment, ...prev]);
    setShowModal(false);
    toast.success("Appointment scheduled successfully");
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Completed": return "stable";
      case "In Progress": return "urgent";
      case "Cancelled": return "discharged";
      case "Scheduled": return "default";
      default: return "default";
    }
  };

  const getWeekDates = () => {
    const start = startOfWeek(new Date(selectedDate));
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  if (loading) return <Loading rows={5} />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Appointments
          </h1>
          <p className="text-secondary-600 mt-2">Schedule and manage patient appointments</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex rounded-lg border border-secondary-200">
            <Button
              variant={viewMode === "day" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("day")}
              className="rounded-r-none border-0"
            >
              Day
            </Button>
            <Button
              variant={viewMode === "week" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("week")}
              className="rounded-l-none border-0"
            >
              Week
            </Button>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Schedule Appointment
          </Button>
        </div>
      </div>

      {/* Filters and Date Navigation */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(
                viewMode === "day" 
                  ? format(addDays(new Date(selectedDate), -1), "yyyy-MM-dd")
                  : format(addDays(new Date(selectedDate), -7), "yyyy-MM-dd")
              )}
            >
              <ApperIcon name="ChevronLeft" size={16} />
            </Button>
            
            <div className="text-center min-w-[200px]">
              <p className="font-semibold text-secondary-900">
                {viewMode === "day" 
                  ? format(new Date(selectedDate), "MMMM dd, yyyy")
                  : `${format(startOfWeek(new Date(selectedDate)), "MMM dd")} - ${format(addDays(startOfWeek(new Date(selectedDate)), 6), "MMM dd, yyyy")}`
                }
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(
                viewMode === "day"
                  ? format(addDays(new Date(selectedDate), 1), "yyyy-MM-dd")
                  : format(addDays(new Date(selectedDate), 7), "yyyy-MM-dd")
              )}
            >
              <ApperIcon name="ChevronRight" size={16} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
            >
              Today
            </Button>
          </div>
          
          <div className="flex-1">
            <SearchBar
              placeholder="Search by patient, doctor, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            {["All", "Scheduled", "In Progress", "Completed", "Cancelled"].map((status) => (
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

      {/* Appointments View */}
      {viewMode === "week" ? (
        // Week View
        <div className="grid grid-cols-7 gap-2">
          {getWeekDates().map((date, index) => (
            <Card key={index} className="p-3 min-h-[200px]">
              <div className="text-center mb-3">
                <p className="text-sm font-medium text-secondary-900">
                  {format(date, "EEE")}
                </p>
                <p className="text-xs text-secondary-600">
                  {format(date, "MMM dd")}
                </p>
              </div>
              <div className="space-y-1">
                {appointments
                  .filter(app => app.date === format(date, "yyyy-MM-dd"))
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .slice(0, 3)
                  .map((app) => {
                    const patient = patients.find(p => p.Id === parseInt(app.patientId));
                    return (
                      <div key={app.Id} className="p-2 bg-gradient-to-r from-primary-50 to-accent-50 rounded text-xs">
                        <p className="font-medium text-primary-700">{app.time}</p>
                        <p className="text-secondary-600 truncate">
                          {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown"}
                        </p>
                      </div>
                    );
                  })}
                {appointments.filter(app => app.date === format(date, "yyyy-MM-dd")).length > 3 && (
                  <p className="text-xs text-secondary-500 text-center">
                    +{appointments.filter(app => app.date === format(date, "yyyy-MM-dd")).length - 3} more
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        // Day View
        filteredAppointments.length === 0 ? (
          <Empty
            icon="Calendar"
            title="No appointments found"
            description={searchTerm || statusFilter !== "All" ? "Try adjusting your search or filters." : "No appointments scheduled for this day."}
            actionLabel="Schedule Appointment"
            onAction={() => setShowModal(true)}
          />
        ) : (
          <div className="grid gap-4">
            {filteredAppointments.map((appointment) => {
              const patient = patients.find(p => p.Id === parseInt(appointment.patientId));
              const doctor = doctors.find(d => d.Id === parseInt(appointment.doctorId));
              
              return (
                <Card key={appointment.Id} hover className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center min-w-[80px]">
                        <p className="text-2xl font-bold text-primary-600">{appointment.time}</p>
                        <p className="text-sm text-secondary-500">{appointment.duration}min</p>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-secondary-900">
                          {appointment.reason}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-secondary-600 mt-1">
                          <span className="flex items-center">
                            <ApperIcon name="User" size={14} className="mr-1" />
                            {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient"}
                          </span>
                          <span className="flex items-center">
                            <ApperIcon name="Stethoscope" size={14} className="mr-1" />
                            {doctor ? doctor.name : "Unknown Doctor"}
                          </span>
                          <span className="flex items-center">
                            <ApperIcon name="Calendar" size={14} className="mr-1" />
                            {format(new Date(appointment.date), "MMM dd, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Badge variant={getStatusBadgeVariant(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Phone" size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="MoreVertical" size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {appointment.notes && (
                    <div className="mt-4 pt-4 border-t border-secondary-100">
                      <p className="text-sm text-secondary-600">
                        <span className="font-medium">Notes:</span> {appointment.notes}
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )
      )}

      {/* Appointment Modal */}
      {showModal && (
        <AppointmentModal
          onClose={() => setShowModal(false)}
          onAppointmentCreated={handleAppointmentCreated}
          patients={patients}
          doctors={doctors}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default Appointments;