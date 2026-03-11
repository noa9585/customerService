import { useEffect, useState, useCallback } from 'react';

export type WaitingSession = {
  id: number;
  customer_name: string;
  topic_name: string;
  queue_position: number;
  estimated_wait_minutes: number;
  status: 'waiting' | 'connected' | 'cancelled';
};

export const useWaitingRoom = (initial?: Partial<WaitingSession>) => {
  const [session, setSession] = useState<WaitingSession>({
    id: initial?.id ?? 0,
    customer_name: initial?.customer_name ?? 'לקוח/ה',
    topic_name: initial?.topic_name ?? 'נושא',
    queue_position: initial?.queue_position ?? 1,
    estimated_wait_minutes: initial?.estimated_wait_minutes ?? 3,
    status: (initial?.status as WaitingSession['status']) ?? 'waiting',
  });

  // elapsed seconds since queued
  const [elapsed, setElapsed] = useState<number>((initial && 0) || 4 * 60 + 55);

  useEffect(() => {
    if (session.status !== 'waiting') return;
    const t = setInterval(() => setElapsed((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [session.status]);

  const cancel = useCallback(() => {
    
    setSession((s) => ({ ...s, status: 'cancelled' }));
  }, []);

  const connect = useCallback(() => {
    setSession((s) => ({ ...s, status: 'connected' }));
  }, []);

  const setFromServer = useCallback((data: Partial<WaitingSession>) => {
    setSession((s) => ({ ...s, ...data }));
  }, []);

  return {
    session,
    setSession: setFromServer,
    elapsed,
    estimated: session.estimated_wait_minutes * 60,
    cancel,
    connect,
  } as const;
};

export default useWaitingRoom;
