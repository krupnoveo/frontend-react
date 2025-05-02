import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import BranchesPage from './pages/BranchesPage';
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import NewBookingPage from "./pages/NewBookingPage";
import AdministratorPage from "./pages/AdministratorPage";
import RecordDetailsPage from "./pages/RecordDetailsPage";
import CreateRecordPage from "./pages/CreateRecordPage";
import AdministratorProfilePage from "./pages/AdministratorProfilePage";
import BarbersListPage from "./pages/BarbersListPage";
import AdminPage from "./pages/AdminPage";
import AdminEditBarbershopPage from "./pages/AdminEditBarbershopPage";
import AdminNewBarbershopPage from "./pages/AdminNewBarbershopPage";
import AdminEditServicePage from "./pages/AdminEditServicePage";
import AdminNewServicePage from "./pages/AdminNewServicePage";
import AdminNewBarberPage from "./pages/AdminNewBarberPage";
import AdminNewAdministratorPage from "./pages/AdminNewAdministratorPage";
import AdminEditUserPage from "./pages/AdminEditUserPage";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/branches" element={<BranchesPage />} />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/new-booking" element={
                        <ProtectedRoute>
                            <NewBookingPage />
                        </ProtectedRoute>
                    } />
                    
                    {/* Administrator Routes */}
                    <Route path="/manager" element={
                        <ProtectedRoute>
                            <AdministratorPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/manager/profile" element={
                        <ProtectedRoute>
                            <AdministratorProfilePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/manager/barbers" element={
                        <ProtectedRoute>
                            <BarbersListPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/manager/record/:id" element={
                        <ProtectedRoute>
                            <RecordDetailsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/manager/record/new" element={
                        <ProtectedRoute>
                            <CreateRecordPage />
                        </ProtectedRoute>
                    } />
                    
                    {/* Superadmin (ADMIN) Routes */}
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <AdminPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/barbershop/new" element={
                        <ProtectedRoute>
                            <AdminNewBarbershopPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/barbershop/:id" element={
                        <ProtectedRoute>
                            <AdminEditBarbershopPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/service/new" element={
                        <ProtectedRoute>
                            <AdminNewServicePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/service/:id" element={
                        <ProtectedRoute>
                            <AdminEditServicePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/barber/new" element={
                        <ProtectedRoute>
                            <AdminNewBarberPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/administrator/new" element={
                        <ProtectedRoute>
                            <AdminNewAdministratorPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/user/:id" element={
                        <ProtectedRoute>
                            <AdminEditUserPage />
                        </ProtectedRoute>
                    } />
                </Routes>
                <Footer />
            </Router>
        </LocalizationProvider>
    );
}

export default App;