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
import { useSavePermissionData } from '@/data/permission';
import { useMeQuery } from '@/data/user';
import { getAuthCredentials } from '@/utils/auth-utils';
import { newPermission } from '@/contexts/permission/storepermission';
import { useAtom } from 'jotai';
import OwnerLayout from '@/components/layouts/owner';
import { ADMIN, DEALER, OWNER, STAFF, Company } from '@/utils/constants';
import AdminLayout from '@/components/layouts/admin';

const CreatePermission = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [typeName, setTypeName] = useState(PermissionJson.type_name);
  const [selectedType, setSelectedType] = useState('');
  const [menusData, setMenusData] = useState(PermissionJson.Menus);
  const [permissionName, setPermissionName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [typeError, setTypeError] = useState('');
  const [permissionError, setPermissionError] = useState('');

  const { permissions } = getAuthCredentials();

  const [matched, _] = useAtom(newPermission);

  const permissionId = router.query.id;

  const { data: meData } = useMeQuery();

  const { id } = meData || {};

  const { data: singlePermissionData, isLoading } = useQuery(
    ['permissionById', permissionId],
    () => permissionClient.getPermissionById(permissionId),
    { enabled: !!permissionId }
  );

  const { mutateUpdate, mutatePost } = useSavePermissionData();

  useEffect(() => {
    if (singlePermissionData) {
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
  }, [singlePermissionData]);

  const handleChange = (e: any) => {
    setSelectedType(e.target.value);
    setTypeError('');
  };

  const handlePermissionNameChange = (e: any) => {
    setPermissionName(e.target.value);
    setPermissionError('');
  };

  const handleCheckboxChange = (menuItem: any, type: any, isChecked: any) => {
    const permissionIndex = selectedPermissions.findIndex(
      (p) => p.type === menuItem
    );
    if (permissionIndex !== -1) {
      const updatedPermissions = [...selectedPermissions];
      updatedPermissions[permissionIndex] = {
        ...updatedPermissions[permissionIndex],
        [type]: isChecked,
      };
      if (
        !updatedPermissions[permissionIndex].read &&
        !updatedPermissions[permissionIndex].write
      ) {
        updatedPermissions.splice(permissionIndex, 1);
      }
      setSelectedPermissions(updatedPermissions);
    } else {
      if (isChecked) {
        const newPermission = {
          type: menuItem,
          read: false,
          write: false,
        };
        newPermission[type] = isChecked;
        setSelectedPermissions((prevPermissions) => [
          ...prevPermissions,
          newPermission,
        ]);
      }
    }
  };

  const handleSavePermission = async () => {
    if (!permissionName) {
      setPermissionError('Please enter a permission name.');
      return;
    }

    let typeToSend = selectedType;
    if (!selectedType) {
      const firstType = Object.values(typeName)[0];
      typeToSend = firstType;
      setSelectedType(firstType);
    }

    const dataToSend = {
      type_name: typeToSend,
      user: id,
      permissionName: permissionName,
      permissions: selectedPermissions,
    };
    const dataToSend2 = {
      type_name: typeToSend,
      user: id,
      permission_name: permissionName,
      permissions: selectedPermissions,
    };

    try {
      if (router.query.id) {
        const permissionId = router.query.id;
        await mutateUpdate({ permissionId, dataToSend });
      } else {
        await mutatePost(dataToSend2);
      }
    } catch (error) {
      console.error('Error saving/updating permission:', error);
      toast.error('Error');
    }
  };

  const filteredData = () => {
    if (permissions?.includes(OWNER)) {
      return Object.entries(menusData).map(([key, value], index) => ({
        [key]: value,
        id: index + 1,
      }));
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
      console.log("LAST***",last)
      return last;
    }
  };

  useEffect(() => {
    if (permissions.includes(OWNER)) {
      setTypeName(PermissionJson.type_name);
    } else {
      const permList = permissions;
      const newArray = Object.values(PermissionJson.type_name);
      const filteredArray = newArray.filter((e) => permList.includes(e));

      let updatedTypeName = [];

      for (let i = 0; i < filteredArray.length; i++) {
        switch (filteredArray[i]) {
          case OWNER:
            updatedTypeName.push(OWNER, ADMIN, Company, DEALER, STAFF);
            break;
          case ADMIN:
            updatedTypeName.push(ADMIN, Company, DEALER, STAFF);
            break;
          case Company:
            updatedTypeName.push(Company, DEALER, STAFF);
            break;
          case DEALER:
            updatedTypeName.push(DEALER, STAFF);
            break;
          default:
            updatedTypeName = [];
        }
      }

      setTypeName(updatedTypeName);
    }
  }, []);


  console.log("typename", typeName)
  console.log("singlePermissionData", singlePermissionData)
  console.log("singlePermissionData.type_name", singlePermissionData?.type_name)

  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-xl font-semibold text-heading">
            Permission Management
          </h1>
        </div>

        <div className="mx-4 md:w-1/4">
          <label
            htmlFor="typename"
            className="block text-sm font-medium text-gray-700"
          >
            {t('PERMISSION TYPE')}
          </label>
          <select
            id="typename"
            name="typename"
            className={`mt-1 block w-full rounded-md border bg-gray-100 p-2 ${
              typeError && 'border-red-500'
            }`}
            onChange={(e) => handleChange(e)}
          >
            {Object.values(typeName).map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
          {typeError && (
            <p className="mt-1 text-sm text-red-500">{typeError}</p>
          )}
        </div>

        <div className="md:w-1/4">
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
            className={`mt-1 block w-full rounded-md border bg-gray-100 p-2 ${
              permissionError && 'border-red-500'
            }`}
            placeholder="Enter permissions"
            value={permissionName}
            onChange={(e) => handlePermissionNameChange(e)}
          />
          {permissionError && (
            <p className="mt-1 text-sm text-red-500">{permissionError}</p>
          )}
        </div>
      </Card>

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
              {filteredData().map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{Object.keys(item)[0]}</td>
                  <td className="items-center justify-center border p-2">
                    <input
                      className="items-center justify-center"
                      type="checkbox"
                      id={`readCheckbox${index}`}
                      onChange={(e) =>
                        handleCheckboxChange(
                          Object.values(item)[0],
                          'read',
                          e.target.checked
                        )
                      }
                      checked={
                        selectedPermissions?.find(
                          (p) => p.type === Object.values(item)[0]
                        )?.read || false
                      }
                    />
                  </td>
                  <td className="items-center justify-center border p-2">
                    <input
                      className="items-center justify-center"
                      type="checkbox"
                      id={`writeCheckbox${index}`}
                      onChange={(e) =>
                        handleCheckboxChange(
                          Object.values(item)[0],
                          'write',
                          e.target.checked
                        )
                      }
                      checked={
                        selectedPermissions?.find(
                          (p) => p.type === Object.values(item)[0]
                        )?.write || false
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
    </>
  );
};

// CreatePermission.Layout = OwnerLayout;
CreatePermission.Layout = AdminLayout;
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});

export default CreatePermission;
