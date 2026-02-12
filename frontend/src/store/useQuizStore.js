import { create } from "zustand";

export const useQuizStore = create((set, get) => ({
  quizActive: false,
  roomId: null,
  currentQuestion: null,
  scores: {},
  round: 1,
  maxRounds: 5,
  players: [],
  quizState: "waiting",
  invitation: null,
  questions: [],
  
  setInvitation: (invitation) => set({ invitation }),
  clearInvitation: () => set({ invitation: null }),
  
  startQuiz: async (roomData, playerNames) => {
    set({
      quizActive: true,
      roomId: roomData.roomId,
      scores: { [roomData.players[0]]: 0, [roomData.players[1]]: 0 },
      round: 1,
      players: roomData.players,
      playerNames,
      quizState: "loading"
    });
    
    // Use questions from backend if available
    if (roomData.questions && roomData.questions.length > 0) {
      const formattedQuestions = roomData.questions.map((q, index) => ({
        id: q.id ?? index,
        question: decodeHTML(q.question),
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        answered: {},
        results: null
      }));
      
      set({
        questions: formattedQuestions,
        currentQuestion: formattedQuestions[0],
        quizState: "question"
      });
    } else {
      // Fallback: fetch questions from API
      try {
        const response = await fetch(
          "https://opentdb.com/api.php?amount=5&type=multiple"
        );
        const data = await response.json();
        
        if (data.results) {
          const formattedQuestions = data.results.map((q, index) => ({
            id: index,
            question: decodeHTML(q.question),
            options: shuffleArray([...q.incorrect_answers, q.correct_answer]),
            correctAnswer: q.correct_answer,
            answered: {},
            results: null
          }));
          
          set({
            questions: formattedQuestions,
            currentQuestion: formattedQuestions[0],
            quizState: "question"
          });
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
        set({ quizState: "error" });
      }
    }
  },
  
  setQuestion: (questionIndex) => {
    const { questions } = get();
    set({
      currentQuestion: questions[questionIndex],
      round: questionIndex + 1
    });
  },
  
  updateScores: (scores) => set({ scores }),
  
  submitAnswer: (answer) => {
    const { currentQuestion, roomId } = get();
    const answers = { ...currentQuestion.answered };
    answers[answer] = true;
    
    set({
      currentQuestion: {
        ...currentQuestion,
        answered: answers
      }
    });
    
    return { answer, questionId: currentQuestion.id };
  },
  
  revealAnswer: (correctAnswer) => {
    const { currentQuestion } = get();
    set({
      currentQuestion: {
        ...currentQuestion,
        results: correctAnswer
      }
    });
  },
  
  nextQuestion: () => {
    const { questions, round, maxRounds } = get();
    const nextRound = round + 1;
    
    if (nextRound <= maxRounds) {
      set({
        currentQuestion: questions[nextRound - 1],
        round: nextRound
      });
      return true;
    }
    return false;
  },
  
  endQuiz: (endData) => {
    set({
      quizActive: false,
      scores: endData.scores,
      winner: endData.winnerName,
      quizState: "ended"
    });
  },
  
  leaveQuiz: () => {
    set({
      quizActive: false,
      roomId: null,
      currentQuestion: null,
      scores: {},
      round: 1,
      players: [],
      quizState: "waiting",
      questions: []
    });
  },
  
  resetQuiz: () => {
    set({
      quizActive: false,
      roomId: null,
      currentQuestion: null,
      scores: {},
      round: 1,
      maxRounds: 5,
      players: [],
      quizState: "waiting",
      invitation: null,
      questions: []
    });
  }
}));

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
