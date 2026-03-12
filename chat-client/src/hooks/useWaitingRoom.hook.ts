import { useEffect, useState, useCallback, useRef } from 'react';
import { getSessionById } from '../services/chatSession.service';
import { ChatSession, SessionStatus } from '../types/chatSession.types';
import { useNavigate } from 'react-router-dom';
import { getCustomerById } from '../services/customer.service';

export const useWaitingRoom = (sessionId: number, initialWait: number) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [customerName, setCustomerName] = useState<string>('לקוח יקר'); // State ייעודי לשם
  const [waitTime, setWaitTime] = useState<number | string>(initialWait || 'מחשב...');
  const [elapsed, setElapsed] = useState(0);
  const isInitialFetchDone = useRef(false);

  const updateStatus = useCallback(async () => {
    try {
      const data = await getSessionById(sessionId);
      setSession(data);

      // שליפת שם הלקוח רק אם הוא עוד לא נשמר
      if (data && customerName === 'לקוח יקר') {
        try {
          const name = await getCustomerById(data.idCustomer);
          setCustomerName(name.nameCust || `לקוח #${data.idCustomer}`);
        } catch (err) {
          setCustomerName(`לקוח #${data.idCustomer}`);
        }
      }
      
      if (data.statusChat === SessionStatus.Active) {
        navigate('/customer-chat', { state: { sessionId, SenderType: 0 } });
      }
    } catch (err) {
      console.error("Error updating wait status:", err);
    }
  }, [sessionId, navigate, customerName]);

  useEffect(() => {
    if (!sessionId) {
      navigate('/new-chat');
      return;
    }

    if (!isInitialFetchDone.current) {
      updateStatus();
      isInitialFetchDone.current = true;
    }

    const timer = setInterval(() => setElapsed(prev => prev + 1), 1000);
    const apiInterval = setInterval(updateStatus, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(apiInterval);
    };
  }, [sessionId, updateStatus, navigate]);

  return {
    session,
    elapsed,
    customerName, // מחזירים את השם מה-State
    waitTime,
    cancel: () => window.location.href = '/new-chat'
  };
};




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
