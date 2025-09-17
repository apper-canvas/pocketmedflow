import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { patientService } from "@/services/api/patientService";
import { bedService } from "@/services/api/bedService";
import { appointmentService } from "@/services/api/appointmentService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [beds, setBeds] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [patientsData, bedsData, appointmentsData] = await Promise.all([
        patientService.getAll(),
        bedService.getAll(),
        appointmentService.getAll()
      ]);
      
      setPatients(patientsData);
      setBeds(bedsData);
      setAppointments(appointmentsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading rows={4} />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const stats = {
    totalPatients: patients.length,
    criticalPatients: patients.filter(p => p.currentStatus === "Critical").length,
    occupiedBeds: beds.filter(b => b.status === "Occupied").length,
    todayAppointments: appointments.filter(a => a.date === new Date().toISOString().split("T")[0]).length
  };

  const criticalPatients = patients.filter(p => p.currentStatus === "Critical");
  const urgentPatients = patients.filter(p => p.currentStatus === "Urgent");
  const todayAppointments = appointments.filter(a => a.date === new Date().toISOString().split("T")[0]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Hospital Dashboard
          </h1>
          <p className="text-secondary-600 mt-2">Monitor hospital operations and patient status</p>
        </div>
        <Button variant="primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Quick Actions
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon="Users"
          change="+5 this week"
          changeType="positive"
          gradient
        />
        <StatCard
          title="Critical Patients"
          value={stats.criticalPatients}
          icon="AlertTriangle"
          change={stats.criticalPatients > 0 ? "Requires attention" : "All stable"}
          changeType={stats.criticalPatients > 0 ? "negative" : "positive"}
          gradient
        />
        <StatCard
          title="Occupied Beds"
          value={`${stats.occupiedBeds}/${beds.length}`}
          icon="Bed"
          change={`${Math.round((stats.occupiedBeds / beds.length) * 100)}% occupancy`}
          changeType="neutral"
          gradient
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon="Calendar"
          change="On schedule"
          changeType="positive"
          gradient
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Patients */}
        <Card gradient>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">Critical Patients</h2>
            <Badge variant="critical">{criticalPatients.length} Critical</Badge>
          </div>
          <div className="space-y-4">
            {criticalPatients.length === 0 ? (
              <div className="text-center py-8 text-secondary-500">
                <ApperIcon name="CheckCircle" size={32} className="mx-auto mb-3 text-success-500" />
                <p>No critical patients</p>
              </div>
            ) : (
              criticalPatients.slice(0, 5).map((patient) => (
                <div key={patient.Id} className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-secondary-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-error-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-secondary-900">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-sm text-secondary-600">Bed: {patient.bedNumber}</p>
                    </div>
                  </div>
                  <Badge variant="critical">Critical</Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Urgent Patients */}
        <Card gradient>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">Urgent Patients</h2>
            <Badge variant="urgent">{urgentPatients.length} Urgent</Badge>
          </div>
          <div className="space-y-4">
            {urgentPatients.length === 0 ? (
              <div className="text-center py-8 text-secondary-500">
                <ApperIcon name="Clock" size={32} className="mx-auto mb-3 text-secondary-400" />
                <p>No urgent patients</p>
              </div>
            ) : (
              urgentPatients.slice(0, 5).map((patient) => (
                <div key={patient.Id} className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-secondary-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-secondary-900">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-sm text-secondary-600">Bed: {patient.bedNumber}</p>
                    </div>
                  </div>
                  <Badge variant="urgent">Urgent</Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Today's Appointments */}
        <Card gradient className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">Today's Appointments</h2>
            <Badge variant="default">{todayAppointments.length} Scheduled</Badge>
          </div>
          <div className="space-y-4">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-secondary-500">
                <ApperIcon name="Calendar" size={32} className="mx-auto mb-3 text-secondary-400" />
                <p>No appointments scheduled for today</p>
              </div>
            ) : (
              todayAppointments.slice(0, 6).map((appointment) => {
                const patient = patients.find(p => p.Id === parseInt(appointment.patientId));
                return (
                  <div key={appointment.Id} className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-secondary-100">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-primary-600">{appointment.time}</p>
                        <p className="text-xs text-secondary-500">{appointment.duration}min</p>
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">
                          {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient"}
                        </p>
                        <p className="text-sm text-secondary-600">{appointment.reason}</p>
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
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* Bed Status Overview */}
      <Card gradient>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Bed Status Overview</h2>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success-500 rounded-full"></div>
              <span className="text-sm text-secondary-600">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error-500 rounded-full"></div>
              <span className="text-sm text-secondary-600">Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
              <span className="text-sm text-secondary-600">Maintenance</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-15 gap-2">
          {beds.slice(0, 30).map((bed) => (
            <div
              key={bed.Id}
              className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium text-white cursor-pointer transition-transform hover:scale-110 ${
                bed.status === "Available" ? "bg-success-500" :
                bed.status === "Occupied" ? "bg-error-500" :
                bed.status === "Maintenance" ? "bg-warning-500" :
                "bg-accent-500"
              }`}
              title={`${bed.number} - ${bed.status}${bed.patientId ? ` (Patient ID: ${bed.patientId})` : ""}`}
            >
              {bed.number.split("-")[1]}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;