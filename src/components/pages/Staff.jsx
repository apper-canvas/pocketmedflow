import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { doctorService } from "@/services/api/doctorService";
import { patientService } from "@/services/api/patientService";
import { toast } from "react-toastify";

const Staff = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [viewMode, setViewMode] = useState("cards");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [doctorsData, patientsData] = await Promise.all([
        doctorService.getAll(),
        patientService.getAll()
      ]);
      
      setDoctors(doctorsData);
      setPatients(patientsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load staff information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.phone.includes(searchTerm) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specialtyFilter !== "All") {
      filtered = filtered.filter(doctor => doctor.specialty === specialtyFilter);
    }

    setFilteredDoctors(filtered);
  }, [doctors, searchTerm, specialtyFilter]);

  const specialties = [...new Set(doctors.map(d => d.specialty))].sort();

  const getTodaySchedule = (doctor) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return doctor.schedule.includes(today);
  };

  const getDoctorPatients = (doctorId) => {
    return patients.filter(p => 
      doctors.find(d => d.Id === doctorId)?.currentPatients.includes(p.Id)
    );
  };

  if (loading) return <Loading rows={5} />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Medical Staff
          </h1>
          <p className="text-secondary-600 mt-2">Manage doctor schedules and assignments</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex rounded-lg border border-secondary-200">
            <Button
              variant={viewMode === "cards" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="rounded-r-none border-0"
            >
              <ApperIcon name="Grid3x3" size={16} />
            </Button>
            <Button
              variant={viewMode === "schedule" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("schedule")}
              className="rounded-l-none border-0"
            >
              <ApperIcon name="Calendar" size={16} />
            </Button>
          </div>
          <Button variant="primary">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Doctor
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search by name, specialty, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="All">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Staff Display */}
      {filteredDoctors.length === 0 ? (
        <Empty
          icon="Stethoscope"
          title="No staff found"
          description={searchTerm || specialtyFilter !== "All" ? "Try adjusting your search or filters." : "No medical staff information available."}
        />
      ) : viewMode === "cards" ? (
        // Cards View
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => {
            const doctorPatients = getDoctorPatients(doctor.Id);
            const isOnDuty = getTodaySchedule(doctor);
            
            return (
              <Card key={doctor.Id} hover gradient className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                      <ApperIcon name="Stethoscope" size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-primary-600 font-medium">
                        {doctor.specialty}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${isOnDuty ? 'bg-success-500' : 'bg-secondary-400'}`}></div>
                        <span className="text-xs text-secondary-600">
                          {isOnDuty ? "On Duty" : "Off Duty"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Badge variant={isOnDuty ? "stable" : "default"}>
                    {isOnDuty ? "Available" : "Off Duty"}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-secondary-500">Current Patients</p>
                      <p className="font-semibold text-secondary-900">{doctorPatients.length}</p>
                    </div>
                    <div>
                      <p className="text-secondary-500">Schedule Days</p>
                      <p className="font-semibold text-secondary-900">{doctor.schedule.length}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-secondary-500 mb-1">Contact</p>
                    <p className="text-sm font-medium text-secondary-900">{doctor.phone}</p>
                    <p className="text-sm text-secondary-600">{doctor.email}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-secondary-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-secondary-500">Weekly Schedule</p>
                      <div className="flex space-x-1 mt-1">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                          const fullDay = {
                            "Mon": "Monday",
                            "Tue": "Tuesday", 
                            "Wed": "Wednesday",
                            "Thu": "Thursday",
                            "Fri": "Friday",
                            "Sat": "Saturday",
                            "Sun": "Sunday"
                          }[day];
                          const isScheduled = doctor.schedule.includes(fullDay);
                          
                          return (
                            <div
                              key={day}
                              className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                                isScheduled ? 'bg-primary-500 text-white' : 'bg-secondary-200 text-secondary-500'
                              }`}
                            >
                              {day[0]}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="Phone" size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="Mail" size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>

                {doctorPatients.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-secondary-100">
                    <p className="text-sm text-secondary-500 mb-2">Current Patients</p>
                    <div className="space-y-1">
                      {doctorPatients.slice(0, 3).map((patient) => (
                        <div key={patient.Id} className="flex items-center justify-between text-sm">
                          <span className="text-secondary-900">
                            {patient.firstName} {patient.lastName}
                          </span>
                          <Badge variant={
                            patient.currentStatus === "Critical" ? "critical" :
                            patient.currentStatus === "Urgent" ? "urgent" : "stable"
                          } className="text-xs">
                            {patient.currentStatus}
                          </Badge>
                        </div>
                      ))}
                      {doctorPatients.length > 3 && (
                        <p className="text-xs text-secondary-500">
                          +{doctorPatients.length - 3} more patients
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        // Schedule View
        <Card gradient>
          <h3 className="text-xl font-semibold text-secondary-900 mb-6">Weekly Schedule</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="text-left py-3 px-4 font-semibold text-secondary-900">Doctor</th>
                  <th className="text-center py-3 px-2 font-semibold text-secondary-900">Mon</th>
                  <th className="text-center py-3 px-2 font-semibold text-secondary-900">Tue</th>
                  <th className="text-center py-3 px-2 font-semibold text-secondary-900">Wed</th>
                  <th className="text-center py-3 px-2 font-semibold text-secondary-900">Thu</th>
                  <th className="text-center py-3 px-2 font-semibold text-secondary-900">Fri</th>
                  <th className="text-center py-3 px-2 font-semibold text-secondary-900">Sat</th>
                  <th className="text-center py-3 px-2 font-semibold text-secondary-900">Sun</th>
                  <th className="text-center py-3 px-4 font-semibold text-secondary-900">Patients</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor) => {
                  const doctorPatients = getDoctorPatients(doctor.Id);
                  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                  
                  return (
                    <tr key={doctor.Id} className="border-b border-secondary-100 hover:bg-secondary-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-secondary-900">{doctor.name}</p>
                          <p className="text-sm text-primary-600">{doctor.specialty}</p>
                        </div>
                      </td>
                      {days.map((day) => (
                        <td key={day} className="text-center py-4 px-2">
                          {doctor.schedule.includes(day) ? (
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center">
                                <ApperIcon name="Check" size={14} className="text-white" />
                              </div>
                              <span className="text-xs text-success-600 mt-1">
                                {doctor.availability[day] ? `${doctor.availability[day][0]}-${doctor.availability[day][1]}` : ""}
                              </span>
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-secondary-200 rounded-full flex items-center justify-center mx-auto">
                              <ApperIcon name="X" size={14} className="text-secondary-500" />
                            </div>
                          )}
                        </td>
                      ))}
                      <td className="text-center py-4 px-4">
                        <Badge variant="default">{doctorPatients.length}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Staff;