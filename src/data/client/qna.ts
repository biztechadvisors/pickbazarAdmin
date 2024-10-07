import { Qna, QnaInput, QnaQueryOptions, QnaPaginator } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';
import { InputType } from 'zlib';

export const qnaClient = {
  ...crudFactory<Qna, any, QnaInput>(API_ENDPOINTS.QNA),

  // Method to get a single QnA item by ID
  get({ id, language }: { id: string; language: string }) {
    console.log(id, '  = QnA ID');
    return HttpClient.get<Qna>(`${API_ENDPOINTS.FAQ}/qna/${id}`, {
      language,
    });
  },

  createQna: (data: InputType, faqId: string) => {
    console.log('Ashishashish', faqId);
    const endpoint = `${API_ENDPOINTS.FAQ}/${faqId}/qna`; // Construct the endpoint with faqId
    console.log('Sending QnA data:', data);
    return HttpClient.post<Qna>(endpoint, data); // Send the POST request
  },

  updateQna: (data: InputType, qnaId: number) => {
    console.log('Updating QnA with qnaId:', qnaId);
    const endpoint = `${API_ENDPOINTS.FAQ}/qna/${qnaId}`; // Endpoint to update QnA
    console.log('Sending updated QnA data:', data);
    return HttpClient.put<Qna>(endpoint, data); // PUT request to update the QnA
  },

  deleteQna: (qnaId: number) => {
    console.log('qnaId:', qnaId);
    const endpoint = `${API_ENDPOINTS.FAQ}/qna/${qnaId}`; // Endpoint to delete QnA
    return HttpClient.delete(endpoint); // DELETE request to remove the QnA
  },

  // Method to get paginated QnA items
  paginated: ({ faqId, ...params }: { faqId: number }) => {
    console.log('faqId', faqId); // Debugging
    // Make sure faqId is passed and used in the correct API endpoint
    if (faqId) {
      return HttpClient.get<QnaPaginator>(
        `${API_ENDPOINTS.FAQ}/${faqId}${API_ENDPOINTS.QNA}`
      );
    }
  },
};
