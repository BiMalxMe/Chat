import { useQuizStore } from "../store/useQuizStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

function QuizInvitation() {
  const { invitation, setInvitation, clearInvitation } = useQuizStore();
  const { socket } = useAuthStore();
  
  if (!invitation) return null;
  
  const acceptInvitation = () => {
    socket?.emit("accept-quiz-invitation", { inviterId: invitation.inviterId });
    clearInvitation();
  };
  
  const rejectInvitation = () => {
    socket?.emit("reject-quiz-invitation", { inviterId: invitation.inviterId });
    toast.success("Quiz invitation declined");
    clearInvitation();
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-slate-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl border border-slate-700">
        <div className="text-center">
          <div className="text-4xl mb-4">🧠</div>
          <h3 className="text-xl font-bold text-white mb-2">Quiz Challenge!</h3>
          <p className="text-slate-300 mb-6">
            <span className="font-medium text-cyan-400">{invitation.inviterName}</span> has challenged you to a quiz battle!
          </p>
          <div className="flex gap-3">
            <button
              onClick={rejectInvitation}
              className="flex-1 px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={acceptInvitation}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizInvitation;
