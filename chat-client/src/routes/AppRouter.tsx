// ─────────────────────────────────────────────────────────────────────────────
// AppRouter.tsx  (מעודכן — 3 כניסות + ניתוב חכם)
// שינוי: עטיפת כל הדפים המוגנים ב-AuthGuard עם userType מתאים
// ─────────────────────────────────────────────────────────────────────────────
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from '../auth/AuthGuard';
import HomeRedirect from '../component/HomeRedirect';

// Public
import CustomerLogin from '../pages/CustomerLogin';
import CustomerRegister from '../pages/CustomerRegister';
import RepresentativeLogin from '../pages/representativeLogin';
import RepresentativeRegister from '../pages/RepresentativeRegister';
import AdminLogin from '../pages/AdminLogin';
import ContactUs from '../pages/ContactUs';

// Customer
import NewChat from '../pages/NewChat';
import WaitingRoomPage from '../pages/WaitingRoomPage';
import CustomerChatPage from '../pages/CustomerChatPage';
import UpdateCustomer from '../pages/UpdateCustomer';

// Representative
import RepresentativeDashboard from '../pages/RepresentativeDashboard';
import RepresentativeChatPage from '../pages/RepresentativeChatPage';
import UpdateRepresentative from '../pages/UpdateRepresentative';

// Admin
import AdminDashboard from '../pages/AdminDashboard';

export const AppRouter = () => {
  return (
    <Routes>
      {/* ── ניתוב חכם לפי תפקיד ─────────────────────────────────────────── */}
      <Route path="/" element={<HomeRedirect />} />

      {/* ── 3 כניסות נפרדות ──────────────────────────────────────────────── */}
      <Route path="/login"                  element={<CustomerLogin />} />
      <Route path="/register"               element={<CustomerRegister />} />
      <Route path="/RepresentativeLogin"    element={<RepresentativeLogin />} />
      <Route path="/RepresentativeRegister" element={<RepresentativeRegister />} />
      <Route path="/admin-login"            element={<AdminLogin />} />

      {/* ── דף ציבורי ────────────────────────────────────────────────────── */}
      <Route path="/contact-us" element={<ContactUs />} />

      {/* ── דפי לקוח מוגנים ─────────────────────────────────────────────── */}
      <Route path="/new-chat" element={
        <AuthGuard userType="customer"><NewChat /></AuthGuard>
      } />
      <Route path="/waiting-room" element={
        <AuthGuard userType="customer"><WaitingRoomPage /></AuthGuard>
      } />
      
      <Route path="/customer-chat" element={
        <AuthGuard userType="customer"><CustomerChatPage /></AuthGuard>
      } />
      <Route path="/update-customer" element={
        <AuthGuard userType="customer"><UpdateCustomer /></AuthGuard>
      } />

      {/* ── דפי נציג מוגנים ─────────────────────────────────────────────── */}
      <Route path="/representative-dashboard" element={
        <AuthGuard userType="representative"><RepresentativeDashboard /></AuthGuard>
      } />
      <Route path="/representative-chat" element={
        <AuthGuard userType="representative"><RepresentativeChatPage /></AuthGuard>
      } />
      <Route path="/update-representative" element={
        <AuthGuard userType="representative"><UpdateRepresentative /></AuthGuard>
      } />

      {/* ── דפי מנהל מוגנים ─────────────────────────────────────────────── */}
      <Route path="/admin" element={
        <AuthGuard userType="admin"><AdminDashboard /></AuthGuard>
      } />

      {/* ── Fallback ─────────────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};







// import { Routes, Route, Navigate } from 'react-router-dom';
// import CustomerLogin from '../pages/CustomerLogin';
// import CustomerRegister from '../pages/CustomerRegister';
// import RepresentativeLogin from '../pages/representativeLogin';
// import RepresentativeRegister from '../pages/RepresentativeRegister';
// import ContactUs from '../pages/ContactUs';
// import NewChat from '../pages/NewChat';
// import ChatView from '../pages/ChatView';
// import WaitingRoomPage from '../pages/WaitingRoomPage';
// import RepresentativeDashboard from '../pages/RepresentativeDashboard';
// import UpdateRepresentative from '../pages/UpdateRepresentative';
// import RepresentativeChatPage from '../pages/RepresentativeChatPage';
// import CustomerChatPage from '../pages/CustomerChatPage';
// import UpdateCustomer from '../pages/UpdateCustomer';
// /**
//  * AppRouter Component
//  * Manages all application routes and navigation
//  * This keeps App.tsx clean and focused on global providers/wrappers
//  */
// export const AppRouter = () => {
//   return (
//     <Routes>
//       {/* Default redirect */}
//       <Route path="/" element={<Navigate to="/contact-us" />} />

//       {/* Public pages */}
//       <Route path="/contact-us" element={<ContactUs />} />
//       <Route path="/login" element={<CustomerLogin />} />
//       <Route path="/register" element={<CustomerRegister />} />
//       <Route path="/RepresentativeLogin" element={<RepresentativeLogin />} />
//       <Route path="/RepresentativeRegister" element={<RepresentativeRegister />} />

//       {/* Customer pages */}
//       <Route path="/new-chat" element={<NewChat />} />
//        <Route path="/waiting-room" element={<WaitingRoomPage />} />
//       <Route path="/chat" element={<ChatView />} />
//       <Route path="/update-customer" element={<UpdateCustomer />} />
//       <Route path="/customer-chat" element={<CustomerChatPage />} />

//       {/* Representative pages */}
//       <Route path="/representative-dashboard" element={<RepresentativeDashboard />} />
//       <Route path="/update-representative" element={<UpdateRepresentative />} />
//       <Route path="/representative-chat" element={<RepresentativeChatPage />} />

//       {/* Fallback for undefined routes */}
//       <Route path="*" element={<Navigate to="/contact-us" />} />
//     </Routes>
//   );
// };
