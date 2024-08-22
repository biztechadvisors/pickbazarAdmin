import {
  adminAndOwnerOnly,
  adminOwnerAndStaffOnly,
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
        permissions: ownerOnly,
      },
      {
        href: Routes.shop.list,
        label: 'sidebar-nav-item-shops',
        icon: 'MyShopIcon',
        permissions: ownerOnly,
      },
      {
        href: Routes.permission.list,
        label: 'sidebar-nav-item-permissions',
        icon: 'CalendarScheduleIcon',
        permissions: ownerOnly,
      },
      {
        href: Routes.user.list,
        label: 'sidebar-nav-item-customer',
        icon: 'UsersIcon',
        permissions: ownerOnly,
      },
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
        icon: 'CalendarScheduleIcon',
      },
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
    shop: [
      {
        href: (shop: string) => `${Routes.dashboard}${shop}`,
        label: 'sidebar-nav-item-inventory-dashboard',
        icon: 'DashboardIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${Routes.attribute.list}`,
        label: 'sidebar-nav-item-attributes',
        icon: 'AttributeIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${Routes.type.list}`,
        label: 'sidebar-nav-item-groups',
        icon: 'TypesIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${Routes.category.list}`,
        label: 'sidebar-nav-item-categories',
        icon: 'CategoriesIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${Routes.product.list}`,
        label: 'sidebar-nav-item-products',
        icon: 'ProductsIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${Routes.reviews.list}`,
        label: 'sidebar-nav-item-reviews',
        icon: 'ReviewIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${Routes.subcategory.list}`,
        label: 'sidebar-nav-item-sub-categories',
        icon: 'CategoriesIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${Routes.tag.list}`,
        label: 'sidebar-nav-item-tags',
        icon: 'TagIcon',
        permissions: adminOwnerAndStaffOnly,
      },
      {
        href: (shop: string) => `/${shop}${Routes.blog.list}`,
        label: 'sidebar-nav-item-blogs',
        icon: 'TagIcon',
        permissions: adminOwnerAndStaffOnly,
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
