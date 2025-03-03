import {
  adminAndOwnerOnly,
  adminOwnerAndStaffOnly,
  ownerAndStaffOnly,
  ownerOnly,
} from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import { dealerOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';

const Type = {
  Dealer: 'Dealer',
  Admin: 'Admin',
  Customer: 'Customer',
  Staff: 'Staff',
  Owner: 'Owner',
};
const { permissions }: any = getAuthCredentials();
let permission = hasAccess(dealerOnly, permissions);
let identify = permissions;
const matching: any = Type.Dealer;

console.log("permission 17 ", permissions)
console.log("permission && identify == matching", permission && identify == matching)

export const siteSettings = {
  name: 'PickBazar',
  description: '',
  logo: {
    url: '/logo.svg',
    alt: 'PickBazar',
    href: '/',
    width: 128,
    height: 40,
  },
  defaultLanguage: 'en',
  author: {
    name: 'RedQ, Inc.',
    websiteUrl: 'https://redq.io',
    address: '',
  },
  headerLinks: [],
  authorizedLinks: [
    {
      href: Routes.profileUpdate,
      labelTransKey: 'authorized-nav-item-profile',
    },
    {
      href: Routes.logout,
      labelTransKey: 'authorized-nav-item-logout',
    },
  ],
  currencyCode: 'IN',
  sidebarLinks: {
    owner: [
      {
        href: Routes.dashboard,
        label: 'sidebar-nav-item-dashboard',
        icon: 'DashboardIcon',
        permissions: ownerAndStaffOnly,
      },
      {
        href: Routes.shop.list,
        label: 'sidebar-nav-item-customer',
        icon: 'MyShopIcon',
        permissions: ownerOnly,
      },
      {
        href: Routes.permission.list,
        label: 'sidebar-nav-item-permissions',
        icon: 'CalendarScheduleIcon',
        permissions: ownerOnly,
      },
      // {
      //   href: Routes.user.list,
      //   label: 'sidebar-nav-item-customer',
      //   icon: 'UsersIcon',
      //   permissions: ownerOnly,
      // },
      {
        href: Routes.staff.list,
        label: 'sidebar-nav-item-staffs',
        icon: 'UsersIcon',
      },
    ],
    admin: [
      {
        href: Routes.dashboard,
        label: 'sidebar-nav-item-dashboard',
        icon: 'DashboardIcon',
      },
      {
        href: Routes.helpInventory, // Add help link
        label: 'sidebar-nav-item-help',
        icon: 'DashboardIcon',
      },
      {
        href: Routes.shop.list,
        label: 'sidebar-nav-item-shops',
        icon: 'ShopIcon',
      },
      {
        href: Routes.adminMyShops,
        label: 'sidebar-nav-item-my-shops',
        icon: 'MyShopIcon',
      },
      {
        href: Routes.permission.list,
        label: 'sidebar-nav-item-permissions',
        icon: 'CalendarScheduleIcon',
      },
      {
        href: Routes.blog.list,
        label: 'sidebar-nav-item-blog',
        icon: 'DashboardIcon',
      },
      // {
      //   href: Routes.event.list,
      //   label: 'sidebar-nav-item-event',
      //   icon: 'DashboardIcon', 
      // },
      {
        href: Routes.user.list,
        label: 'sidebar-nav-item-customer',
        icon: 'UsersIcon',
      },
      {
        href: Routes.staff.list,
        label: 'sidebar-nav-item-staffs',
        icon: 'UsersIcon',
      },
      {
        href: Routes.dealerlist.list,
        label: 'sidebar-nav-item-dealerlist',
        icon: 'DealerListIcon',
      },
      {
        href: Routes.order.create,
        label: 'sidebar-nav-item-create-order',
        icon: 'CalendarScheduleIcon',
      },
      {
        href: Routes.order.list,
        label: 'sidebar-nav-item-orders',
        icon: 'OrdersIcon',
      },
      {
        href: Routes.totalsale.list,
        label: 'sidebar-nav-item-total-sale',
        icon: 'TotalSaleIcon',
      },
      {
        ...(permission && identify == matching
          ? {
            href: Routes.createSales,
            label: 'sidebar-nav-item-create-sales',
            icon: 'OrderListIcon',
          }
          : {
            href: Routes.coupon.list,
            label: 'sidebar-nav-item-coupons',
            icon: 'CouponsIcon',
          }),
      },
      {
        href: Routes.regions.list,
        label: 'sidebar-nav-item-regions',
        icon: 'DashboardIcon',
      },
      {
        href: Routes.faq.list,
        label: 'sidebar-nav-item-faq',
        icon: 'DashboardIcon',
      },
      {
        href: Routes.blog.list,
        label: 'sidebar-nav-item-blogs',
        icon: 'DashboardIcon',
        // permissions: adminOwnerAndStaffOnly,
      },
      {
        href: Routes.event.list,
        label: 'sidebar-nav-item-event',
        icon: 'DashboardIcon',
        // permissions: adminOwnerAndStaffOnly,
      },
      {
        href: Routes.getInspired.list,
        label: 'sidebar-nav-item-getInspired',
        icon: 'DashboardIcon',
        // permissions: adminOwnerAndStaffOnly,
      },
      {
        ...(permission && identify == matching
          ? {
            href: Routes.sales,
            label: 'sidebar-nav-item-sales',
            icon: 'SalesIcon',
          }
          : {
            href: Routes.tax.list,
            label: 'sidebar-nav-item-taxes',
            icon: 'TaxesIcon',
          }),
      },
      {
        href: Routes.shipping.list,
        label: 'sidebar-nav-item-shippings',
        icon: 'ShippingsIcon',
      },
      {
        href: Routes.message.list,
        label: 'sidebar-nav-item-message',
        icon: 'ChatIcon',
      },
      {
        ...(permission && identify == matching
          ? {
            href: `${Routes.stock.list}/dealer`,
            label: 'sidebar-nav-item-stocks',
            icon: 'ProductsIcon',
          }
          : {
            href: Routes.stock.list,
            label: 'sidebar-nav-item-stocks',
            icon: 'ProductsIcon',
          }),
      },
      {
        href: Routes.refund.list,
        label: 'sidebar-nav-item-refunds',
        icon: 'RefundsIcon',
      },
      {
        href: Routes.reviews.list,
        label: 'sidebar-nav-item-reviews',
        icon: 'ReviewIcon',
      },
      {
        href: Routes.settings,
        label: 'sidebar-nav-item-settings',
        icon: 'SettingsIcon',
      },
    ],
  
  },
  product: {
    placeholder: '/product-placeholder.svg',
  },
  avatar: {
    placeholder: '/avatar-placeholder.svg',
  },
};
