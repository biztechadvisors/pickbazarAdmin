'use client';
import React, { useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Card from '@/components/common/card';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Button from '@/components/ui/button';
import { useQuery } from 'react-query';
import { permissionClient } from '@/data/client/permission';
import PermissionJson from '../../../../public/static/permission.json';
import { usePermissionData, useSavePermissionData } from '@/data/permission';
import { useMeQuery, useUserQuery } from '@/data/user';
import { getAuthCredentials } from '@/utils/auth-utils';
import { newPermission } from '@/contexts/permission/storepermission';
import { useAtom } from 'jotai';
import OwnerLayout from '@/components/layouts/owner';
import { ADMIN, Company, DEALER, OWNER, STAFF } from '@/utils/constants';
import AdminLayout from '@/components/layouts/admin';
import { CreatePermissionInput, permissionType as PermissionType } from '@/types';
import useFormValues from '@/lib/hooks/use-form-values';
import { randomStaffPermissions } from '@/utils/defaultValues';

function Loader() {
  return null;
}

const CreatePermission = ({
  permissionType,
  defaultPermissions,
  onPermissionCreated,
  onData,
}: CreatePermissionInput) => {
  const { data: me } = useMeQuery()
  const isDealer = me?.permission?.type_name === PermissionType.DEALER;
  const router = useRouter();
  const { t } = useTranslation();
  // const [typeName, setTypeName] = useState(PermissionJson.type_name);
  const [typeName, setTypeName] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [menusData, setMenusData] = useState(PermissionJson.Menus);
  const [permissionName, setPermissionName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState(
    defaultPermissions ? defaultPermissions : []
  );
  const [typeError, setTypeError] = useState('');
  const [permissionError, setPermissionError] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    if (isDealer) setSelectedPermissions(randomStaffPermissions)
  }, [isDealer]);

  const {
    // isLoading: loading,
    isEqual,
    setIsEqual,
    doesPermissionMatch,
    setPermissionName: setName
  } = useFormValues();


  if (permissionType)
    setIsEqual(
      doesPermissionMatch(
        selectedPermissions,
        // defaultPermissions ? defaultPermissions : []
      )
    );
  const { permissions } = getAuthCredentials();

  const [matched, _] = useAtom(newPermission);

  const permissionId = router.query.id;

  const { data: meData } = useMeQuery();

  const createdById = meData?.createdBy?.id;

  // Fetch the createdBy user's data
  const {
    data: createdByUser,
    isLoading: createdByLoading,
    error: createdByError,
  } = useUserQuery({ id: createdById }, { enabled: !!createdById });

  const { id } = meData || {};

  const { data: singlePermissionData, isLoading: isPermissionLoading } = useQuery(
    ['permissionById', permissionId],
    () => permissionClient.getPermissionById(permissionId),
    { enabled: !!permissionId }
  );

  const { mutateUpdate, mutatePost } = useSavePermissionData();

  useEffect(() => {
    if (singlePermissionData && singlePermissionData.length > 0) {
      setTypeName([singlePermissionData?.[0].type_name]);
      setPermissionName(singlePermissionData?.[0].permissionName);
      const formattedPermissions = singlePermissionData?.[0]?.permission?.map(
        (perm: any, i: any) => ({
          id: perm.id,
          type: perm.type,
          read: perm.read,
          write: perm.write,
        })
      );
      setSelectedPermissions(formattedPermissions);
    }
    setIsLoading(false);
  }, [singlePermissionData]);

  const handleChange = (e: any) => {
    setSelectedType(e.target.value);
    setTypeError('');
  };

  const handlePermissionNameChange = (e: any) => {
    setPermissionName(e.target.value);
    setPermissionError('');
  };

  const handleCheckboxChange = (menuItem: any, type: any, isChecked: boolean) => {

    if (typeof onData === 'function') {
      onData(true);
    } else {
      console.error('onData is not a function');
    }

    setSelectedPermissions((prevPermissions) => {

      const permissionIndex = prevPermissions.findIndex(
        (p) => p.type === menuItem
      );

      if (permissionIndex !== -1) {
        const updatedPermissions = [...prevPermissions];
        updatedPermissions[permissionIndex] = {
          ...updatedPermissions[permissionIndex],
          [type]: isChecked,
        };

        // If both read and write are false, remove the permission
        if (
          !updatedPermissions[permissionIndex].read &&
          !updatedPermissions[permissionIndex].write
        ) {
          updatedPermissions.splice(permissionIndex, 1);
        }
        return updatedPermissions;
      } else {
        if (isChecked) {
          return [
            ...prevPermissions,
            { type: menuItem, read: type === 'read', write: type === 'write' },
          ];
        }
      }

      return prevPermissions;
    });
  };


  const handleSavePermission = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!permissionName) {
      setPermissionError('Please enter a permission name.');
      return;
    }

    let typeToSend = selectedType || permissionType;

    if (!selectedType && !permissionType) {
      const firstType = Object.values(typeName)[0];
      typeToSend = firstType;
      setSelectedType(firstType);
    }

    const dataToSend = {
      type_name: typeToSend,
      user: id,
      permission_name: permissionName,
      permissions: selectedPermissions,
    };

    try {
      if (router.query.id) {
        const permissionId = router.query.id;
        const response = await mutateUpdate({ permissionId, dataToSend }); // ✅ Await the response
      } else {
        if (permissionType) setName(permissionName);
        const response = await mutatePost(dataToSend); // ✅ Await the response

        if (onPermissionCreated && response) {
          onPermissionCreated(response);
        }
      }
    } catch (error) {
      console.error('Error saving/updating permission:', error);
      toast.error('Error');
    }
  };

  const createdByRole = createdByUser?.permission?.type_name;
  const isCreatedByOwner = createdByRole === OWNER;

  // Check if the user is an Owner or a Staff member created by an Owner
  const isOwner = permissions?.includes(OWNER);
  const isStaffCreatedByOwner = permissions?.includes(STAFF) && isCreatedByOwner;

  const filteredData = () => {
    if (isOwner || isStaffCreatedByOwner) {
      const data = Object.entries(menusData).map(([key, value], index) => ({
        [key]: value,
        id: index + 1,
      }));

      return data;
    } else {
      const newArrayData = matched.map((item) => item.type);
      const menusDataArray = Object.values(menusData);

      const finalArray = newArrayData.filter((item) =>
        menusDataArray.includes(item)
      );

      const last = finalArray.map((item) => {
        return Object.fromEntries(
          Object.entries(menusData).filter(([key, value]) => value === item)
        );
      });

      return last;
    }
  };

  // const newTypesRole = PermissionJson.type_name.filter((item) => item.value != meData?.permission.type_name)
  const newTypesRole = Object.fromEntries(
    Object.entries(PermissionJson.type_name)
      .filter(([key, value]) => value !== meData?.permission.type_name)
  );

  useEffect(() => {
    if (isOwner || isStaffCreatedByOwner) {
      setTypeName(newTypesRole);
    } else {
      const permList = permissions;
      const newArray = Object.values(PermissionJson.type_name);
      const filteredArray = newArray.filter((e) => permList.includes(e));

      let updatedTypeName = [];

      for (let i = 0; i < filteredArray.length; i++) {
        switch (filteredArray[i]) {
          case OWNER:
            updatedTypeName.push(ADMIN, Company, DEALER, STAFF);
            break;
          case ADMIN:
            updatedTypeName.push(Company, DEALER, STAFF);
            break;
          case Company:
            updatedTypeName.push(DEALER, STAFF);
            break;
          case DEALER:
            updatedTypeName.push(STAFF);
            break;
          case STAFF:
            updatedTypeName.push(Company);
            break;
          default:
            updatedTypeName = [];
        }
      }

      setTypeName(updatedTypeName);
    }
  }, []);

  if (isLoading || createdByLoading || isPermissionLoading) {
    return <Loader />; // Render a loading state
  }

  const content = (
    <>
      <div
        className={`mb-4 md:mb-0 md:w-1/4 ${permissionType ? 'hidden' : ''}`}
      >
        <h1 className="text-xl font-semibold text-heading">
          Permission Management
        </h1>
      </div>

      <div className={`mx-4 md:w-1/4 ${permissionType ? 'hidden' : ''}`}>
        <label
          htmlFor="typename"
          className="block text-sm font-medium text-gray-700"
        >
          {t('ROLE / PERMISSION TYPE')}
        </label>
        <select
          id="typename"
          name="typename"
          className={`mt-1 block w-full rounded-md border bg-gray-100 p-2 ${typeError && 'border-red-500'
            }`}
          onChange={(e) => handleChange(e)}
          value={selectedType}
        // disabled={isDealer}
        >
          {Object.values(typeName).map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
        {typeError && <p className="mt-1 text-sm text-red-500">{typeError}</p>}
      </div>

      <div className={`md:w-1/4 ${isEqual ? 'hidden' : 'mt-3'}`}>
        <label
          htmlFor="permission"
          className="block text-sm font-medium text-gray-700"
        >
          {t('PERMISSIONS NAME')}
        </label>
        <input
          type="text"
          id="permission"
          name="permission"
          className={`mt-1 block w-full rounded-md border bg-gray-100 p-2 ${permissionError && 'border-red-500'
            }`}
          placeholder="Enter permissions"
          value={permissionName}
          onChange={(e) => handlePermissionNameChange(e)}
        />
        {permissionError && (
          <p className="mt-1 text-sm text-red-500">{permissionError}</p>
        )}
      </div>
    </>
  );

  return (
    <>
      {permissionType ? (
        <div className="mb-8 flex flex-col items-center xl:flex-row">
          {content}
        </div>
      ) : (
        <Card className="mb-8 flex flex-col items-center xl:flex-row">
          {content}
        </Card>
      )}
      <div className="order-2 col-span-12 sm:col-span-6 xl:order-1 xl:col-span-4 3xl:col-span-3">
        <div className="flex flex-col items-center rounded bg-white px-6 py-8">
          <table className="w-full">
            <thead>
              <tr>
                <th className="border p-2">SL.NO</th>
                <th className="border p-2">ENTITY</th>
                <th className="border p-2">READ</th>
                <th className="border p-2">WRITE</th>
              </tr>
            </thead>
            <tbody>
              {filteredData().map((item, index) => {
                const key = Object.keys(item)[0];
                const value = Object.values(item)[0];

                const defaultPermission = defaultPermissions?.find(
                  (p) => p.type === value
                );

                return (
                  <tr key={index}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{key}</td>
                    <td className="items-center justify-center border p-2">
                      <input
                        className="items-center justify-center"
                        type="checkbox"
                        id={`readCheckbox${index}`}
                        onChange={(e) =>
                          handleCheckboxChange(value, 'read', e.target.checked)
                        }
                        checked={
                          selectedPermissions.find((p) => p.type === value)
                            ?.read ??
                          defaultPermission?.read ??
                          false
                        }
                      />
                    </td>
                    <td className="items-center justify-center border p-2">
                      <input
                        className="items-center justify-center"
                        type="checkbox"
                        id={`writeCheckbox${index}`}
                        onChange={(e) =>
                          handleCheckboxChange(value, 'write', e.target.checked)
                        }
                        checked={
                          selectedPermissions.find((p) => p.type === value)
                            ?.write ??
                          defaultPermission?.write ??
                          false
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {!isEqual && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={router.back}
            className="m-4"
            type="button"
          >
            {t('form:button-label-back')}
          </Button>
          <Button onClick={handleSavePermission} className="mt-4">
            Save Permission
          </Button>
        </div>
      )}
    </>
  );
};

// Determine layout conditionally based on permissions
CreatePermission.Layout =
  getAuthCredentials().permissions?.[0] === OWNER ? OwnerLayout : AdminLayout;

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});

export default CreatePermission;
