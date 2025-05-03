import api from "./api";

export const createRooms = async (roomDetail) => {
  return api.post("/rooms/create", roomDetail, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const joinChatApi = async (roomId) => {
  if (!roomId) {
    throw new Error("Room ID is required");
  }

  try {
    const response = await api.get(`/rooms/${roomId}/messages`);

    // Make sure we return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    throw error;
  }
};

export const getMessages = async (roomId, size = 20, page = 0) => {
  if (!roomId) {
    throw new Error("Room ID is required");
  }

  try {
    const response = await api.get(
      `/rooms/${roomId}/messages/room?page=${page}&size=${size}`
    );

    // Check data structure and ensure we always return an array
    if (!response.data) {
      console.warn("No data received from API");
      return [];
    }

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.content && Array.isArray(response.data.content)) {
      // Some APIs wrap the array in an object with content property
      return response.data.content;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};
