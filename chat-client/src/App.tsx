import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import RepresentativeLogin from './pages/representativeLogin';
import RepresentativeRegister from './pages/RepresentativeRegister';
import ContactUs from './pages/ContactUs';
import NewChat from './pages/NewChat';
import ChatView from './pages/ChatView';

function App() {
  return (
    <Router>
      <Routes>
        {/* דף ברירת המחדל יוביל ללוגין */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/new-chat" element={<NewChat />} />
        <Route path="/chat" element={<ChatView />} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/RepresentativeLogin" element={<RepresentativeLogin />} />
        <Route path="/RepresentativeRegister" element={<RepresentativeRegister />} />
        <Route path="/register" element={<CustomerRegister />} />
      </Routes>
    </Router>
  );
}

export default App;