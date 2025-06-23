import axiosClient from './AxiosClient';
import {
  ChatbotResponse,
  CreateChatbotResponseDTO,
  UpdateChatbotResponseDTO,
} from '../types/chatbotResponse';

const BASE_URL = '/chatbot';

const chatbotResponseApi = {
handleQuery(userInput: string) {
  return axiosClient.post<{ reply: string }>(`${BASE_URL}/query`, { message: userInput });
},

  getAll() {
    return axiosClient.get<ChatbotResponse[]>(`${BASE_URL}/responses/get`);
  },

  getById(id: number) {
    return axiosClient.get<ChatbotResponse>(`${BASE_URL}/responses/get/${id}`);
  },

  create(data: CreateChatbotResponseDTO) {
    return axiosClient.post<ChatbotResponse>(`${BASE_URL}/responses/create`, data);
  },

  update(id: number, data: UpdateChatbotResponseDTO) {
    return axiosClient.put<ChatbotResponse>(`${BASE_URL}/responses/update/${id}`, data);
  },

  delete(id: number) {
    return axiosClient.delete<{ message: string }>(`${BASE_URL}/responses/delete/${id}`);
  },

  search(keyword: string) {
    return axiosClient.get<ChatbotResponse[]>(`${BASE_URL}/responses/search`, {
      params: { keyword },
    });
  },
};

export default chatbotResponseApi;
