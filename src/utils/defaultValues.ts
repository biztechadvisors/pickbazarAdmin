import { PermissionItem } from '@/types';

export const randomStaffPermissions: PermissionItem[] = [
  { type: "sidebar-nav-item-dashboard", read: true, write: false },
  { type: "sidebar-nav-item-permissions", read: false, write: true },
  { type: "sidebar-nav-item-orders", read: true, write: true },
  { type: "sidebar-nav-item-create-order", read: false, write: false },
  { type: "sidebar-nav-item-users", read: true, write: false },
  { type: "sidebar-nav-item-sales", read: false, write: true },
  { type: "sidebar-nav-item-create-sales", read: true, write: false },
  { type: "sidebar-nav-item-stocks", read: true, write: true },
  { type: "sidebar-nav-item-staffs", read: false, write: true },
  { type: "sidebar-nav-item-shippings", read: true, write: true },
];

