import { HttpClient } from './http-client';
import { API_ENDPOINTS } from './api-endpoints';
import { Attachment } from '@/types';

export const uploadClient = {
  upload: async (variables: any) => {
    let formData = new FormData();
    variables.forEach((attachment: any) => {
      formData.append('attachment[]', attachment);
    });
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return HttpClient.post<Attachment>(
      API_ENDPOINTS.ATTACHMENTS,
      formData,
      options
    );
  },

  delete: async (thumbnail: string) => {
    const fileKey = thumbnail.substring(thumbnail.lastIndexOf('/') + 1); // Extract file key from URL
    return HttpClient.delete(`${API_ENDPOINTS.ATTACHMENTS}/${fileKey}`);
  },

};
