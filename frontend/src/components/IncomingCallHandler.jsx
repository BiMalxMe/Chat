import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import AudioCall from './AudioCall';

const IncomingCallHandler = () => {
  const { socket } = useAuthStore();
  const [incomingCall, setIncomingCall] = useState(null);
  
  // Ref helps listeners see the REAL current state, avoiding stale closures
  const activeCallRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = ({ callerId, callerName, signalData }) => {
      // Ignore if we are already in a call
      if (activeCallRef.current) return;

      const newCall = { callerId, callerName, signalData };
      activeCallRef.current = newCall;
      setIncomingCall(newCall);
    };

    const handleCallEnded = () => {
      activeCallRef.current = null;
      setIncomingCall(null);
    };

    socket.on('incoming-call', handleIncomingCall);
    socket.on('call-ended', handleCallEnded);

    return () => {
      socket.off('incoming-call', handleIncomingCall);
      socket.off('call-ended', handleCallEnded);
    };
  }, [socket]);

  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <AudioCall
        isIncomingCall={true}
        incomingCallInfo={incomingCall}
        targetUserName={incomingCall.callerName}
        onClose={() => {
          activeCallRef.current = null;
          setIncomingCall(null);
        }}
      />
    </div>
  );
};

export default IncomingCallHandler;