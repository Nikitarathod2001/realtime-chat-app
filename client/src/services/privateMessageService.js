import api from "../services/api";

export const getPrivateMessages = async (conversationId) => {

  const response = await api.get(`/private-messages/${conversationId}`);
  return response.data;

};