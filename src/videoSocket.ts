import { Server, Socket } from "socket.io";

export const videoSocket = (socket: Socket, io: Server): void => {

  socket.on("join-call", (roomId: string) => {
    const videoRoomId = `${roomId}_video`;
    const room = io.sockets.adapter.rooms.get(videoRoomId);
    const roomSize = room ? room.size : 0;

    if (roomSize >= 2) {
      console.log(`🎥 Room full for videoRoomId: ${videoRoomId}`);
      socket.emit("room-full");
      return;
    }

    socket.join(videoRoomId);

    socket.to(videoRoomId).emit("user-joined");

    console.log(`🎥 ${socket.id} joined video call room ${videoRoomId}`);
  });

  socket.on("offer", ({ roomId, offer }) => {
    const videoRoomId = `${roomId}_video`;
    console.log("offer for videoRoomId", videoRoomId);

    socket.to(videoRoomId).emit("offer", offer);
  });

  socket.on("answer", ({ roomId, answer }) => {
    const videoRoomId = `${roomId}_video`;
    console.log("answer for videoRoomId", videoRoomId);

    socket.to(videoRoomId).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    const videoRoomId = `${roomId}_video`;
    socket.to(videoRoomId).emit("ice-candidate", candidate);
  });

  socket.on("leave-call", (roomId: string) => {
    const videoRoomId = `${roomId}_video`;
    socket.leave(videoRoomId);
    console.log(`🎥 ${socket.id} left video call room ${videoRoomId}`);
  });

  socket.on("disconnect", () => {
    console.log("Video disconnect:", socket.id);
  });

};