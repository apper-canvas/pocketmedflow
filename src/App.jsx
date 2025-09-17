import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Patients from "@/components/pages/Patients";
import PatientDetail from "@/components/pages/PatientDetail";
import Appointments from "@/components/pages/Appointments";
import Beds from "@/components/pages/Beds";
import Staff from "@/components/pages/Staff";
import Emergency from "@/components/pages/Emergency";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-white">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="patients/:id" element={<PatientDetail />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="beds" element={<Beds />} />
            <Route path="staff" element={<Staff />} />
            <Route path="emergency" element={<Emergency />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;