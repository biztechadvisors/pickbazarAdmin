import React from 'react';
import { useAtom } from 'jotai';
import { getAuthCredentials } from '@/utils/auth-utils';
import { newPermission } from '@/contexts/permission/storepermission';
import { siteSettings } from '@/settings/site.settings';

function AllPermission() {
    const [getPermission] = useAtom(newPermission);

    const { permissions } = getAuthCredentials();

    const canWrite1 = getPermission?.map(permission => permission.type) || [];

    console.log("permissionTypes==", canWrite1);
    console.log("getPermission===", getPermission);

    return canWrite1;
}

export { AllPermission };



// import React from 'react';
// import { useAtom } from 'jotai';
// import { getAuthCredentials } from '@/utils/auth-utils';
// import { newPermission } from '@/contexts/permission/storepermission';
// import { siteSettings } from '@/settings/site.settings';

// function AllPermission() {
//     const [getPermission,_]=useAtom(newPermission)

//     // const [getPermission] = useAtom(newPermission);
//     const { permissions } = getAuthCredentials();

//     const canWrite1 = getPermission?.find(permission => permission.type);

//     console.log("canWrite==", canWrite1);
//     console.log("getPermission===", getPermission);

//   return canWrite1;
// } 

// export { AllPermission };
