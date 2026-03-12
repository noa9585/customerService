import React from 'react';
import { useLocation } from 'react-router-dom';
import { useWaitingRoom } from '../hooks/useWaitingRoom.hook';
import WaitingRoomSection from '../sections/WaitingRoom/WaitingRoom.Section';

const WaitingRoomPage: React.FC = () => {
  const location = useLocation();
  // חילוץ sessionId וזמן התחלתי מה-State של הראוטר
  const { sessionId, initialWait } = location.state || {};
  
  // שימוש ב-Hook שמעדכן את כל הלוגיקה והשמות
  const { session, elapsed, customerName, waitTime, cancel } = useWaitingRoom(sessionId, initialWait);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <WaitingRoomSection 
        session={session} 
        customerName={customerName}
        elapsed={elapsed} 
        waitTime={waitTime} 
        onCancel={cancel}
      />
    </div>
  );
};

export default WaitingRoomPage;



// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import WaitingRoomSection from '../sections/WaitingRoom/WaitingRoom.Section';
// import { getWaitTimeEstimate, getSessionById } from '../services/chatSession.service';
// import { SessionStatus } from '../types/chatSession.types';

// const WaitingRoomPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // חילוץ הנתונים שהועברו מהדף הקודם (NewChat)
//   const { sessionId, initialWait } = location.state || {};
  
//   const [sessionData, setSessionData] = useState<any>(null);
//   const [waitTime, setWaitTime] = useState(initialWait || 0);
//   const [elapsed, setElapsed] = useState(0);

//   useEffect(() => {
//     // הגנה: אם אין מזהה שיחה, נחזיר את המשתמש לדף פתיחת שיחה
//     if (!sessionId) {
//       navigate('/new-chat');
//       return;
//     }

//     // טיימר פנימי להצגת זמן שעבר בשניות (בשביל העיצוב)
//     const timer = setInterval(() => setElapsed(prev => prev + 1), 1000);

//     // מנגנון Polling - בדיקת סטטוס בשרת כל 10 שניות
//     const apiInterval = setInterval(async () => {
//       try {
//         // 1. קבלת זמן המתנה מעודכן שה-Worker חישב
//         // var session = await getSessionById(sessionId);
//         // const estimate = await getWaitTimeEstimate(session.idTopic);
//         // setWaitTime(estimate);

//         // 2. בדיקת סטטוס השיחה - האם נציג משך את הלקוח?
//         const currentSession = await getSessionById(sessionId);
//         setSessionData(currentSession);

//         // אם הסטטוס הפך ל-Active (1), עוברים לצ'אט
//         if (currentSession.statusChat === SessionStatus.Active) {
//           clearInterval(apiInterval);
//           navigate('/customer-chat', { state: { sessionId, SenderType: 0 } });
//         }
//       } catch (err) {
//         console.error("שגיאה בעדכון נתוני המתנה:", err);
//       }
//     }, 10000);

//     return () => {
//       clearInterval(timer);
//       clearInterval(apiInterval);
//     };
//   }, [sessionId, navigate]);

//   return (
//     <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
//       <WaitingRoomSection 
//         session={sessionData} 
//         elapsed={elapsed} 
//         waitTime={waitTime} 
//       />
//     </div>
//   );
// };

// export default WaitingRoomPage;