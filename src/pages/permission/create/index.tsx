import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/layouts/admin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Card from '@/components/common/card';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const data = await axios.get(`http://localhost:6000/type_name`);
    setTypeName(data.data);
  };

  const getMenusData = async () => {
    const data = await axios.get(`http://localhost:6000/Menus`);
    setMenusData(data.data);
  };

  const handleChange = (e: any) => {
    setSelectedType(e.target.value);
    setTypeError('');
  };

  const handlePermissionNameChange = (e: any) => {
    setPermissionName(e.target.value);
    setPermissionError('');
  };

  const handleCheckboxChange = (menuItem: unknown, type: string, isChecked: boolean) => {
    const permission = {
      type: menuItem,
      read: type === 'read' ? isChecked : selectedPermissions.find(p => p.type === menuItem)?.read || false,
      write: type === 'write' ? isChecked : selectedPermissions.find(p => p.type === menuItem)?.write || false,
    };

    const updatedPermissions = selectedPermissions.filter(p => p.type !== menuItem);
    updatedPermissions.push(permission);

    setSelectedPermissions(updatedPermissions);
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

    try {
      const response = await axios.post('http://localhost:5000/api/permission', dataToSend);

      if (response.status === 201) {
        toast.success('UPDATED');
        setPermissionName('');
        setSelectedPermissions([]);
      }
    } catch (error) {
      console.error('Error saving permission:', error);
      toast.error('Error')
    }
  };

  useEffect(() => {
    getTypeData();
    getMenusData();

  }, []);

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
                      onChange={(e) => handleCheckboxChange(entityName, 'read', e.target.checked)}
                      checked={selectedPermissions.find(p => p.type === entityName)?.read || false}
                    />
                  </td>
                  <td className="border p-2 items-center justify-center">
                    <input
                      className="items-center justify-center"
                      type="checkbox"
                      id={`writeCheckbox${index}`}
                      onChange={(e) => handleCheckboxChange(entityName, 'write', e.target.checked)}
                      checked={selectedPermissions.find(p => p.type === entityName)?.write || false}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSavePermission}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-400 cursor-pointer text-left"
        >
          Save Permission
        </button>
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







