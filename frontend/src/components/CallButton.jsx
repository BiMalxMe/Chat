import { Phone, Video } from 'lucide-react';
import { useState } from 'react';
import AudioCall from './AudioCall';

const CallButton = ({ targetUserId, targetUserName, isOnline = false }) => {
  const [showCallModal, setShowCallModal] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setShowCallModal(true)}
          disabled={!isOnline}
          className="btn btn-ghost btn-circle btn-sm disabled:opacity-30"
          title={`Call ${targetUserName}`}
        >
          <Phone size={18} className={isOnline ? "text-success" : ""} />
        </button>
      </div>

      {showCallModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <AudioCall
            targetUserId={targetUserId}
            targetUserName={targetUserName}
            onClose={() => setShowCallModal(false)}
          />
        </div>
      )}
    </>
  );
};

export default CallButton;