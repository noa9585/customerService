import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { AppDispatch, RootState } from '../store/index';
import { cancelSessionThunk, fetchSessionById } from '../store/slices/Chatsession.slice';
import { fetchCustomerById } from '../store/slices/Customerslice';


export const useWaitingRoom = (sessionId: number, initialWait: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { activeSession } = useSelector((state: RootState) => state.chatSession);
  const { selectedCustomer } = useSelector((state: RootState) => state.customer);
  
  const [elapsed, setElapsed] = useState(0);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [waitTime, setWaitTime] = useState<number>(initialWait);

  const calculateElapsed = (startTime?: string | Date) => {
    if (!startTime) return 0;
    const start = new Date(startTime).getTime();
    const now = new Date().getTime();
    const diff = Math.floor((now - start) / 1000);
    return diff > 0 ? diff : 0;
  };

  // טעינת נתונים ראשונית - Session
  useEffect(() => {
    if (!sessionId) {
      navigate('/new-chat');
      return;
    }
    dispatch(fetchSessionById(sessionId));
  }, [sessionId, dispatch, navigate]);

  // טעינת פרטי הלקוח
  useEffect(() => {
    const customerId = activeSession?.idCustomer; 
    if (customerId && (!selectedCustomer || selectedCustomer.idCustomer !== customerId)) {
      dispatch(fetchCustomerById(customerId));
    }
  }, [activeSession?.idCustomer, selectedCustomer, dispatch]);

  // ✅ שינוי 1: useEffect חדש שטוען את waitTime מה-DB
  // פותר את בעיית הרענון - כשהדף מתרענן location.state אובד
  // אז אנחנו לוקחים את הזמן ישירות מה-session שנטען מהשרת
  useEffect(() => {
    if (activeSession?.estimatedWaitTime != null) {
      setWaitTime(activeSession.estimatedWaitTime);
    }
  }, [activeSession?.estimatedWaitTime]);

  // טיימר - מתעדכן כל שנייה
  useEffect(() => {
    if (activeSession?.startTimestamp) {
      setElapsed(calculateElapsed(activeSession.startTimestamp));
    }

    const timer = setInterval(() => {
      const timeField = activeSession?.startTimestamp;
      if (timeField) {
        setElapsed(calculateElapsed(timeField));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSession?.startTimestamp]);

  // ✅ שינוי 2: כל ה-listeners נרשמים לפני ה-start()
  // לפני: SessionStarted ו-ChatEnded היו בתוך ה-.then()
  //        ו-WaitingTimesUpdated היה בחוץ - חוסר עקביות
  // עכשיו: כולם במקום אחד, לפני ה-start - מובטח שלא יפספסו הודעות
  useEffect(() => {
    if (!sessionId) return;

    const newConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7260/chatHub') 
      .withAutomaticReconnect()
      .build();

    // ✅ שינוי 3: WaitingTimesUpdated - נשאר אותו מקום (לפני start) - זה היה נכון
    // רק וידאנו שכל השאר עברו לכאן גם
    newConnection.on('WaitingTimesUpdated', (updatedSessions: any[]) => {
      const mySession = updatedSessions.find(s => s.sessionID === sessionId);
      if (mySession) {
        setWaitTime(mySession.estimatedWaitTime);
      }
    });

    // ✅ שינוי 4: SessionStarted הועבר מתוך ה-.then() לכאן
    // לפני: newConnection.start().then(() => { newConnection.on('SessionStarted', ...) })
    // עכשיו: נרשם לפני start - בטוח יותר
    newConnection.on('SessionStarted', () => {
      navigate('/customer-chat', {
        state: { sessionId, SenderType: 0 },
      });
    });

    // ✅ שינוי 5: ChatEnded הועבר מתוך ה-.then() לכאן - אותה סיבה
    newConnection.on('ChatEnded', () => {
      alert('הפנייה הסתיימה.');
      navigate('/new-chat');
    });

    // ✅ שינוי 6: ה-start נקי עכשיו - רק מתחיל ומצטרף לחדר
    // לפני: גם רשם listeners בתוך ה-.then()
    // עכשיו: רק invoke של JoinChat
    newConnection.start()
      .then(() => {
        newConnection.invoke('JoinChat', sessionId);
      })
      .catch((e) => console.error('SignalR Error:', e));

    setConnection(newConnection);
    return () => { newConnection.stop(); };
  }, [sessionId, navigate]);

  // ביטול פנייה
  const onCancel = async () => {
    if (window.confirm('האם אתה בטוח שברצונך לבטל את הפנייה?')) {
      await dispatch(cancelSessionThunk(sessionId));
      navigate('/new-chat');
    }
  };

  // אובייקט סשן משולב עבור ה-UI
  const sessionForUI = useMemo(() => {
    if (!activeSession) return null;
    return {
      ...activeSession,
      customerName: selectedCustomer?.nameCust || 'לקוח יקר',
      sessionID: activeSession.sessionID || sessionId
    };
  }, [activeSession, selectedCustomer, sessionId]);

  return { 
    session: sessionForUI, 
    elapsed, 
    waitTime,  
    onCancel 
  };
};


// import { useEffect, useState, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
// import { AppDispatch, RootState } from '../store/index';
// import { cancelSessionThunk, fetchSessionById } from '../store/slices/Chatsession.slice';
// import { fetchCustomerById } from '../store/slices/Customerslice';


// export const useWaitingRoom = (sessionId: number, initialWait: number) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   // 1. שליפת מידע מה-Store (לפי המבנה ששלחת ב-index.ts)
//   const { activeSession } = useSelector((state: RootState) => state.chatSession);
//   const { selectedCustomer } = useSelector((state: RootState) => state.customer);
  
//   const [elapsed, setElapsed] = useState(0);
//   const [connection, setConnection] = useState<HubConnection | null>(null);
//   const [waitTime, setWaitTime] = useState<number>(initialWait);


//   // פונקציית עזר לחישוב הפרש זמן בשניות
//   const calculateElapsed = (startTime?: string | Date) => {
//     if (!startTime) return 0;
//     const start = new Date(startTime).getTime();
//     const now = new Date().getTime();
//     const diff = Math.floor((now - start) / 1000);
//     return diff > 0 ? diff : 0;
//   };

//   // 2. טעינת נתונים ראשונית - Session
//   useEffect(() => {
//     if (!sessionId) {
//       navigate('/new-chat');
//       return;
//     }
//     dispatch(fetchSessionById(sessionId));
//   }, [sessionId, dispatch, navigate]);

//   // 3. טעינת פרטי הלקוח - ברגע שיש לנו SessionID ו-ID לקוח
//   useEffect(() => {
//     // כאן אני מניח שלשדה קוראים idCustomer או customerID לפי ה-Slice ששלחת
//     const customerId = activeSession?.idCustomer; 
    
//     if (customerId && (!selectedCustomer || selectedCustomer.idCustomer !== customerId)) {
//       dispatch(fetchCustomerById(customerId));
//     }
//   }, [activeSession?.idCustomer, selectedCustomer, dispatch]);

//   // 4. טיימר "חסין רענון" - מתעדכן כל שנייה על בסיס זמן אמת
//   useEffect(() => {
//     // עדכון מיידי
//     if (activeSession?.startTimestamp || activeSession?.startTimestamp) {
//       setElapsed(calculateElapsed(activeSession.startTimestamp || activeSession.startTimestamp));
//     }

//     const timer = setInterval(() => {
//       // בדיקה מול השדה הקיים ב-Session (וודא אם זה startTimestamp או startTime)
//       const timeField = activeSession?.startTimestamp || activeSession?.startTimestamp;
//       if (timeField) {
//         setElapsed(calculateElapsed(timeField));
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [activeSession?.startTimestamp, activeSession?.startTimestamp]);

//   // 5. ניהול SignalR
//   useEffect(() => {
//     if (!sessionId) return;

//     const newConnection = new HubConnectionBuilder()
//       .withUrl('https://localhost:7260/chatHub') 
//       .withAutomaticReconnect()
//       .build();
//     newConnection.on('WaitingTimesUpdated', (updatedSessions: any[]) => {
//     const mySession = updatedSessions.find(s => s.sessionID === sessionId);
//     if (mySession) {
//         setWaitTime(mySession.estimatedWaitTime);
//     }
// });
//     newConnection.start()
//       .then(() => {
//         newConnection.invoke('JoinChat', sessionId);

//         newConnection.on('SessionStarted', () => {
//           navigate('/customer-chat', {
//             state: { sessionId, SenderType: 0 },
//           });
//         });

//         newConnection.on('ChatEnded', () => {
//           alert('הפנייה הסתיימה.');
//           navigate('/new-chat');
//         });
//       })
//       .catch((e) => console.error('SignalR Error:', e));

//     setConnection(newConnection);
//     return () => { newConnection.stop(); };
//   }, [sessionId, navigate]);

//   // 6. ביטול פנייה
//   const onCancel = async () => {
//     if (window.confirm('האם אתה בטוח שברצונך לבטל את הפנייה?')) {
//       await dispatch(cancelSessionThunk(sessionId));
//       navigate('/new-chat');
//     }
//   };

//   // 7. יצירת אובייקט סשן משולב עבור ה-UI (מוסיף את שם הלקוח לסשן)
//   const sessionForUI = useMemo(() => {
//     if (!activeSession) return null;
//     return {
//       ...activeSession,
//       customerName: selectedCustomer?.nameCust || 'לקוח יקר',
//       sessionID: activeSession.sessionID || sessionId // התאמה לשם השדה ב-UI
//     };
//   }, [activeSession, selectedCustomer, sessionId]);

//  return { 
//     session: sessionForUI, 
//     elapsed, 
//     waitTime,  
//     onCancel 
// };
// };

// import { useEffect, useState, useCallback, useRef } from 'react';
// import { getSessionById,cancelSession } from '../services/chatSession.service';
// import { ChatSession, SessionStatus } from '../types/chatSession.types';
// import { useNavigate } from 'react-router-dom';
// import { getCustomerById } from '../services/customer.service';

// export const useWaitingRoom = (sessionId: number, initialWait: number) => {
//   const navigate = useNavigate();
//   const [session, setSession] = useState<ChatSession | null>(null);
//   const [customerName, setCustomerName] = useState<string>('לקוח יקר'); // State ייעודי לשם
//   const [waitTime, setWaitTime] = useState<number | string>(initialWait || 'מחשב...');
//   const [elapsed, setElapsed] = useState(0);
//   const isInitialFetchDone = useRef(false);
//   const calculateElapsed = (startTime?: string | Date) => {
//   if (!startTime) return 0;
//   const start = new Date(startTime).getTime();
//   const now = new Date().getTime();
//   return Math.floor((now - start) / 1000); // החזרת ההפרש בשניות
// };
//   const updateStatus = useCallback(async () => {
//     try {
//       const data = await getSessionById(sessionId);
//       setSession(data);
//     if (data.startTimestamp) {
//       setElapsed(calculateElapsed(data.startTimestamp));
//     }
//       // שליפת שם הלקוח רק אם הוא עוד לא נשמר
//       if (data && customerName === 'לקוח יקר') {
//         try {
//           const name = await getCustomerById(data.idCustomer);
//           setCustomerName(name.nameCust || `לקוח #${data.idCustomer}`);
//         } catch (err) {
//           setCustomerName(`לקוח #${data.idCustomer}`);
//         }
//       }
      
//       if (data.statusChat === SessionStatus.Active) {
//         navigate('/customer-chat', { state: { sessionId, SenderType: 0 } });
//       }
//     } catch (err) {
//       console.error("Error updating wait status:", err);
//     }
//   }, [sessionId, navigate, customerName]);

//   useEffect(() => {
//     if (!sessionId) {
//       navigate('/new-chat');
//       return;
//     }

//     if (!isInitialFetchDone.current) {
//       updateStatus();
//       isInitialFetchDone.current = true;
//     }

//     const timer = setInterval(() => setElapsed(prev => prev + 1), 1000);
//     const apiInterval = setInterval(updateStatus, 10000);

//     return () => {
//       clearInterval(timer);
//       clearInterval(apiInterval);
//     };
//   }, [sessionId, updateStatus, navigate]);
// const handleCancel = useCallback(async () => {
//     try {


//  if (window.confirm("האם אתה בטוח שברצונך לסגור את השיחה?")) {
// await cancelSession(sessionId);
//       navigate('/new-chat');
//             }
//     } catch (err) {
//       console.error("שגיאה בביטול הפנייה:", err);
//     }
//   }, [sessionId, navigate]);
//   return {
//     session,
//     elapsed,
//     customerName, // מחזירים את השם מה-State
//     waitTime,
// onCancel: handleCancel,  };
// };




// import { useEffect, useState, useCallback } from 'react';

// export type WaitingSession = {
//   id: number;
//   customer_name: string;
//   topic_name: string;
//   queue_position: number;
//   estimated_wait_minutes: number;
//   status: 'waiting' | 'connected' | 'cancelled';
// };

// export const useWaitingRoom = (initial?: Partial<WaitingSession>) => {
//   const [session, setSession] = useState<WaitingSession>({
//     id: initial?.id ?? 0,
//     customer_name: initial?.customer_name ?? 'לקוח/ה',
//     topic_name: initial?.topic_name ?? 'נושא',
//     queue_position: initial?.queue_position ?? 1,
//     estimated_wait_minutes: initial?.estimated_wait_minutes ?? 3,
//     status: (initial?.status as WaitingSession['status']) ?? 'waiting',
//   });

//   // elapsed seconds since queued
//   const [elapsed, setElapsed] = useState<number>((initial && 0) || 4 * 60 + 55);

//   useEffect(() => {
//     if (session.status !== 'waiting') return;
//     const t = setInterval(() => setElapsed((p) => p + 1), 1000);
//     return () => clearInterval(t);
//   }, [session.status]);

//   const cancel = useCallback(() => {
    
//     setSession((s) => ({ ...s, status: 'cancelled' }));
//   }, []);

//   const connect = useCallback(() => {
//     setSession((s) => ({ ...s, status: 'connected' }));
//   }, []);

//   const setFromServer = useCallback((data: Partial<WaitingSession>) => {
//     setSession((s) => ({ ...s, ...data }));
//   }, []);

//   return {
//     session,
//     setSession: setFromServer,
//     elapsed,
//     estimated: session.estimated_wait_minutes * 60,
//     cancel,
//     connect,
//   } as const;
// };

// export default useWaitingRoom;
