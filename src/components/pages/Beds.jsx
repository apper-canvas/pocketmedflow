import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import BedAssignmentModal from "@/components/organisms/BedAssignmentModal";
import { bedService } from "@/services/api/bedService";
import { patientService } from "@/services/api/patientService";
import { toast } from "react-toastify";

const Beds = () => {
  const [beds, setBeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filteredBeds, setFilteredBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [floorFilter, setFloorFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  const [showModal, setShowModal] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [bedsData, patientsData] = await Promise.all([
        bedService.getAll(),
        patientService.getAll()
      ]);
      
      setBeds(bedsData);
      setPatients(patientsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load bed information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = beds;

    if (searchTerm) {
      filtered = filtered.filter(bed => {
        const patient = patients.find(p => p.Id === parseInt(bed.patientId));
        return (
          bed.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bed.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bed.assignedNurse?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (patient && `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter(bed => bed.status === statusFilter);
    }

    if (floorFilter !== "All") {
      filtered = filtered.filter(bed => bed.floor === floorFilter);
    }

    setFilteredBeds(filtered);
  }, [beds, patients, searchTerm, statusFilter, floorFilter]);

  const handleBedAssigned = (updatedBed) => {
    setBeds(prev => prev.map(bed => bed.Id === updatedBed.Id ? updatedBed : bed));
    setShowModal(false);
    toast.success("Bed assigned successfully");
  };

  const handleBedReleased = async (bedId) => {
    try {
      const updatedBed = await bedService.releasePatient(bedId);
      setBeds(prev => prev.map(bed => bed.Id === updatedBed.Id ? updatedBed : bed));
      toast.success("Bed released successfully");
    } catch (err) {
      toast.error("Failed to release bed");
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Available": return "available";
      case "Occupied": return "occupied";
      case "Maintenance": return "maintenance";
      case "Reserved": return "reserved";
      default: return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available": return "bg-success-500";
      case "Occupied": return "bg-error-500";
      case "Maintenance": return "bg-warning-500";
      case "Reserved": return "bg-accent-500";
      default: return "bg-secondary-500";
    }
  };

  const floors = [...new Set(beds.map(bed => bed.floor))].sort();

  if (loading) return <Loading rows={6} />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const stats = {
    total: beds.length,
    available: beds.filter(b => b.status === "Available").length,
    occupied: beds.filter(b => b.status === "Occupied").length,
    maintenance: beds.filter(b => b.status === "Maintenance").length,
    reserved: beds.filter(b => b.status === "Reserved").length
  };

  const occupancyRate = Math.round((stats.occupied / stats.total) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Bed Management
          </h1>
          <p className="text-secondary-600 mt-2">Monitor bed availability and patient assignments</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex rounded-lg border border-secondary-200">
            <Button
              variant={viewMode === "grid" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none border-0"
            >
              <ApperIcon name="Grid3x3" size={16} />
            </Button>
            <Button
              variant={viewMode === "list" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none border-0"
            >
              <ApperIcon name="List" size={16} />
            </Button>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Assign Bed
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-secondary-900">{stats.total}</p>
          <p className="text-sm text-secondary-600">Total Beds</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-success-600">{stats.available}</p>
          <p className="text-sm text-secondary-600">Available</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-error-600">{stats.occupied}</p>
          <p className="text-sm text-secondary-600">Occupied</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-warning-600">{stats.maintenance}</p>
          <p className="text-sm text-secondary-600">Maintenance</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{occupancyRate}%</p>
          <p className="text-sm text-secondary-600">Occupancy Rate</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search by bed number, room type, nurse, or patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
              className="px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="All">All Floors</option>
              {floors.map(floor => (
                <option key={floor} value={floor}>Floor {floor}</option>
              ))}
            </select>
            
            {["All", "Available", "Occupied", "Maintenance", "Reserved"].map((status) => (
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

      {/* Status Legend */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-6">
          <h3 className="font-semibold text-secondary-900">Status Legend:</h3>
          {[
            { status: "Available", color: "bg-success-500" },
            { status: "Occupied", color: "bg-error-500" },
            { status: "Maintenance", color: "bg-warning-500" },
            { status: "Reserved", color: "bg-accent-500" }
          ].map(({ status, color }) => (
            <div key={status} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full ${color}`}></div>
              <span className="text-sm text-secondary-600">{status}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Beds Display */}
      {filteredBeds.length === 0 ? (
        <Empty
          icon="Bed"
          title="No beds found"
          description={searchTerm || statusFilter !== "All" || floorFilter !== "All" ? "Try adjusting your search or filters." : "No bed information available."}
        />
      ) : viewMode === "grid" ? (
        // Grid View
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
          {filteredBeds.map((bed) => {
            const patient = patients.find(p => p.Id === parseInt(bed.patientId));
            
            return (
              <Card
                key={bed.Id}
                hover
                className="p-4 cursor-pointer relative"
                onClick={() => {
                  setSelectedBed(bed);
                  if (bed.status === "Available") {
                    setShowModal(true);
                  }
                }}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-lg ${getStatusColor(bed.status)} flex items-center justify-center mx-auto mb-2`}>
                    <ApperIcon name="Bed" size={20} className="text-white" />
                  </div>
                  <p className="font-semibold text-secondary-900">{bed.number}</p>
                  <p className="text-xs text-secondary-600">{bed.roomType}</p>
                  <p className="text-xs text-secondary-500">Floor {bed.floor}</p>
                  
                  <Badge variant={getStatusBadgeVariant(bed.status)} className="mt-2 text-xs">
                    {bed.status}
                  </Badge>
                  
                  {patient && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-secondary-900">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-xs text-secondary-600">{patient.currentStatus}</p>
                    </div>
                  )}
                </div>
                
                {bed.status === "Occupied" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBedReleased(bed.Id);
                    }}
                  >
                    <ApperIcon name="X" size={12} />
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        // List View
        <div className="space-y-4">
          {filteredBeds.map((bed) => {
            const patient = patients.find(p => p.Id === parseInt(bed.patientId));
            
            return (
              <Card key={bed.Id} hover className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg ${getStatusColor(bed.status)} flex items-center justify-center`}>
                      <ApperIcon name="Bed" size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900">
                        Bed {bed.number}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-secondary-600 mt-1">
                        <span>{bed.roomType}</span>
                        <span>Floor {bed.floor}</span>
                        {bed.assignedNurse && <span>Nurse: {bed.assignedNurse}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {patient && (
                      <div className="text-right">
                        <p className="font-medium text-secondary-900">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-secondary-600">{patient.currentStatus}</p>
                        <p className="text-xs text-secondary-500">ID: {patient.Id}</p>
                      </div>
                    )}
                    
                    <Badge variant={getStatusBadgeVariant(bed.status)}>
                      {bed.status}
                    </Badge>
                    
                    <div className="flex space-x-2">
                      {bed.status === "Available" ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelectedBed(bed);
                            setShowModal(true);
                          }}
                        >
                          Assign
                        </Button>
                      ) : bed.status === "Occupied" ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleBedReleased(bed.Id)}
                        >
                          Release
                        </Button>
                      ) : null}
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Bed Assignment Modal */}
      {showModal && (
        <BedAssignmentModal
          onClose={() => {
            setShowModal(false);
            setSelectedBed(null);
          }}
          onBedAssigned={handleBedAssigned}
          bed={selectedBed}
          availablePatients={patients.filter(p => !p.bedNumber || p.bedNumber === null)}
        />
      )}
    </div>
  );
};

export default Beds;