// useRepresentativeDashboard.hook.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/index';
import {
  fetchRepresentativeById ,
  toggleBreakThunk,
  returnFromBreakThunk,
  logoutRepresentativeThunk,
} from '../store/slices/Representative.slice';
import { fetchNextClientThunk, clearError } from '../store/slices/Chatsession.slice';
import { Representative } from '../types/representative.types';

export const useRepresentativeDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth);
  const rep = user as Representative | null;

  const { representative, loading } = useSelector(
    (state: RootState) => state.representative
  );

  // ✅ שגיאת "אין לקוחות" מגיעה מ-chatSession slice
  const { error: sessionError } = useSelector(
    (state: RootState) => state.chatSession
  );

  useEffect(() => {
    if (!rep?.idRepresentative) {
      navigate('/RepresentativeLogin');
      return;
    }
    dispatch(fetchRepresentativeById (rep.idRepresentative));
  }, [dispatch, rep, navigate]);

  // ניקוי שגיאה אחרי 5 שניות
  useEffect(() => {
    if (sessionError) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [sessionError, dispatch]);

  const handleGetNextClient = async () => {
    if (!representative) return;
    const result = await dispatch(fetchNextClientThunk(representative.idRepresentative));

    if (fetchNextClientThunk.fulfilled.match(result)) {
      navigate('/representative-chat', {
        state: { sessionId: result.payload.sessionID, SenderType: 1 },
      });
    }
    // אם rejected — sessionError יתעדכן אוטומטית ויוצג
  };

  const handleToggleBreak = () => {
    if (!representative) return;
    if (representative.isOnline) dispatch(toggleBreakThunk(representative.idRepresentative));
    else dispatch(returnFromBreakThunk(representative.idRepresentative));
  };

  const handleLogout = async () => {
    if (!representative) return;
    await dispatch(logoutRepresentativeThunk(representative.idRepresentative));
    localStorage.removeItem('representativeToken');
    localStorage.removeItem('representativeUser');
    navigate('/RepresentativeLogin');
  };

  return {
    repData: representative,
    loading,
    error: sessionError, // ✅ מחזיר את שגיאת chatSession
    handleGetNextClient,
    handleToggleBreak,
    handleLogout,
    navigate,
  };
};


// import { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getDecodedTokenRep } from '../utils/auth'
// import parseJwt from '../utils/jwt';
// import {
//     getRepresentativeById,
//     toggleBreak,
//     returnFromBreak,
//     logoutRepresentative
// } from '../services/representative.service'
// import axiosInstance from '../services/axios'
// import { getNextClient } from '../services/chatSession.service';
// import { SenderType } from '../types/chatMessage.types';

// export const useRepresentativeDashboard = () => {
//     const navigate = useNavigate()
//     const [repData, setRepData] = useState<any>(null)
//     const [loading, setLoading] = useState(true)
//     const [actionLoading, setActionLoading] = useState(false)
//     const [error, setError] = useState<string | null>(null)

//     const loadData = useCallback(async () => {
//         try {
//             const token = localStorage.getItem('representativeToken');
//             if (!token) {
//                 setError("לא נמצאה אסימון. אנא התחבר מחדש.");
//                 return navigate('/RepresentativeLogin');
//             }

//             const decoded = parseJwt(token);
//             const id = parseInt(decoded.sub, 10);
//             const data = await getRepresentativeById(id);
//             setRepData(data);


//         } catch (err) {
//             navigate('/RepresentativeLogin');
//         } finally {
//             setLoading(false);
//         }
//     }, [navigate]);

//     useEffect(() => { loadData(); }, [loadData]);

//     const handleGetNextClient = async () => {
//         setActionLoading(true);
//         setError(null);
//         try {
//             const res = await getNextClient(repData.idRepresentative);
//             navigate('/representative-chat', { state: { sessionId: res.sessionID, SenderType: 1 } });
//         } catch (err: any) {
//             if (err.response && err.response.status === 404) {
//                 setError("אין לקוחות ממתינים בתור כרגע. נסה שוב בעוד כמה דקות.");
//             } else {
//                 setError("אירעה שגיאה בחיבור לשרת. אנא נסה שוב.");
//             }
//         } finally {
//             setActionLoading(false);
//         }
//     };




//     const handleToggleBreak = async () => {
//         setActionLoading(true);
//         try {
//             if (repData.isOnline) await toggleBreak(repData.idRepresentative);
//             else await returnFromBreak(repData.idRepresentative);
//             await loadData();
//         } catch (err) { setError("שגיאה בעדכון הסטטוס"); }
//         finally { setActionLoading(false); }
//     };

//     const handleLogout = async () => {
//         await logoutRepresentative(repData.idRepresentative);
//         localStorage.removeItem('representativeToken');
//         navigate('/RepresentativeLogin');
//     };

//     return { repData, loading, actionLoading, error, handleGetNextClient, handleToggleBreak, navigate, handleLogout };
// };