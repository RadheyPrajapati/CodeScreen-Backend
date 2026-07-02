import { Server } from "socket.io"; 
import { getRoomState, saveRoomState } from "./redisState.js";

export const socketHandler = (io: Server) => {
  io.on("connection", (socket) => {

    console.log(socket.id + " connected!");
    
    socket.on("join-room", async ({ roomId, id, role }) => {
      socket.join(roomId);

      let room = await getRoomState(roomId);

      if(!room && role==='candidate') await saveRoomState(roomId, {
        roomId,
        candidateId: id,
        interviewerId: -1,
        queId: -1,
        code: "null",
        language: "c++",
        timerElapsedTime: 0,
        timerRunning: false,
        timerStarted: false,
        updatedAt: new Date().toISOString()
      });

      if(!room && role==='interviewer') await saveRoomState(roomId, {
        roomId,
        candidateId: -1,
        interviewerId: id,
        queId: -1,
        code: "null",
        language: "c++",
        timerElapsedTime: 0,
        timerRunning: false,
        timerStarted: false,
        updatedAt: new Date().toISOString()
      });

      if(room && role==='candidate'){
        room.candidateId = id;
        await saveRoomState(roomId, room);
      }

      if(room && role==='interviewer'){
        room.interviewerId = id;
        await saveRoomState(roomId, room);
      }

      socket.emit("room-state", room);
    });

    socket.on("code-change", async ({ roomId, code }) => {
      const room = await getRoomState(roomId); 
      if (!room) return;
      room.code = code; 
      room.updatedAt = new Date().toISOString();
      await saveRoomState(roomId, room);
      socket.to(roomId).emit("code-updated", room);
    });

    socket.on("language-change", async ({ roomId, language }) => {
      const room = await getRoomState(roomId); 
      if (!room) return;
      room.language = language; 
      room.updatedAt = new Date().toISOString();
      await saveRoomState(roomId, room);
      io.to(roomId).emit("language-updated", room);
    });

    socket.on("question-change", async ({ roomId, queId }) => {
      const room = await getRoomState(roomId); 
      if (!room) return;
      room.queId = queId; 
      room.updatedAt = new Date().toISOString();
      await saveRoomState(roomId, room);
      io.to(roomId).emit("question-updated", room);
    });

    socket.on("timer-change", async ({ roomId, elapsedTime, timerRunning, timerStarted }) => {
      const room = await getRoomState(roomId);
      if (!room) return;
      room.timerElapsedTime = elapsedTime;
      room.timerRunning = timerRunning;
      room.timerStarted = timerStarted;
      room.updatedAt = new Date().toISOString();
      await saveRoomState(roomId, room);
      socket.to(roomId).emit("timer-updated", { elapsedTime, timerRunning, timerStarted });
    });

    socket.on("chat-message", ({ roomId, message }) => {
      socket.to(roomId).emit("chat-message", message);
    });

    socket.on("typing-status", ({ roomId, isTyping, username }) => {
      socket.to(roomId).emit("typing-status", { isTyping, username });
    });

    socket.on("execution-change", ({ roomId, isSubmitting, testCaseResults, selectedTestCaseIndex }) => {
      socket.to(roomId).emit("execution-updated", { isSubmitting, testCaseResults, selectedTestCaseIndex });
    });

    socket.on("leave-room", ({ roomId }) => socket.leave(roomId));

    socket.on("disconnect", () => console.log("disconnected", socket.id));
  });
};