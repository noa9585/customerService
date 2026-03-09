import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerLogin from '../pages/CustomerLogin';
import CustomerRegister from '../pages/CustomerRegister';
import RepresentativeLogin from '../pages/representativeLogin';
import RepresentativeRegister from '../pages/RepresentativeRegister';
import ContactUs from '../pages/ContactUs';
import NewChat from '../pages/NewChat';
import ChatView from '../pages/ChatView';
import WaitingRoomPage from '../pages/WaitingRoomPage';
import RepresentativeDashboard from '../pages/RepresentativeDashboard';
import UpdateRepresentative from '../pages/UpdateRepresentative';

/**
 * AppRouter Component
 * Manages all application routes and navigation
 * This keeps App.tsx clean and focused on global providers/wrappers
 */
export const AppRouter = () => {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/contact-us" />} />
      
      {/* Public pages */}
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/login" element={<CustomerLogin />} />
      <Route path="/register" element={<CustomerRegister />} />
      <Route path="/RepresentativeLogin" element={<RepresentativeLogin />} />
      <Route path="/RepresentativeRegister" element={<RepresentativeRegister />} />
      
      {/* Customer pages */}
      <Route path="/new-chat" element={<NewChat />} />
      <Route path="/waiting-room" element={<WaitingRoomPage />} />
      <Route path="/chat" element={<ChatView />} />
      
      {/* Representative pages */}
      <Route path="/representative-dashboard" element={<RepresentativeDashboard />} />
      <Route path="/update-representative" element={<UpdateRepresentative />} />
      
      {/* Fallback for undefined routes */}
      <Route path="*" element={<Navigate to="/contact-us" />} />
    </Routes>
  );
};
