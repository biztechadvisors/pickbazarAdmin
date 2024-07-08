import Navbar from '@/components/layouts/navigation/top-navbar';
import { Fragment, useState } from 'react';
import MobileNavigation from '@/components/layouts/navigation/mobile-navigation';
import { siteSettings } from '@/settings/site.settings';
import { useTranslation } from 'next-i18next';
import SidebarItem from '@/components/layouts/navigation/sidebar-item';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { newPermission } from '@/contexts/permission/storepermission';
import { useAtom } from 'jotai';
import { getAuthCredentials } from '@/utils/auth-utils';
import { useMeQuery } from '@/data/user';
import { useShopQuery } from '@/data/shop';
import { Routes } from '@/config/routes';
import { shopSlugAtom } from '@/utils/atoms';
import { DEALER } from '@/utils/constants';

const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const { locale } = useRouter();

  const router = useRouter();
  const { query: { shop } } = router;
  // const { data, isLoading, error } = useShopQuery({ slug: shop?.toString() });
  const dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';

  const [matched, _] = useAtom(newPermission);
  const { permissions } = getAuthCredentials();
  const { data, isLoading: loading, error } = useMeQuery();
  const [shopSlug, setShopSlug] = useAtom(shopSlugAtom);
 const shopStatus = data?.managed_shop?.is_active ? 'active' : 'inactive';
 const isDisabled = shopStatus !== 'active';
  // useEffect(() => {
  //   if (data) {
  //     let newShopSlug = null;

  //     if (permissions?.[0].includes(DEALER) && data.UsrBy?.managed_shop?.slug) {
  //       newShopSlug = data.UsrBy.managed_shop.slug;
  //     } else if (data.managed_shop) {
  //       newShopSlug = data.managed_shop.slug;
  //     }

  //     if (newShopSlug) {
  //       setShopSlug(newShopSlug);
  //       localStorage.setItem('shopSlug', newShopSlug);
  //     }
  //   }
  // }, [data, permissions, setShopSlug]);


  useEffect(() => {
    if (typeof window !== 'undefined' && data) {
      let newShopSlug = null;

      if (permissions?.[0].includes(DEALER) && data.UsrBy?.managed_shop?.slug) {
        newShopSlug = data.UsrBy.managed_shop.slug;
      } else if (data.managed_shop) {
        newShopSlug = data.managed_shop.slug;
      }

      if (newShopSlug) {
        setShopSlug(newShopSlug);
        localStorage.setItem('shopSlug', newShopSlug);
      }
    }
  }, [data, permissions, setShopSlug]);

  let matchedLinks = [];


  if (router.pathname === Routes.adminMyShops) {
    matchedLinks = [
      {
        href: Routes.attribute.list,
        label: 'sidebar-nav-item-attributes',
        icon: 'AttributeIcon',
      },
      {
        href: Routes.type.list,
        label: 'sidebar-nav-item-groups',
        icon: 'TypesIcon',
      },
      {
        href: Routes.category.list,
        label: 'sidebar-nav-item-categories',
        icon: 'CategoriesIcon',
      },
      {
        href: Routes.subcategory.list,
        label: 'sidebar-nav-item-sub-categories',
        icon: 'CategoriesIcon',
      },
      {
        href: Routes.product.list,
        label: 'sidebar-nav-item-products',
        icon: 'ProductsIcon',
      },
      {
        href: Routes.reviews.list,
        label: 'sidebar-nav-item-reviews',
        icon: 'ReviewIcon',
      },
      {
        href: Routes.tag.list,
        label: 'sidebar-nav-item-tags',
        icon: 'TagIcon',
      },
    ];
  } else if (router.pathname === Routes.attribute.list) {
    matchedLinks = [
      {
        href: `${Routes.dashboard}`,
        label: 'sidebar-nav-item-inventory-dashboard',
        icon: 'DashboardIcon',
      },
      {
        href: Routes.attribute.list,
        label: 'sidebar-nav-item-attributes',
        icon: 'AttributeIcon',
      },
      {
        href: Routes.type.list,
        label: 'sidebar-nav-item-groups',
        icon: 'TypesIcon',
      },
      {
        href: Routes.category.list,
        label: 'sidebar-nav-item-categories',
        icon: 'CategoriesIcon',
      },
      {
        href: Routes.subcategory.list,
        label: 'sidebar-nav-item-sub-categories',
        icon: 'CategoriesIcon',
      },
      {
        href: Routes.product.list,
        label: 'sidebar-nav-item-products',
        icon: 'ProductsIcon',
      },
      {
        href: Routes.reviews.list,
        label: 'sidebar-nav-item-reviews',
        icon: 'ReviewIcon',
      },
      {
        href: Routes.tag.list,
        label: 'sidebar-nav-item-tags',
        icon: 'TagIcon',
      },
    ];
  } else if (router.pathname === Routes.type.list) {
    matchedLinks = [
      {
        href: `${Routes.dashboard}`,
        label: 'sidebar-nav-item-inventory-dashboard',
        icon: 'DashboardIcon',
      },
      {
        href: `${Routes.dashboard}`,
        label: 'sidebar-nav-item-inventory-dashboard',
        icon: 'DashboardIcon',
      },
      {
        href: Routes.attribute.list,
        label: 'sidebar-nav-item-attributes',
        icon: 'AttributeIcon',
      },
      {
        href: Routes.type.list,
        label: 'sidebar-nav-item-groups',
        icon: 'TypesIcon',
      },
      {
        href: Routes.category.list,
        label: 'sidebar-nav-item-categories',
        icon: 'CategoriesIcon',
      },
      {
        href: Routes.subcategory.list,
        label: 'sidebar-nav-item-sub-categories',
        icon: 'CategoriesIcon',
      },
      {
        href: Routes.product.list,
        label: 'sidebar-nav-item-products',
        icon: 'ProductsIcon',
      },
      // {
      //   href: Routes.order.list,
      //   label: 'sidebar-nav-item-orders',
      //   icon: 'OrdersIcon',
      // },
      // {
      //   href: Routes.refund.list,
      //   label: 'sidebar-nav-item-refunds',
      //   icon: 'RefundsIcon',
      // },
      {
        href: Routes.reviews.list,
        label: 'sidebar-nav-item-reviews',
        icon: 'ReviewIcon',
      },
      {
        href: Routes.tag.list,
        label: 'sidebar-nav-item-tags',
        icon: 'TagIcon',
      },
    ];
  } else if (router.pathname === Routes.category.list) {
    matchedLinks = [
      {
        href: `${Routes.dashboard}`,
        label: 'sidebar-nav-item-inventory-dashboard',
        icon: 'DashboardIcon',
      },
      {
        href: Routes.attribute.list,
        label: 'sidebar-nav-item-attributes',
        icon: 'AttributeIcon',
      },
      {
        href: Routes.type.list,
        label: 'sidebar-nav-item-groups',
        icon: 'TypesIcon',
      },
      {
        href: Routes.category.list,
        label: 'sidebar-nav-item-categories',
        icon: 'CategoriesIcon',
      },
      {
        href: Routes.subcategory.list,
        label: 'sidebar-nav-item-sub-categories',
        icon: 'CategoriesIcon',
      },
      {
        href: Routes.product.list,
        label: 'sidebar-nav-item-products',
        icon: 'ProductsIcon',
      },
      // {
      //   href: Routes.order.list,
      //   label: 'sidebar-nav-item-orders',
      //   icon: 'OrdersIcon',
      // },
      // {
      //   href: Routes.refund.list,
      //   label: 'sidebar-nav-item-refunds',
      //   icon: 'RefundsIcon',
      // },
      {
        href: Routes.reviews.list,
        label: 'sidebar-nav-item-reviews',
        icon: 'ReviewIcon',
      },
      {
        href: Routes.tag.list,
        label: 'sidebar-nav-item-tags',
        icon: 'TagIcon',
      },
    ];
  } else if (router.pathname === Routes.subcategory.list) {
    matchedLinks = [
      {
        href: `${Routes.dashboard}`,
        label: 'sidebar-nav-item-inventory-dashboard',
        icon: 'DashboardIcon',
      },
      {
        href: Routes.attribute.list,
        label: 'sidebar-nav-item-attributes',
        icon: 'AttributeIcon',
      },
      {
        href: Routes.type.list,
        label: 'sidebar-nav-item-groups',
        icon: 'TypesIcon',
      },
      {
        href: Routes.category.list,
        label: 'sidebar-nav-item-categories',
        icon: 'CategoriesIcon',
      },
      {
        href: Routes.subcategory.list,
        label: 'sidebar-nav-item-sub-categories',
        icon: 'CategoriesIcon',
      },
      {
        href: Routes.product.list,
        label: 'sidebar-nav-item-products',
        icon: 'ProductsIcon',
      },
      // {
      //   href: Routes.order.list,
      //   icon: 'OrdersIcon',
      // {
      // },
      //   href: Routes.refund.list,
      //   label: 'sidebar-nav-item-refunds',
      //   label: 'sidebar-nav-item-orders',
      //   icon: 'RefundsIcon',
      // },
      {
        href: Routes.reviews.list,
        label: 'sidebar-nav-item-reviews',
        icon: 'ReviewIcon',
      },
      {
        href: Routes.tag.list,
        label: 'sidebar-nav-item-tags',
        icon: 'TagIcon',
      },
    ];
  } else if (router.pathname === Routes.product.list) {
    matchedLinks = [
      {
        href: `${Routes.dashboard}`,
        label: 'sidebar-nav-item-inventory-dashboard',
        icon: 'DashboardIcon',
      },
      {
        href: Routes.attribute.list,
        label: 'sidebar-nav-item-attributes',
        icon: 'AttributeIcon',
      },
      {
        href: Routes.type.list,
        label: 'sidebar-nav-item-groups',
        icon: 'TypesIcon',
      },
      {
        href: Routes.category.list,
        label: 'sidebar-nav-item-categories',
        icon: 'CategoriesIcon',
      },
      {
        href: Routes.subcategory.list,
        label: 'sidebar-nav-item-sub-categories',
        icon: 'CategoriesIcon',
      },
      {
        href: Routes.product.list,
        label: 'sidebar-nav-item-products',
        icon: 'ProductsIcon',
      },
      {
        href: Routes.reviews.list,
        label: 'sidebar-nav-item-reviews',
        icon: 'ReviewIcon',
      },
      {
        href: Routes.tag.list,
        label: 'sidebar-nav-item-tags',
        icon: 'TagIcon',
      },
    ];
  } else if (router.pathname === Routes.reviews.list) {
    matchedLinks = [
      {
        href: `${Routes.dashboard}`,
        label: 'sidebar-nav-item-inventory-dashboard',
        icon: 'DashboardIcon',
      },
      {
        href: Routes.attribute.list,
        label: 'sidebar-nav-item-attributes',
        icon: 'AttributeIcon',
      },
      {
        href: Routes.type.list,
        label: 'sidebar-nav-item-groups',
        icon: 'TypesIcon',
      },
      {
        href: Routes.category.list,
        label: 'sidebar-nav-item-categories',
        icon: 'CategoriesIcon',
      },
      {
        href: Routes.subcategory.list,
        label: 'sidebar-nav-item-sub-categories',
        icon: 'CategoriesIcon',
      },
      {
        href: Routes.product.list,
        label: 'sidebar-nav-item-products',
        icon: 'ProductsIcon',
      },
      {
        href: Routes.reviews.list,
        label: 'sidebar-nav-item-reviews',
        icon: 'ReviewIcon',
      },
      {
        href: Routes.tag.list,
        label: 'sidebar-nav-item-tags',
        icon: 'TagIcon',
      },
    ];
  } else if (router.pathname === Routes.tag.list) {
    matchedLinks = [
      {
        href: `${Routes.dashboard}`,
        label: 'sidebar-nav-item-inventory-dashboard',
        icon: 'DashboardIcon',
      },
      {
        href: Routes.attribute.list,
        label: 'sidebar-nav-item-attributes',
        icon: 'AttributeIcon',
      },
      {
        href: Routes.type.list,
        label: 'sidebar-nav-item-groups',
        icon: 'TypesIcon',
      },
      {
        href: Routes.category.list,
        label: 'sidebar-nav-item-categories',
        icon: 'CategoriesIcon',
      },
      {
        href: Routes.subcategory.list,
        label: 'sidebar-nav-item-sub-categories',
        icon: 'CategoriesIcon',
      },
      {
        href: Routes.product.list,
        label: 'sidebar-nav-item-products',
        icon: 'ProductsIcon',
      },
      {
        href: Routes.reviews.list,
        label: 'sidebar-nav-item-reviews',
        icon: 'ReviewIcon',
      },
      {
        href: Routes.tag.list,
        label: 'sidebar-nav-item-tags',
        icon: 'TagIcon',
      },
    ];
  } else {
    matchedLinks = permissions?.includes('super_admin')
      ? siteSettings.sidebarLinks.admin
      : siteSettings.sidebarLinks.admin.filter((link) =>
          matched.some((newItem) => newItem.type === link.label)
        );

    matchedLinks = matchedLinks.filter(
      (link) =>
        ![
          Routes.attribute.list,
          Routes.type.list,
          // Routes.settings,
          //    Routes.order.list,
          // Routes.refund.list,
          Routes.category.list,
          Routes.subcategory.list,
          Routes.product.list,
          Routes.reviews.list,
          // Routes.sales,
          // Routes.createSales,
          Routes.tag.list,
        ].includes(link.href)
    );
  }

  const SidebarItemMap = () => (
    <Fragment>
      {matchedLinks.map(({ href, label, icon }) => (
        <SidebarItem  href={isDisabled ? '#' : href} label={t(label)} icon={icon} key={href} shopStatus={shopStatus} />
      ))}
    </Fragment>
  );

  return (
    <div
      className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150"
      dir={dir}
    >
      <Navbar />
      <MobileNavigation>
        <SidebarItemMap />
      </MobileNavigation>

      <div className="flex flex-1 pt-20">
        <aside className="xl:w-76 fixed bottom-0 hidden h-full w-72 overflow-y-auto bg-white px-4 pt-22 shadow ltr:left-0 ltr:right-auto rtl:right-0 rtl:left-auto lg:block">
          <div className="flex flex-col space-y-6 py-3">
            <SidebarItemMap />
          </div>
        </aside>
        <main className="ltr:xl:pl-76 rtl:xl:pr-76 w-full ltr:lg:pl-72 rtl:lg:pr-72 rtl:lg:pl-0">
          <div className="h-full p-5 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

