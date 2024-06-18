import {
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
  ChangePasswordInput,
  ForgetPasswordInput,
  VerifyForgetPasswordTokenInput,
  ResetPasswordInput,
  MakeAdminInput,
  BlockUserInput,
  WalletPointsInput,
  UpdateUser,
  QueryOptionsType,
  UserPaginator,
  UserQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const userClient = {
  me: (params: { username: any; sub: any }) => {
    return HttpClient.get<User>(
      `${API_ENDPOINTS.ME}?username=${params.username}&sub=${params.sub}`
    );
  },

  // login: (variables: LoginInput) => {
  //   console.log("variables", variables)
  //   const result = HttpClient.post<AuthResponse>(
  //     API_ENDPOINTS.TOKEN,
  //     variables
  //   );

  //   console.log("result", result)
  //   result
  //     .then((response) => {
  //       // Assuming the token is in the response object
  //       const token = response.token;

  //       if (token) {
  //         console.log("token", token)
  //         localStorage.setItem('authToken', token);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error during login:', error);
  //     });

  //     console.log("Result", result)
  //   return result;
  // },

  login: async (variables: LoginInput) => {
    console.log("variables", variables);

    try {
        const response = await HttpClient.post<AuthResponse>(
          API_ENDPOINTS.TOKEN,
          variables
        );
        console.log("Response", response);

        const token = response.token;
        if (token) {
          localStorage.setItem('authToken', token);
        }
        
        return response;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
},


  logout: () => {
    return HttpClient.post<any>(API_ENDPOINTS.LOGOUT, {});
  },
  register: (variables: RegisterInput) => {
    return HttpClient.post<AuthResponse>(API_ENDPOINTS.REGISTER, variables);
  },
  update: ({ id, input }: { id: string; input: UpdateUser }) => {
    return HttpClient.put<User>(`${API_ENDPOINTS.USERS}/${id}`, input);
  },
  changePassword: (variables: ChangePasswordInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.CHANGE_PASSWORD, variables);
  },
  forgetPassword: (variables: ForgetPasswordInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.FORGET_PASSWORD, variables);
  },
  verifyForgetPasswordToken: (variables: VerifyForgetPasswordTokenInput) => {
    return HttpClient.post<any>(
      API_ENDPOINTS.VERIFY_FORGET_PASSWORD_TOKEN,
      variables
    );
  },
  resetPassword: (variables: ResetPasswordInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.RESET_PASSWORD, variables);
  },
  makeAdmin: (variables: MakeAdminInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.MAKE_ADMIN, variables);
  },
  block: (variables: BlockUserInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.BLOCK_USER, variables);
  },
  unblock: (variables: BlockUserInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.UNBLOCK_USER, variables);
  },
  addWalletPoints: (variables: WalletPointsInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.ADD_WALLET_POINTS, variables);
  },
  fetchUsers: ({ email, usrById, ...params }: Partial<UserQueryOptions>) => {
    return HttpClient.get<UserPaginator>(API_ENDPOINTS.USERS, {
      searchJoin: 'and',
      with: 'wallet',
      ...params,
      usrById: usrById,
      search: HttpClient.formatSearchParams({ email }),
    });
  },
  fetchVendor: ({ type, usrById }: { type: string; usrById: number }) => {
    return HttpClient.get<User>(
      `${API_ENDPOINTS.USERS}?type=${type}&usrById=${usrById}`
    );
  },
  fetchAdmins: ({ ...params }: Partial<UserQueryOptions>) => {
    return HttpClient.get<UserPaginator>(API_ENDPOINTS.ADMIN_LIST, {
      searchJoin: 'and',
      ...params,
    });
  },
  fetchUser: ({ id }: { id: string }) => {
    return HttpClient.get<User>(`${API_ENDPOINTS.USERS}/${id}`);
  },
  resendVerificationEmail: () => {
    return HttpClient.post<any>(API_ENDPOINTS.SEND_VERIFICATION_EMAIL, {});
  },
  updateEmail: ({ email }: { email: string }) => {
    return HttpClient.post<any>(API_ENDPOINTS.UPDATE_EMAIL, { email });
  },
};
