import { PERMISSIONS } from "@/utils/constants";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

interface Permission {
    id: number;
    type: string;
    // Add other properties as needed
  }  
  
  
  interface PermissionState {
    permission: Permission[];   
  }
  
  export const defaultPermission: PermissionState = {
    permission: [],  
  };
  
  export const permissionAtom = atomWithStorage(PERMISSIONS, defaultPermission);
  
  export const newPermission = atom(
    (get) => get(permissionAtom).permission,
    (get, set, data: Permission[]) => { 
      const prev = get(permissionAtom);    
      console.log("data***************", data, set)
      return set(permissionAtom, { ...prev, permission: data });
    }
  );

 