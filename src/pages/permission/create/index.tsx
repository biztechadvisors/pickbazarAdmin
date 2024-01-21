import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/layouts/admin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Card from '@/components/common/card';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const CreatePermission = () => {
  const [typeName, setTypeName] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [menusData, setMenusData] = useState({});
  const [permissionName, setPermissionName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const { t } = useTranslation();

  const [typeError, setTypeError] = useState('');
  const [permissionError, setPermissionError] = useState('');

  const getTypeData = async () => {
    const data = await axios.get(`http://localhost:8000/type_name`);
    console.log('dataCreatePer', data.data);
    setTypeName(data.data);
  };

  const getMenusData = async () => {
    const data = await axios.get(`http://localhost:8000/Menus`);
    console.log('menusData', data.data);
    setMenusData(data.data);
  };

  const handleChange = (e) => {
    setSelectedType(e.target.value);
    setTypeError('');
  };

  const handlePermissionNameChange = (e) => {
    setPermissionName(e.target.value);
    setPermissionError('');
  };

  const handleCheckboxChange = (menuItem, read, write) => {
    const permission = {
      type: menuItem,
      read,
      write,
    };

    const updatedPermissions = [...selectedPermissions];
    const existingIndex = updatedPermissions.findIndex((p) => p.type === menuItem);

    if (existingIndex !== -1) {
      updatedPermissions[existingIndex] = permission;
    } else {
      updatedPermissions.push(permission);
    }

    setSelectedPermissions(updatedPermissions);
  };

  const handleSavePermission = async () => {

    if (!permissionName) {
      setPermissionError('Please enter a permission name.');
    }
    let typeToSend = selectedType;
    if (!selectedType) {
      const firstType = Object.values(typeName)[0];
      typeToSend = firstType;
      setSelectedType(firstType);
    }
    if (!permissionName) {
      return;
    }

    const dataToSend = {
      type_name: typeToSend,
      permission_name: permissionName,
      permission: selectedPermissions,
    };


    console.log("dataToSend", dataToSend)

    try {
      const response = await axios.post('http://localhost:5000/api/permission', dataToSend);
      console.log('Permission saved:', response.data);
    } catch (error) {
      console.error('Error saving permission:', error);
    }
  };

  useEffect(() => {
    getTypeData();
    getMenusData();
  }, []);

  console.log('selectedType', selectedType);

  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-xl font-semibold text-heading">Permission Management</h1>
        </div>

        <div className="mx-4 md:w-1/4">
          <label htmlFor="typename" className="block text-sm font-medium text-gray-700">
            {t('TYPENAMES')}
          </label>
          <select
            id="typename"
            name="typename"
            className={`mt-1 block w-full p-2 border rounded-md bg-gray-100 ${typeError && 'border-red-500'}`}
            onChange={(e) => handleChange(e)}
          >
            {Object.values(typeName).map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
          {typeError && <p className="text-red-500 text-sm mt-1">{typeError}</p>}
        </div>

        <div className="md:w-1/4">
          <label htmlFor="permission" className="block text-sm font-medium text-gray-700">
            {t('PERMISSIONS')}
          </label>
          <input
            type="text"
            id="permission"
            name="permission"
            className={`mt-1 block w-full p-2 border rounded-md bg-gray-100 ${permissionError && 'border-red-500'}`}
            placeholder="Enter permissions"
            onChange={(e) => handlePermissionNameChange(e)}
          />
          {permissionError && <p className="text-red-500 text-sm mt-1">{permissionError}</p>}
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
              {Object.entries(menusData).map(([menuItem, entityName], index) => (
                <tr key={index}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{menuItem}</td>
                  <td className="border p-2 items-center justify-center">
                    <input
                      className="items-center justify-center"
                      type="checkbox"
                      id={`readCheckbox${index}`}
                      onChange={(e) => handleCheckboxChange(entityName, e.target.checked, false)}
                    />
                  </td>
                  <td className="border p-2 items-center justify-center">
                    <input
                      className="items-center justify-center"
                      type="checkbox"
                      id={`writeCheckbox${index}`}
                      onChange={(e) => handleCheckboxChange(entityName, false, e.target.checked)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleSavePermission}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
          >
            Save Permission
          </button>
        </div>
      </div>
    </>
  );
};

CreatePermission.Layout = AdminLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});

export default CreatePermission;
