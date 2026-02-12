import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuizStore } from "../store/useQuizStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

function QuizRoom() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [prevRound, setPrevRound] = useState(0);

  const {
    quizActive,
    roomId,
    currentQuestion,
    scores,
    round,
    maxRounds,
    quizState,
    playerNames,
    startQuiz,
    submitAnswer,
    revealAnswer,
    nextQuestion,
    updateScores,
    endQuiz,
    leaveQuiz,
    resetQuiz
  } = useQuizStore();
  
  const { socket, authUser } = useAuthStore();

  // 1. Identify IDs
  const myId = authUser?._id;
  const opponentId = useMemo(() => 
    Object.keys(scores).find(id => id !== myId), 
  [scores, myId]);

  // 2. Winner Logic based on Scores (The "String" Compare alternative)
  const myScore = scores[myId] || 0;
  const oppScore = scores[opponentId] || 0;
  
  const isMeWinner = myScore > oppScore;
  const isTie = myScore === oppScore;
  const opponentName = playerNames[opponentId] || "Opponent";

  useEffect(() => {
    if (!socket) return;
    
    socket.on("quiz-started", async (roomData) => {
      // Map IDs to Names
      const namesMap = {
        [roomData.players[0]]: roomData.player1Name,
        [roomData.players[1]]: roomData.player2Name
      };
      await startQuiz(roomData, namesMap);
      toast.success("Quiz started!");
    });
    
    socket.on("quiz-all-answered", (data) => {
      revealAnswer(data.correctAnswer);
      updateScores(data.newScores);
      
      setTimeout(() => {
        const hasMore = nextQuestion();
        if (!hasMore && roomId) {
          socket.emit("quiz-finished", { roomId });
        }
      }, 2000);
    });
    
    socket.on("quiz-finished", (endData) => {
      endQuiz(endData);
      // Determine message locally to avoid "undefined"
      if (myScore > oppScore) toast.success("Victory!");
      else if (myScore < oppScore) toast.error("Better luck next time!");
      else toast("It's a draw!");
    });
    
    socket.on("player-left-quiz", () => {
      toast.error("Other player left");
      resetQuiz();
    });
    
    return () => {
      socket.off("quiz-started");
      socket.off("quiz-all-answered");
      socket.off("quiz-finished");
      socket.off("player-left-quiz");
    };
  }, [socket, roomId, startQuiz, revealAnswer, updateScores, nextQuestion, endQuiz, resetQuiz, myScore, oppScore]);

  useEffect(() => {
    if (quizState === "question" && round !== prevRound) {
      setPrevRound(round);
      setHasSubmitted(false);
      setTimeLeft(30);
    }
  }, [quizState, round, prevRound]);

  const handleAnswer = useCallback((answer) => {
    if (hasSubmitted || quizState !== "question" || !currentQuestion) return;
    setHasSubmitted(true);
    const finalAnswer = answer === "timeout" ? "" : answer;
    submitAnswer(finalAnswer);
    socket?.emit("submit-quiz-answer", { roomId, answer: finalAnswer, questionId: currentQuestion.id });
  }, [hasSubmitted, quizState, currentQuestion, submitAnswer, socket, roomId]);

  useEffect(() => {
    if (quizState === "question" && !hasSubmitted && currentQuestion) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAnswer("timeout");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizState, hasSubmitted, currentQuestion, handleAnswer]);

  if (!quizActive && quizState !== "ended") return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-700 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-purple-500 p-1.5 rounded-lg text-xl">⚔️</span>
            <h2 className="font-bold text-white uppercase tracking-wider">Quiz Battle</h2>
          </div>
          <button onClick={() => { socket?.emit("leave-quiz", { roomId }); leaveQuiz(); }} className="text-slate-400 hover:text-white text-sm bg-slate-700 px-3 py-1 rounded-md transition-colors">
            Exit
          </button>
        </div>
        
        <div className="p-6">
          {quizState === "ended" ? (
            <div className="text-center py-6">
              <div className="text-7xl mb-4">
                {isTie ? "🤝" : (isMeWinner ? "🏆" : "🥈")}
              </div>
              
              <h3 className="text-3xl font-black text-white mb-1">
                {isTie ? "DRAW!" : (isMeWinner ? "VICTORY!" : "DEFEAT!")}
              </h3>
              
              <p className="text-lg text-slate-400 mb-8">
                {isTie ? "Both of you are equally smart!" : (isMeWinner ? "You crushed it!" : `Better luck next time!`)}
              </p>
              
              <div className="grid grid-cols-2 gap-px bg-slate-700 rounded-xl overflow-hidden border border-slate-700 mb-8">
                <div className="bg-slate-800 p-6">
                  <p className="text-cyan-400 text-xs font-bold uppercase mb-1">Your Score</p>
                  <p className="text-4xl font-black text-white">{myScore}</p>
                </div>
                <div className="bg-slate-800 p-6 border-l border-slate-700">
                  <p className="text-purple-400 text-xs font-bold uppercase mb-1">{opponentName}</p>
                  <p className="text-4xl font-black text-white">{oppScore}</p>
                </div>
              </div>
              
              <button onClick={resetQuiz} className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-500/20 transition-all active:scale-95">
                Play Another Round
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Question Header */}
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-slate-500 text-xs font-bold uppercase">Question {round} of {maxRounds}</p>
                  <div className="flex gap-1">
                    {[...Array(maxRounds)].map((_, i) => (
                      <div key={i} className={`h-1.5 w-8 rounded-full ${i < round ? "bg-purple-500" : "bg-slate-700"}`} />
                    ))}
                  </div>
                </div>
                {timeLeft > 0 && !hasSubmitted && (
                   <div className="text-2xl font-mono font-bold text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-600">
                    {timeLeft}s
                   </div>
                )}
              </div>

              {/* Question Card */}
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <p className="text-white text-xl font-semibold text-center leading-snug">
                  {currentQuestion?.question}
                </p>
              </div>
              
              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion?.options?.map((option, index) => {
                  const isCorrect = currentQuestion.results !== null && option === currentQuestion.correctAnswer;
                  const isSelected = hasSubmitted && currentQuestion.answered?.[option];
                  const isWrong = currentQuestion.results !== null && isSelected && !isCorrect;

                  let style = "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750 hover:border-slate-500";
                  if (isCorrect) style = "bg-green-500/20 border-green-500 text-green-400";
                  else if (isWrong) style = "bg-red-500/20 border-red-500 text-red-400";
                  else if (isSelected && currentQuestion.results === null) style = "bg-blue-500/20 border-blue-500 text-blue-400";

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      disabled={hasSubmitted || currentQuestion.results !== null}
                      className={`${style} group p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-left font-medium`}
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-xs group-hover:bg-slate-700 transition-colors">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Live Score Footer */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">You</p>
                    <p className="text-lg font-black text-white">{myScore}</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-700" />
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{opponentName}</p>
                    <p className="text-lg font-black text-white">{oppScore}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizRoom;