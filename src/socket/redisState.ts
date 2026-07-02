import redis from "../config/redis.js";

export interface RoomState { 
    roomId: string; 
    candidateId: number; 
    interviewerId: number; 
    queId: number; 
    code: string; 
    language: string; 
    timerElapsedTime?: number;
    timerRunning?: boolean;
    timerStarted?: boolean;
    updatedAt: string; 
}

const KEY = "interview:room:";

export const getRoomState = async (roomId: string): Promise<RoomState | null> => {
  const data = await redis.get(KEY + roomId);
  return data ? JSON.parse(data) : null;
};

export const saveRoomState = async (roomId: string, state: RoomState) => {
  await redis.set(KEY + roomId, JSON.stringify(state));
};

export const deleteRoomState = async (roomId: string) => {
  await redis.del(KEY + roomId);
};