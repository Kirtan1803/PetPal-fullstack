import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddPet from "./pages/AddPet";
import PetDetails from "./pages/PetDetails";
import MyAdoptions from "./pages/MyAdoptions";
import Pets from "./pages/Pets";

import AdminLayout from "./pages/admin/AdminLayout";
import PetRequests from "./pages/admin/PetRequests";
import Dashboard from "./pages/admin/Dashboard";
import AdoptionRequests from "./pages/admin/AdoptionRequests";
import Categories from "./pages/admin/Categories";
import Users from "./pages/admin/Users";

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
}

function AdminProtectedLayout() {
  return (
    <ProtectedRoute adminOnly={true}>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/add-pet" element={<AddPet />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/pets/:id" element={<PetDetails />} />
          <Route path="/my-adoptions" element={<MyAdoptions />} />
        </Route>

        <Route element={<AdminProtectedLayout />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="pet-requests" element={<PetRequests />} />
            <Route path="adoptions" element={<AdoptionRequests />} />
            <Route path="categories" element={<Categories />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Route>

        <Route path="*" element={<Login />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;
