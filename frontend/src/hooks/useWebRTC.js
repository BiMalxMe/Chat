import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const useWebRTC = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [incomingCallInfo, setIncomingCallInfo] = useState(null);
  const [callError, setCallError] = useState(null);
  
  const { socket } = useAuthStore();
  const peerConnection = useRef(null);
  const localStreamRef = useRef(null); // Ref for immediate access in listeners
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  // Sync Video Elements with Stream objects
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const cleanup = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
    setIsIncomingCall(false);
    setIncomingCallInfo(null);
    setCallError(null);
  }, []);

  const initializeMedia = useCallback(async () => {
    try {
      // FIX: Changed video to true for both audio and video calls
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: true 
      });
      setLocalStream(stream);
      localStreamRef.current = stream;
      return stream;
    } catch (error) {
      console.error('Media access error:', error);
      setCallError('Camera/Microphone access denied');
      throw error;
    }
  }, []);

  const createPeerConnection = useCallback((stream, targetUserId) => {
    const pc = new RTCPeerConnection(configuration);
    
    // Add tracks to the connection
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', { targetUserId, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') setIsCallActive(true);
      if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) cleanup();
    };

    return pc;
  }, [socket, cleanup]);

  const initiateCall = useCallback(async (targetUserId) => {
    try {
      setCallError(null);
      const stream = await initializeMedia();
      const pc = createPeerConnection(stream, targetUserId);
      peerConnection.current = pc;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit('call-user', { targetUserId, signalData: offer });
    } catch (error) {
      setCallError('Call failed to start');
    }
  }, [socket, initializeMedia, createPeerConnection]);

  const answerCall = useCallback(async () => {
    if (!incomingCallInfo) return;
    try {
      const stream = await initializeMedia();
      const pc = createPeerConnection(stream, incomingCallInfo.callerId);
      peerConnection.current = pc;

      await pc.setRemoteDescription(new RTCSessionDescription(incomingCallInfo.signalData));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit('answer-call', { 
        callerId: incomingCallInfo.callerId, 
        signalData: answer 
      });

      setIsIncomingCall(false);
      setIncomingCallInfo(null);
    } catch (error) {
      setCallError('Failed to answer');
    }
  }, [socket, incomingCallInfo, initializeMedia, createPeerConnection]);

  const rejectCall = useCallback(() => {
    if (incomingCallInfo) {
      socket.emit('call-ended', { targetUserId: incomingCallInfo.callerId });
    }
    cleanup();
  }, [incomingCallInfo, socket, cleanup]);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data) => {
      if (isCallActive) {
        socket.emit('call-ended', { targetUserId: data.callerId });
        return;
      }
      setIsIncomingCall(true);
      setIncomingCallInfo(data);
    };

    const handleCallAnswered = (data) => {
      if (peerConnection.current) {
        peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.signalData));
      }
    };

    const handleIceCandidate = (data) => {
      if (peerConnection.current) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate))
          .catch(e => console.error("Error adding ICE candidate", e));
      }
    };

    socket.on('incoming-call', handleIncomingCall);
    socket.on('call-answered', handleCallAnswered);
    socket.on('call-ended', cleanup);
    socket.on('ice-candidate', handleIceCandidate);

    return () => {
      socket.off('incoming-call', handleIncomingCall);
      socket.off('call-answered', handleCallAnswered);
      socket.off('call-ended', cleanup);
      socket.off('ice-candidate', handleIceCandidate);
    };
  }, [socket, isCallActive, cleanup]);

  return {
    localStream, remoteStream, isCallActive, isIncomingCall, 
    incomingCallInfo, callError, initiateCall, answerCall, 
    endCall: cleanup, rejectCall, localVideoRef, remoteVideoRef
  };
};