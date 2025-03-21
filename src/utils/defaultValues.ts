import { PermissionItem } from '@/types';

// export const defaultStaffPermissions:PermissionItem[] = [
//   { type: "sidebar-nav-item-products", read: true, write: false },
//   { type: "sidebar-nav-item-orders", read: true, write: true },
//   { type: "sidebar-nav-item-users", read: false, write: true },
//   { type: "sidebar-nav-item-settings", read: true, write: false },
//   { type: "sidebar-nav-item-dashboard", read: true, write: true },
// ];
//
// export const defaultCompanyPermissions: PermissionItem[] = [
//   { type: "sidebar-nav-item-products", read: true, write: true },
//   { type: "sidebar-nav-item-orders", read: true, write: true },
//   { type: "sidebar-nav-item-users", read: true, write: true },
//   { type: "sidebar-nav-item-settings", read: true, write: true },
//   { type: "sidebar-nav-item-dashboard", read: true, write: true },
//   { type: "sidebar-nav-item-reviews", read: true, write: false },
//   { type: "sidebar-nav-item-coupons", read: true, write: true },
//   { type: "sidebar-nav-item-shippings", read: true, write: false },
// ];
//
// export const defaultDealerPermissions: PermissionItem[] = [
//   { type: "sidebar-nav-item-products", read: true, write: false },
//   { type: "sidebar-nav-item-orders", read: true, write: true },
//   { type: "sidebar-nav-item-my-shops", read: true, write: false },
//   { type: "sidebar-nav-item-dashboard", read: true, write: true },
//   { type: "sidebar-nav-item-stock", read: true, write: true },
//   { type: "sidebar-nav-item-contact", read: true, write: false },
//   { type: "sidebar-nav-item-regions", read: false, write: false },
// ];

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

