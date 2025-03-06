import { PermissionItem, PermissionsProps, permissionType } from '@/types';
import { useContext } from 'react';
import { FormContext } from '@/contexts/formcontext/FormContext';
import { usePermissionData } from '@/data/permission';

const useFormValues = () => {
  const { data: permissionData, isLoading } = usePermissionData();
  const context = useContext(FormContext);

  if (context === undefined) {
    throw new Error('useFormValues must be used within a FormProvider');
  }

  const { isEqual, setIsEqual, permissionName, setPermissionName } = context;

  const permissionNameOptions = () => {
    if (!permissionData && permissionName) return {};
    return permissionData
      ?.filter(
        (permission: PermissionsProps) =>
          permission.permission_name === permissionName
      )
      ?.map((permission: { id: any; permission_name: string }) => ({
        value: permission.permission_name,
        label: permission.permission_name,
        id: permission.id,
      }));
  };

  const deepEqual = (obj1: PermissionItem, obj2: PermissionItem): boolean => {
    return (
      obj1.type === obj2.type &&
      obj1.read === obj2.read &&
      obj1.write === obj2.write
    );
  };

  const areArraysEqual = (
    arr1: PermissionItem[],
    arr2: PermissionItem[]
  ): boolean => {
    if (arr1.length !== arr2.length) return false;

    return (
      arr1.every((item1) => arr2.some((item2) => deepEqual(item1, item2))) &&
      arr2.every((item2) => arr1.some((item1) => deepEqual(item1, item2)))
    );
  };

  const doesPermissionMatch = (
    selectedPermissions: PermissionItem[]
  ): boolean => {
    return permissionData?.some((item: PermissionsProps) =>
      areArraysEqual(selectedPermissions, item.permissions)
    );
  };

  const permissionOptions = (type: permissionType) => {
    if (!permissionData) return [];
    return (
      permissionData
        ?.filter(
          (permission: PermissionsProps) => permission.type_name === type
        )
        ?.map((permission: { id: any; permission_name: string }) => ({
          value: permission.permission_name,
          label: permission.permission_name,
          id: permission.id,
        })) ?? []
    );
  };

  return {
    permissionData,
    isLoading,
    isEqual,
    permissionName,
    setPermissionName,
    setIsEqual,
    deepEqual,
    areArraysEqual,
    doesPermissionMatch,
    permissionOptions,
    permissionNameOptions,
  };
};
export default useFormValues;
