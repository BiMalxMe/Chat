import { Server } from "socket.io";
import http from "http";
import express from "express";
import axios from "axios";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

export function getReceiverSocketId(userId) {
  const socketId = userSocketMap[userId];
  return socketId;
}

const userSocketMap = {};

const quizRooms = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);

  const userId = socket.userId;
  const userName = socket.user.fullName;
  userSocketMap[userId] = socket.id;
  
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // WebRTC signaling events
  socket.on("call-user", ({ targetUserId, signalData }) => {
    const targetSocketId = userSocketMap[targetUserId];
    if (targetSocketId) {
      io.to(targetSocketId).emit("incoming-call", {
        callerId: userId,
        callerName: userName,
        signalData
      });
    }
  });

  socket.on("answer-call", ({ callerId, signalData }) => {
    const callerSocketId = userSocketMap[callerId];
    if (callerSocketId) {
      io.to(callerSocketId).emit("call-answered", {
        answererId: userId,
        answererName: userName,
        signalData
      });
    }
  });

  socket.on("end-call", ({ targetUserId }) => {
    const targetSocketId = userSocketMap[targetUserId];
    if (targetSocketId) {
      io.to(targetSocketId).emit("call-ended", {
        callerId: userId
      });
    }
  });

  socket.on("ice-candidate", ({ targetUserId, candidate }) => {
    const targetSocketId = userSocketMap[targetUserId];
    if (targetSocketId) {
      io.to(targetSocketId).emit("ice-candidate", {
        candidate,
        senderId: userId
      });
    }
  });

  // Quiz events
  socket.on("invite-to-quiz", ({ targetUserId }) => {
    const targetSocketId = userSocketMap[targetUserId];
    if (targetSocketId) {
      io.to(targetSocketId).emit("quiz-invitation", {
        inviterId: userId,
        inviterName: userName
      });
    }
  });

  socket.on("accept-quiz-invitation", async ({ inviterId }) => {
    const inviterSocket = io.sockets.sockets.get(userSocketMap[inviterId]);
    const inviterSocketId = userSocketMap[inviterId];
    if (!inviterSocketId) return;
    
    const inviterName = inviterSocket?.user?.fullName || "Player";
    
    const roomId = `quiz-${Date.now()}`;
    const players = [userId, inviterId];
    
    // Fetch questions from Open Trivia Database API
    let questions = [];
    try {
      const response = await axios.get("https://opentdb.com/api.php?amount=5&type=multiple");
      const data = response.data;
      
      if (data.results) {
        questions = data.results.map((q, index) => ({
          id: index,
          question: decodeHTML(q.question),
          options: shuffleArray([...q.incorrect_answers, q.correct_answer]),
          correctAnswer: q.correct_answer,
          results: null
        }));
      }
    } catch (error) {
      console.error("Failed to fetch quiz questions:", error);
      // Fallback questions
      questions = getFallbackQuestions();
    }
    
    quizRooms[roomId] = {
      roomId,
      players,
      playerNames: { [userId]: userName, [inviterId]: inviterName },
      answers: {},
      scores: { [userId]: 0, [inviterId]: 0 },
      currentQuestionIndex: 0,
      state: "started",
      questions
    };
    
    socket.join(roomId);
    io.sockets.sockets.get(inviterSocketId)?.join(roomId);
    
    io.to(roomId).emit("quiz-started", {
      roomId,
      players,
      player1Name: userName,
      player2Name: inviterName,
      questions
    });
  });

  socket.on("submit-quiz-answer", ({ roomId, answer, questionId }) => {
    const quizRoom = quizRooms[roomId];
    if (!quizRoom) return;
    
    quizRoom.answers[userId] = { answer, questionId };
    
    socket.emit("quiz-answer-submitted", { received: true });
    
    const answeredPlayers = Object.keys(quizRoom.answers);
    const isTimeout = answer === "";
    
    // Check if we should reveal: both answered OR one timed out
    if (answeredPlayers.length === 2 || isTimeout) {
      const questionData = quizRoom.questions?.[questionId];
      const correctAnswer = questionData?.correctAnswer;
      
      let newScores = { ...quizRoom.scores };
      
      Object.entries(quizRoom.answers).forEach(([playerId, { answer }]) => {
        // Only award points if answer is not empty (not a timeout)
        if (answer && answer === correctAnswer) {
          newScores[playerId] += 10;
        }
      });
      
      quizRoom.scores = newScores;
      quizRoom.answers = {};
      
      io.to(roomId).emit("quiz-all-answered", {
        correctAnswer,
        newScores
      });
    }
  });

  socket.on("quiz-finished", ({ roomId }) => {
    const quizRoom = quizRooms[roomId];
    if (!quizRoom) return;
    
    const score1 = quizRoom.scores[quizRoom.players[0]];
    const score2 = quizRoom.scores[quizRoom.players[1]];
    
    let winnerId;
    if (score1 > score2) {
      winnerId = quizRoom.players[0];
    } else if (score2 > score1) {
      winnerId = quizRoom.players[1];
    } else {
      // Tie - no winner
      winnerId = null;
    }
    
    const winnerName = winnerId === null ? "It's a Tie!" : (winnerId === userId ? "You" : quizRoom.playerNames[winnerId]);
    
    io.to(roomId).emit("quiz-finished", {
      scores: quizRoom.scores,
      winner: winnerId,
      winnerName
    });
    
    delete quizRooms[roomId];
  });

  socket.on("leave-quiz", ({ roomId }) => {
    const quizRoom = quizRooms[roomId];
    if (quizRoom) {
      socket.to(roomId).emit("player-left-quiz");
      delete quizRooms[roomId];
    }
    socket.leave(roomId);
  });

  socket.on("reject-quiz-invitation", ({ inviterId }) => {
    const inviterSocketId = userSocketMap[inviterId];
    if (inviterSocketId) {
      io.to(inviterSocketId).emit("quiz-invitation-rejected", {
        rejecterName: userName
      });
    }
  });
});

// Helper functions
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

function getFallbackQuestions() {
  return [
    {
      id: 0,
      question: "What is the capital of Nepal?",
      options: shuffleArray(["Pokhara", "Kathmandu", "Lalitpur", "Bhaktapur"]),
      correctAnswer: "Kathmandu",
      results: null
    },
    {
      id: 1,
      question: "What is the height of Mount Everest?",
      options: shuffleArray(["8,848 meters", "9,000 meters", "8,500 meters", "7,848 meters"]),
      correctAnswer: "8,848 meters",
      results: null
    },
    {
      id: 2,
      question: "Who was the first King of Nepal?",
      options: shuffleArray(["King Prithvi Narayan Shah", "King Tribhuvan", "King Gyanendra", "King Mahendra"]),
      correctAnswer: "King Prithvi Narayan Shah",
      results: null
    },
    {
      id: 3,
      question: "What is the national animal of Nepal?",
      options: shuffleArray(["Tiger", "Cow", "Snow Leopard", "Rhino"]),
      correctAnswer: "Cow",
      results: null
    },
    {
      id: 4,
      question: "What is the currency of Nepal?",
      options: shuffleArray(["Rupee", "Dollar", "Taka", "Yen"]),
      correctAnswer: "Rupee",
      results: null
    }
  ];
}

export { io, app, server };
