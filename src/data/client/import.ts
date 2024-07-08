import { HttpClient } from './http-client';

export const importClient = {
  importCsv: async (url: string, variables: any) => {
    let formData = new FormData();
    formData.append('csv', variables?.csv);
    formData.append('shop_id', variables?.shop_id);
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const response = await HttpClient.post<any>(url, formData, options);
    return response.data;
  },
};
// import { HttpClient } from './http-client';

// export const importClient = {
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


