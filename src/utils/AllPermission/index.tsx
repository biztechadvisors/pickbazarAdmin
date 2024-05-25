import React from 'react';
import { useAtom } from 'jotai';
import { newPermission } from '@/contexts/permission/storepermission';

function AllPermission() {
    const [getPermission] = useAtom(newPermission);

    const canWrite1 = getPermission?.map(permission => permission.type) || [];

    return canWrite1;
}

export { AllPermission };
