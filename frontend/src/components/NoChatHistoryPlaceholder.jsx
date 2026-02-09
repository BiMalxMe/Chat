import { MessageCircleIcon, UsersIcon } from "lucide-react";

const NoChatHistoryPlaceholder = ({ name, isGroup = false }) => {
  const getPlaceholderText = () => {
    if (isGroup) {
      return {
        title: `Start the conversation in ${name}`,
        description: "This is the beginning of the group conversation. Send a message to start chatting with everyone!",
        suggestions: [
          "👋 Hey everyone!",
          "🎉 Great to be here!",
          "💬 Let's introduce ourselves",
        ]
      };
    } else {
      return {
        title: `Start your conversation with ${name}`,
        description: "This is the beginning of your conversation. Send a message to start chatting!",
        suggestions: [
          "👋 Say Hello",
          "🤝 How are you?",
          "📅 Meet up soon?",
        ]
      };
    }
  };

  const { title, description, suggestions } = getPlaceholderText();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 rounded-full flex items-center justify-center mb-5">
        {isGroup ? (
          <UsersIcon className="size-8 text-cyan-400" />
        ) : (
          <MessageCircleIcon className="size-8 text-cyan-400" />
        )}
      </div>
      <h3 className="text-lg font-medium text-slate-200 mb-3">
        {title}
      </h3>
      <div className="flex flex-col space-y-3 max-w-md mb-5">
        <p className="text-slate-400 text-sm">
          {description}
        </p>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mx-auto"></div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="px-4 py-2 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-full hover:bg-cyan-500/20 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;
