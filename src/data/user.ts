import { AUTH_CRED } from '@/utils/constants';
import { Routes } from '@/config/routes';
import Cookies from 'js-cookie';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from './client/api-endpoints';
import { userClient } from './client/user';
import { User, QueryOptionsType, UserPaginator } from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import axios from 'axios';
import { setEmailVerified } from '@/utils/auth-utils';
import { useEffect, useMemo, useState } from 'react';

// Function to get cookie value
function getCookie(name: string): string | null {
  if (typeof window === 'undefined') {
    // We are on the server, return null
    return null;
  }

  const cookieArr = document.cookie.split(';');

  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split('=');

    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
}

// Service to get user details
export class UserService {
  static getUserDetails() {
    // Extract token from cookie or localStorage
    let authToken = getCookie('AUTH_CRED') || localStorage.getItem('authToken');
    let username: string | null = null;
    let sub: string | null = null;

    if (authToken) {
      // Parse the JWT token
      try {
        const base64Url = authToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );

        const data = JSON.parse(jsonPayload);

        // Extract username and sub
        username = data.username;
        sub = data.sub;
      } catch (error) {
        console.error("Error parsing JWT token:", error);
      }
    }

    return { username, sub };
  }
}

export const useMeQuery = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [userDetails, setUserDetails] = useState(() => UserService.getUserDetails());

  useEffect(() => {
    const user = UserService.getUserDetails();
    setUserDetails(user);
  }, []);

  const { username, sub } = userDetails;

  const userDataQuery = useQuery<User, Error>(
    [API_ENDPOINTS.ME, { username, sub }],
    () => userClient.me({ username, sub }),
    {
      enabled: !!username && !!sub,
      initialData: () => {
        const cachedData = queryClient.getQueryData<User>([API_ENDPOINTS.ME, { username, sub }]);
        return cachedData;
      },
      retry: false,
      onError: (err) => {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 409) {
            setEmailVerified(false);
            router.replace(Routes.verifyEmail);
          } else {
            toast.error('Error fetching user data');
          }
        }
      },
    }
  );

  const memoizedUserDataQuery = useMemo(() => userDataQuery, [userDataQuery]);

  if (!username || !sub) {
    return {
      data: null,
      isLoading: false,
      isError: false,
      error: null,
      refetch: () => { },
    };
  }

  return memoizedUserDataQuery;
};

export function useLogin() {
  return useMutation(userClient.login);
}

export const useLogoutMutation = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const logoutMutation = useMutation(userClient.logout, {
    onSuccess: () => {
      // Check if logout occurred due to a window refresh
      const isWindowRefresh = !router.query.noredirect;

      if (isWindowRefresh) {
        console.log('Logout: Window Refresh');
      } else {
        console.log('Logout: Route Change');
      }

      // Remove auth credentials and redirect to login route
      Cookies.remove(AUTH_CRED);
      router.replace(Routes.login);
      toast.success(t('common:successfully-logout'));
    },
    onError: (error) => {
      console.error('Logout Error:', error);
    }
  });

  return logoutMutation;
};

export const useRegisterMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  // console.log(t, queryClient)

  return useMutation(userClient.register, {
    onSuccess: () => {
      const queryParams = new URLSearchParams(window.location.search);
      const fromCheckout = queryParams.get('from') === 'checkout';

      toast.success(t('common:successfully-register'));
      // if (fromCheckout) {
      //   router.push('orders/checkout');
      // }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REGISTER);
    },
  });
};

export const useUpdateUserMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(userClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ME);
      queryClient.invalidateQueries(API_ENDPOINTS.USERS);
    },
  });
};
export const useUpdateUserEmailMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(userClient.updateEmail, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      toast.error(data?.message);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ME);
      queryClient.invalidateQueries(API_ENDPOINTS.USERS);
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation(userClient.changePassword);
};

export const useForgetPasswordMutation = () => {
  return useMutation(userClient.forgetPassword);
};
export const useResendVerificationEmail = () => {
  const { t } = useTranslation('common');
  return useMutation(userClient.resendVerificationEmail, {
    onSuccess: () => {
      toast.success(t('common:PICKBAZAR_MESSAGE.EMAIL_SENT_SUCCESSFUL'));
    },
    onError: () => {
      toast(t('common:PICKBAZAR_MESSAGE.EMAIL_SENT_FAILED'));
    },
  });
};

export const useVerifyForgetPasswordTokenMutation = () => {
  return useMutation(userClient.verifyForgetPasswordToken);
};

export const useResetPasswordMutation = () => {
  return useMutation(userClient.resetPassword);
};

export const useMakeOrRevokeAdminMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(userClient.makeAdmin, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS);
    },
  });
};

export const useBlockUserMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(userClient.block, {
    onSuccess: () => {
      toast.success(t('common:successfully-block'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS);
      queryClient.invalidateQueries(API_ENDPOINTS.STAFFS);
    },
  });
};

export const useUnblockUserMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(userClient.unblock, {
    onSuccess: () => {
      toast.success(t('common:successfully-unblock'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS);
      queryClient.invalidateQueries(API_ENDPOINTS.STAFFS);
    },
  });
};

export const useAddWalletPointsMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(userClient.addWalletPoints, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS);
    },
  });
};

export const useUserQuery = ({ id }: { id: string }) => {
  return useQuery<User, Error>(
    [API_ENDPOINTS.USERS, id],
    () => userClient.fetchUser({ id }),
    {
      enabled: Boolean(id),
    }
  );
};

export const useVendorQuery = (usrById: number) => {
  const type: string = API_ENDPOINTS.VENDOR_LIST;
  return useQuery<User, Error>(
    [API_ENDPOINTS.USERS, type, usrById],
    () => userClient.fetchVendor({ type, usrById }),
    {
      enabled: Boolean(type),
    }
  );
};

export const useUsersQuery = (params: Partial<QueryOptionsType>) => {
  const { data, isLoading, error } = useQuery<UserPaginator, Error>(
    [API_ENDPOINTS.USERS, params],
    () => userClient.fetchUsers(params),
    {
      keepPreviousData: true,
    }
  );

  return {
    users: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data as any),
    loading: isLoading,
    error,
  };
};

export const useAdminsQuery = (params: Partial<QueryOptionsType>) => {
  const { data, isLoading, error } = useQuery<UserPaginator, Error>(
    [API_ENDPOINTS.ADMIN_LIST, params],
    () => userClient.fetchAdmins(params),
    {
      keepPreviousData: true,
    }
  );

  return {
    admins: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data as any),
    loading: isLoading,
    error,
  };
};


//  profile update function
export const useUpdateProfileMutation = () => {

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(userClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ME);
      queryClient.invalidateQueries(API_ENDPOINTS.PROFILE_UPDATE);
    },
  })
}