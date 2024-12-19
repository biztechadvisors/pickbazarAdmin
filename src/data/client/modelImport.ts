
import { HttpClient } from './http-client';

export const importModelClient = {
  importCsv: async (url: string, variables: { file: File; shopSlug: string }, onUploadProgress: (progressEvent: ProgressEvent) => void) => {
    let formData = new FormData();
    formData.append('file', variables.file);

    const fullUrl = `${url}?shop_slug=${variables.shopSlug}`;

    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    };

    try {
      const response = await HttpClient.post<any>(fullUrl, formData, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

