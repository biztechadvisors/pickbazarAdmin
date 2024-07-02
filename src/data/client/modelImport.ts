
// import { HttpClient } from './http-client';

// export const importModelClient = {
//   importCsv: async (url: string, variables: { file: File; shopSlug: string }) => {
//     let formData = new FormData();
//     formData.append('file', variables.file);
//     console.log('File:', variables.file.name);
//     console.log('shopSlug:', variables.shopSlug);

//     const fullUrl = `${url}?shop_slug=${variables.shopSlug}`;

//     console.log('Full URL:', fullUrl);

//     const options = {
//       headers: {
//         'Content-Type': 'multipart/form-data', 
//       },
//     };

//     try {
//       const response = await HttpClient.post<any>(fullUrl, formData, options);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
// };

 import { HttpClient } from './http-client';

export const importModelClient = {
  importCsv: async (url: string, variables: { file: File; shopSlug: string }, onUploadProgress: (progressEvent: ProgressEvent) => void) => {
    let formData = new FormData();
    formData.append('file', variables.file);
    console.log('File:', variables.file.name);
    console.log('shopSlug:', variables.shopSlug);

    const fullUrl = `${url}?shop_slug=${variables.shopSlug}`;

    console.log('Full URL:', fullUrl);

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

