# 🔄 Before & After Code Examples

## 1️⃣ App.tsx

### ❌ Before (44 lines, cluttered)
```tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import RepresentativeLogin from './pages/representativeLogin';
import RepresentativeRegister from './pages/RepresentativeRegister';
import ContactUs from './pages/ContactUs';
import NewChat from './pages/NewChat';
import ChatView from './pages/ChatView';
import WaitingRoomPage from './pages/WaitingRoomPage';
import WaitingRoomStyled from './pages/WaitingRoomStyled';
import RepresentativeDashboard from './pages/RepresentativeDashboard';
import UpdateRepresentative from './pages/UpdateRepresentative';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/contact-us" />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/representative-dashboard" element={<RepresentativeDashboard />} />
        <Route path="/Waiting-Room" element={<WaitingRoomPage />} />
        <Route path="/new-chat" element={<NewChat />} />
        <Route path="/chat" element={<ChatView />} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/RepresentativeLogin" element={<RepresentativeLogin />} />
        <Route path="/RepresentativeRegister" element={<RepresentativeRegister />} />
        <Route path="/register" element={<CustomerRegister />} />
        <Route path="/update-representative" element={<UpdateRepresentative />} />
      </Routes>
    </Router>
  );
}

export default App;
```

### ✅ After (13 lines, clean)
```tsx
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;
```

**Result:** Cleaner, easier to read, all routing logic extracted

---

## 2️⃣ WaitingRoomPage.tsx

### ❌ Before (Mixed Logic + UI)
```tsx
const WaitingRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId, initialWait } = location.state || {};
  const [sessionData, setSessionData] = useState<any>(null);
  const [waitTime, setWaitTime] = useState(initialWait || 0);
  const [elapsed, setElapsed] = useState(0);

  // ... lots of logic ...

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <WaitingRoomStyled 
        session={sessionData} 
        elapsed={elapsed} 
        waitTime={waitTime} 
      />
    </div>
  );
};
```

### ✅ After (Thin Wrapper - Logic Only)
```tsx
const WaitingRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId, initialWait } = location.state || {};
  const [sessionData, setSessionData] = useState<any>(null);
  const [waitTime, setWaitTime] = useState(initialWait || 0);
  const [elapsed, setElapsed] = useState(0);

  // ... same logic as before ...

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <WaitingRoomSection 
        session={sessionData} 
        elapsed={elapsed} 
        waitTime={waitTime} 
      />
    </div>
  );
};
```

**Result:** Page focuses on logic, UI moved to section

---

## 3️⃣ New WaitingRoomSection.tsx

### ✅ Pure Presentation Component
```tsx
interface WaitingRoomSectionProps {
  session: any;
  elapsed: number;
  waitTime: number;
}

const WaitingRoomSection: React.FC<WaitingRoomSectionProps> = ({ 
  session, 
  elapsed, 
  waitTime 
}) => {
  const formatElapsed = (s: number) => {
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <div className="waiting-page" dir="rtl">
      {/* Pure presentational JSX - no logic, all props-driven */}
      <h1 className="wr-title">מיד נתחבר, {session.customerName || 'לקוח יקר'}</h1>
      {/* ... rest of UI ... */}
    </div>
  );
};
```

**Result:** Pure presentation component, easy to test, easy to reuse

---

## 4️⃣ Auth Token Handling

### ❌ Before (Duplicated in Each Hook)
```tsx
// In useNewChatPage.hook.ts
useEffect(() => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = parseJwt(token);
      setDecodedToken(decoded);
    }
  } catch (e) {
    console.warn('No token to decode or decode failed', e);
  }
}, []);

// In useCustomerLogin.hook.ts
useEffect(() => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = parseJwt(token);
      setUserToken(decoded);
    }
  } catch (e) {
    console.warn('No token', e);
  }
}, []);
```

### ✅ After (Centralized Utility)
```tsx
// src/utils/auth.ts
export const getDecodedToken = (): any | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return parseJwt(token);
  } catch (e) {
    console.warn('Failed to decode token:', e);
    return null;
  }
};

// In any hook - just import and use
import { getDecodedToken } from '../utils/auth';

const decoded = getDecodedToken();
```

**Result:** DRY principle, easier to maintain, change once affects everywhere

---

## 5️⃣ RepresentativeDashboard.tsx

### ❌ Before (Mixed with UI)
```tsx
const RepresentativeDashboard: React.FC = () => {
    const { repData, loading, actionLoading, error, ... } = useRepresentativeDashboard();

    if (loading) return <div className="dashboard-page">טוען נתונים...</div>;
    if (!repData) return null;

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <header className="dashboard-header">
                    {/* ... tons of JSX ... */}
                </header>
                <div className="stats-grid">
                    {/* ... more JSX ... */}
                </div>
                <main className="main-control-panel">
                    {/* ... even more JSX ... */}
                </main>
            </div>
        </div>
    );
};
```

### ✅ After (Logic Only, Delegates to Section)
```tsx
const RepresentativeDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { 
        repData, 
        loading, 
        actionLoading, 
        error, 
        handleGetNextClient, 
        handleToggleBreak, 
        handleLogout
    } = useRepresentativeDashboard();

    return (
        <RepresentativeDashboardSection
            repData={repData}
            loading={loading}
            actionLoading={actionLoading}
            error={error}
            handleGetNextClient={handleGetNextClient}
            handleToggleBreak={handleToggleBreak}
            handleLogout={handleLogout}
            onNavigate={navigate}
        />
    );
};
```

**Result:** Page is now just a connector between hook and section

---

## 6️⃣ AuthGuard Usage (Future)

### ✅ How to Use (In AppRouter)
```tsx
import AuthGuard from '../auth/AuthGuard';

<Route path="/new-chat" element={
  <AuthGuard userType="customer">
    <NewChat />
  </AuthGuard>
} />

<Route path="/representative-dashboard" element={
  <AuthGuard userType="representative">
    <RepresentativeDashboard />
  </AuthGuard>
} />
```

**Result:** Automatic token validation on protected routes

---

## Summary Table

| Component | Before | After |
|-----------|--------|-------|
| **App.tsx** | 44 lines | 13 lines |
| **Token handling** | Duplicated | Centralized |
| **UI Sections** | Mixed with logic | Separated |
| **Route management** | Scattered | Organized in AppRouter |
| **Code reusability** | Low | High |
| **Testability** | Difficult | Easy (pure sections) |

---

**Your project is now more scalable, maintainable, and professional!** 🚀
