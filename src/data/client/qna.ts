import { Qna, QnaInput, QnaQueryOptions, QnaPaginator } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';
import { InputType } from 'zlib';

export const qnaClient = {
  ...crudFactory<Qna, any, QnaInput>(API_ENDPOINTS.QNA),

  // Method to get a single QnA item by ID
  get({ id, language }: { id: string; language: string }) {
    return HttpClient.get<Qna>(`${API_ENDPOINTS.FAQ}/qna/${id}`, {
      language,
    });
  },

  createQna: (data: QnaInput) => {
    const faqId = data; // Safe access to faqId

    // Log it to verify 
    const endpoint = `${API_ENDPOINTS.FAQ}/${data.faqId}/qna`; // Construct the endpoint with faqId
    return HttpClient.post<Qna>(endpoint, data); // Send the POST request
  },

  updateQna: (data: InputType, qnaId: number) => {
    const endpoint = `${API_ENDPOINTS.FAQ}/qna/${qnaId}`; // Endpoint to update QnA
    return HttpClient.put<Qna>(endpoint, data); // PUT request to update the QnA
  },

  deleteQna: (qnaId: number) => {
    const endpoint = `${API_ENDPOINTS.FAQ}/qna/${qnaId}`; // Endpoint to delete QnA
    return HttpClient.delete(endpoint); // DELETE request to remove the QnA
  },

  // Method to get paginated QnA items
  paginated: ({ faqId, ...params }: { faqId: number }) => {
    // Make sure faqId is passed and used in the correct API endpoint
    if (faqId) {
      return HttpClient.get<QnaPaginator>(
        `${API_ENDPOINTS.FAQ}/${faqId}${API_ENDPOINTS.QNA}`
      );
    }
  },
};
