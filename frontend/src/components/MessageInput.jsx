import { useRef, useState, useEffect } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon, MicIcon, StopCircleIcon, SmileIcon } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import MentionInput from "./MentionInput";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voicePreview, setVoicePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const chunksRef = useRef([]);

  const { sendMessage, sendGroupMessage, selectedUser, selectedGroup, isSoundEnabled } = useChatStore();

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setVoicePreview(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setRecordingTime(0);
    setVoicePreview(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEmojiSelect = (emoji) => {
    setText(prev => prev + emoji);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    let voiceData = null;
    if (voicePreview) {
      const response = await fetch(voicePreview);
      const blob = await response.blob();
      voiceData = await blobToBase64(blob);
    }

    if (!text.trim() && !imagePreview && !voiceData) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    const messageData = {
      text: text.trim(),
      image: imagePreview,
      voice: voiceData,
    };

    if (selectedGroup) {
      await sendGroupMessage(messageData);
    } else if (selectedUser) {
      await sendMessage(messageData);
    }

    setText("");
    setImagePreview(null);
    setVoicePreview(null);
    setRecordingTime(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getPlaceholder = () => {
    if (selectedGroup) {
      return `Message ${selectedGroup.name}...`;
    } else if (selectedUser) {
      return `Message ${selectedUser.fullName}...`;
    }
    return "Type your message...";
  };

  return (
    <div className="p-4 border-t border-slate-700/50">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {voicePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center gap-3 bg-slate-800/50 rounded-lg p-3">
          <audio src={voicePreview} controls className="flex-1 h-10" />
          <button
            onClick={() => {
              setVoicePreview(null);
              setRecordingTime(0);
            }}
            className="p-2 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors"
          >
            <XIcon className="w-4 h-4 text-slate-200" />
          </button>
        </div>
      )}

      {isRecording && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center gap-3 bg-red-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 font-medium">{formatTime(recordingTime)}</span>
          </div>
          <button
            onClick={cancelRecording}
            className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/30 transition-colors"
          >
            <XIcon className="w-4 h-4 text-red-400" />
          </button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex space-x-4 relative">
        {selectedGroup ? (
          <MentionInput
            value={text}
            onChange={setText}
            placeholder={getPlaceholder()}
            disabled={isRecording}
          />
        ) : (
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              isSoundEnabled && playRandomKeyStrokeSound();
            }}
            className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder={getPlaceholder()}
          />
        )}

        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${
            showEmojiPicker ? "text-cyan-500" : ""
          }`}
        >
          <SmileIcon className="w-5 h-5" />
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${
            imagePreview ? "text-cyan-500" : ""
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        {!isRecording && !voicePreview ? (
          <button
            type="button"
            onClick={startRecording}
            className="bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors"
          >
            <MicIcon className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg px-4 transition-colors"
          >
            <StopCircleIcon className="w-5 h-5" />
          </button>
        )}

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview && !voicePreview}
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
      
      {/* Emoji Picker */}
      <EmojiPicker
        isOpen={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onEmojiSelect={handleEmojiSelect}
      />
    </div>
  );
}

export default MessageInput;
