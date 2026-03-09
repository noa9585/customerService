import React, { useState } from 'react';
import WaitingRoom from '../component/WaitingRoom';
import WaitingRoomStyled from './WaitingRoomStyled';
import { useNavigate } from 'react-router-dom';

const WaitingRoomPage: React.FC = () => {
  const navigate = useNavigate();

  // example session object shape matches what the existing component expects
  const [session, setSession] = useState<any>({
    id: 123,
    customer_name: 'יפי ליפשיץ',
    topic_name: 'תמיכה טכנית',
    queue_position: 1,
    estimated_wait_minutes: 3,
    status: 'waiting'
  });

  const handleCancel = () => {
    // For demo: navigate back to home. In real usage this should call the API.
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* To view the new styled waiting room, we render the styled component here. */}
      <WaitingRoomStyled />
    </div>
  );
};

export default WaitingRoomPage;
