import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/layouts/admin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Card from '@/components/common/card';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import Button from '@/components/ui/button';
import { useQuery } from 'react-query';
import { permissionClient } from '@/data/client/permission';
import PermissionJson from '../../../../public/static/permission.json';
import { useSavePermissionData } from '@/data/permission';

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

  const permissionId = router.query.id;

  if (permissionId) {
    var { data: singlePermissionData } = useQuery(
      ['permissionById', permissionId],
      () => permissionClient.getPermissionById(permissionId)
    );
  }

  const { mutateUpdate, mutatePost } = useSavePermissionData();

  useEffect(() => {
    if (singlePermissionData) {
      setTypeName([singlePermissionData.type_name]);
      setPermissionName(singlePermissionData.permissionName);
      const formattedPermissions = singlePermissionData.permission.map(
        (perm, i) => ({
          id: perm.id,
          type: perm.type,
          read: perm.read,
          write: perm.write,
        })
      );
      setSelectedPermissions(formattedPermissions);
    }
  }, [permissionId]);

  const handleChange = (e) => {
    setSelectedType(e.target.value);
    setTypeError('');
  };

  const handlePermissionNameChange = (e) => {
    setPermissionName(e.target.value);
    setPermissionError('');
  };

  const handleCheckboxChange = (menuItem, type, isChecked) => {
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
      permission_name: permissionName,
      permission: selectedPermissions,
    };
    const dataToSend2 = {
      type_name: typeToSend,
      permission_name: permissionName,
      permission: selectedPermissions,
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
            {t('TYPENAMES')}
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
            {t('PERMISSIONS')}
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
              {Object.entries(menusData).map(
                ([menuItem, entityName], index) => (
                  <tr key={index}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{menuItem}</td>
                    <td className="items-center justify-center border p-2">
                      <input
                        className="items-center justify-center"
                        type="checkbox"
                        id={`readCheckbox${index}`}
                        onChange={(e) =>
                          handleCheckboxChange(
                            entityName,
                            'read',
                            e.target.checked
                          )
                        }
                        checked={
                          selectedPermissions.find((p) => p.type === entityName)
                            ?.read || false
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
                            entityName,
                            'write',
                            e.target.checked
                          )
                        }
                        checked={
                          selectedPermissions.find((p) => p.type === entityName)
                            ?.write || false
                        }
                      />
                    </td>
                  </tr>
                )
              )}
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

CreatePermission.Layout = AdminLayout;

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});

export default CreatePermission;
