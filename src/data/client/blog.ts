import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const blogClient = {
  create: (input: any) => {
    HttpClient.post<any>(API_ENDPOINTS.BLOG, input);
  },

  getAll:(params:any)=>{
    console.log("Params", params)
    HttpClient.get<any>(`${API_ENDPOINTS.BLOG}/shop`,{
        params:params
    })
  }
};
