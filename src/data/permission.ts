import { useTranslation } from 'next-i18next';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { API_ENDPOINTS } from './client/api-endpoints';
import { toast } from 'react-toastify';
import axios from 'axios';
import { permissionClient } from './client/permission';

export const usePermissionData = () => {
        return useQuery<{ Permission: any }, Error>([API_ENDPOINTS.PERMISSION],async () => {
            const response = await permissionClient.getAllPermission();
            return response
          }
        )
}

 
  