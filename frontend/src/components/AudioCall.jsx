import { useEffect, useState } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { useWebRTC } from '../hooks/useWebRTC';
import { useAuthStore } from '../store/useAuthStore';

const AudioCall = ({ 
  targetUserId, 
  targetUserName, 
  onClose,
  isIncomingCall = false,
  incomingCallInfo = null 
}) => {
  const { socket } = useAuthStore();
  const {
    localStream, remoteStream, isCallActive, callError,
    initiateCall, answerCall, endCall, rejectCall,
    localVideoRef, remoteVideoRef
  } = useWebRTC();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Auto-initiate outgoing call
  useEffect(() => {
    if (!isIncomingCall && targetUserId) {
      initiateCall(targetUserId);
    }
  }, [isIncomingCall, targetUserId, initiateCall]);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(t => t.enabled = !t.enabled);
      setIsMuted(!localStream.getAudioTracks()[0].enabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(t => t.enabled = !t.enabled);
      setIsVideoOff(!localStream.getVideoTracks()[0].enabled);
    }
  };

  const handleEndCall = () => {
    const id = targetUserId || incomingCallInfo?.callerId;
    if (id) socket.emit('end-call', { targetUserId: id });
    endCall();
    onClose();
  };

  return (
    <div className="card w-96 bg-base-100 shadow-2xl border border-primary/20 p-6 text-center">
      <div className="flex flex-col items-center gap-4">
        {/* Media Window */}
        <div className="relative w-full aspect-video bg-neutral rounded-xl overflow-hidden shadow-inner">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <video ref={localVideoRef} autoPlay playsInline muted className="absolute bottom-2 right-2 w-24 rounded border border-white/20 shadow-lg" />
          
          {!remoteStream && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-20">
                  <span className="text-3xl">{targetUserName?.charAt(0)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold">{targetUserName || "Unknown User"}</h2>
          <p className="text-sm opacity-60">{isCallActive ? "Connected" : "Calling..."}</p>
        </div>

        {callError && <p className="text-error text-xs">{callError}</p>}

        {/* Controls */}
        <div className="flex gap-4 mt-2">
          {isIncomingCall && !isCallActive ? (
            <>
              <button onClick={answerCall} className="btn btn-circle btn-success btn-lg animate-bounce">
                <Phone />
              </button>
              <button onClick={() => { rejectCall(); onClose(); }} className="btn btn-circle btn-error btn-lg">
                <PhoneOff />
              </button>
            </>
          ) : (
            <>
              <button onClick={toggleMute} className={`btn btn-circle btn-sm ${isMuted ? 'btn-error' : 'btn-ghost bg-base-300'}`}>
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button onClick={toggleVideo} className={`btn btn-circle btn-sm ${isVideoOff ? 'btn-error' : 'btn-ghost bg-base-300'}`}>
                {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
              </button>
              <button onClick={handleEndCall} className="btn btn-circle btn-error">
                <PhoneOff />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioCall;