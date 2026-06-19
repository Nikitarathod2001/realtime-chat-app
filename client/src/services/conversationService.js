import api from "./api";

export const startConversation = async (participantId) => {

  const response = await api.post("/conversations/start", {participantId});
  return response.data;

};

export const getConversations = async () => {

  const response = await api.get("/conversations");

  return response.data;

};