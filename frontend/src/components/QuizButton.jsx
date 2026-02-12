import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

function QuizButton() {
  const { selectedUser, selectedGroup } = useChatStore();
  const { socket, onlineUsers } = useAuthStore();
  
  if (!selectedUser && !selectedGroup) return null;
  
  const inviteToQuiz = () => {
    if (!selectedUser) {
      toast.error("Group quizzes coming soon!");
      return;
    }
    
    if (!onlineUsers.includes(selectedUser._id)) {
      toast.error(`${selectedUser.fullName} is not online`);
      return;
    }
    
    socket?.emit("invite-to-quiz", { targetUserId: selectedUser._id });
    toast.success(`Invited ${selectedUser.fullName} to a quiz battle!`);
  };
  
  return (
    <button
      onClick={inviteToQuiz}
      className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
      title="Invite to Quiz"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443-.29-3.5-.804V12a1 1 0 11-2 0V4.804z" />
      </svg>
    </button>
  );
}

export default QuizButton;
