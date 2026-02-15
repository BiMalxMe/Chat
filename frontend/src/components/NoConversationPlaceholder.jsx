import { MessageCircleIcon, BrainCircuitIcon } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
        <div className="relative size-24 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
          <BrainCircuitIcon className="size-12 text-amber-400" />
        </div>
      </div>
      
      <div className="space-y-3 max-w-md">
        <h3 className="text-2xl font-bold text-white mb-2">
          Welcome to <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">SapiensChat</span>
        </h3>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Select a conversation to start chatting with smart features and enhanced privacy.
        </p>
        
        <div className="flex justify-center gap-3 pt-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-full border border-zinc-700/50">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-zinc-300 font-medium">Smart Features</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-full border border-zinc-700/50">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span className="text-xs text-zinc-300 font-medium">Secure</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-full border border-zinc-700/50">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-zinc-300 font-medium">Fast</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoConversationPlaceholder;
