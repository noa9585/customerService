import { BrowserRouter as Router } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from './store/slices/authSlice';
import Header from './component/Header';
import Footer from './component/Footer';


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedCustomer = localStorage.getItem('user');
    const custToken = localStorage.getItem('token');
    if (savedCustomer && custToken) {
      try {
        const user = JSON.parse(savedCustomer);
        dispatch(setCredentials({ user, userType: 'customer' }));
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    const savedRep = localStorage.getItem('representativeUser');
    const repToken = localStorage.getItem('representativeToken');
    if (savedRep && repToken) {
      try {
        const rep = JSON.parse(savedRep);
        dispatch(setCredentials({ user: rep, userType: 'representative' }));
      } catch (e) {
        localStorage.removeItem('representativeUser');
        localStorage.removeItem('representativeToken');
      }
    }
  }, [dispatch]);

  return (
  <Router>
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <Header />
      <div style={{ paddingTop: '64px', flex: 1, width: '100%' }}>
        <AppRouter />
      </div>
      <Footer />
    </div>
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