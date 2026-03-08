import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import RepresentativeLogin from './pages/representativeLogin';
import RepresentativeRegister from './pages/RepresentativeRegister';

function App() {
  return (
    <Router>
      <Routes>
        {/* דף ברירת המחדל יוביל ללוגין */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/RepresentativeLogin" element={<RepresentativeLogin />} />
        <Route path="/RepresentativeRegister" element={<RepresentativeRegister />} />
        <Route path="/register" element={<CustomerRegister />} />
      </Routes>
    </Router>
  );
}

export default App;