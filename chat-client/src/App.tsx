// App.tsx  (מתוקן)
// שינויים:
//   1. שחזור סשן לקוח מ-localStorage['user']
//   2. שחזור סשן נציג מ-localStorage['representativeUser']
// ─────────────────────────────────────────────────────────────────────────────
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from './store/slices/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // ── ניסיון לשחזר סשן לקוח ──────────────────────────────────────────────
    const savedCustomer = localStorage.getItem('user');
    const custToken = localStorage.getItem('token');

    if (savedCustomer && custToken) {
      try {
        const user = JSON.parse(savedCustomer);
        dispatch(setCredentials({ user, userType: 'customer' }));
      } catch (e) {
        console.error('Error restoring customer session', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    // ── ניסיון לשחזר סשן נציג ───────────────────────────────────────────────
    const savedRep = localStorage.getItem('representativeUser');
    const repToken = localStorage.getItem('representativeToken');

    if (savedRep && repToken) {
      try {
        const rep = JSON.parse(savedRep);
        dispatch(setCredentials({ user: rep, userType: 'representative' }));
      } catch (e) {
        console.error('Error restoring representative session', e);
        localStorage.removeItem('representativeUser');
        localStorage.removeItem('representativeToken');
      }
    }
  }, [dispatch]);

  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;










// import { BrowserRouter as Router } from 'react-router-dom';
// import { AppRouter } from './routes/AppRouter';
//  import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { setCredentials } from './store/slices/authSlice';
// /**
//  * App Component (Global Wrapper)
//  * Only contains global providers and wrappers (Router, Theme, Redux, etc.)
//  * All route definitions and logic are extracted to routes/AppRouter.tsx
//  */
 

// function App() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     // שליפת המשתמש והטוקן שנשמרו ב-LocalStorage בזמן ה-Login
//     const savedUser = localStorage.getItem('user'); 
//     const token = localStorage.getItem('token');

//     if (savedUser && token) {
//       try {
//         const user = JSON.parse(savedUser);
//         // עדכון ה-Redux מתוך הזיכרון המקומי
//         dispatch(setCredentials({ 
//           user: user, 
//           userType: user.role === 'Representative' ? 'representative' : 'customer' 
//         }));
//       } catch (e) {
//         console.error("Error loading user from storage", e);
//       }
//     }
//   }, [dispatch]);
//   return (
//     <Router>
//       <AppRouter />
//     </Router>
//   );
// }

// export default App;