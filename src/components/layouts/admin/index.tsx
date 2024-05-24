import Navbar from '@/components/layouts/navigation/top-navbar';
import { Fragment, useState, useEffect } from 'react';
import MobileNavigation from '@/components/layouts/navigation/mobile-navigation';
import { siteSettings } from '@/settings/site.settings';
import { useTranslation } from 'next-i18next';
import SidebarItem from '@/components/layouts/navigation/sidebar-item';
import { useRouter } from 'next/router';
import { newPermission } from '@/contexts/permission/storepermission';
import { useAtom } from 'jotai';
import { getAuthCredentials } from '@/utils/auth-utils';
import { useMeQuery } from '@/data/user';
import { Routes } from '@/config/routes';
import { shopSlugAtom } from '@/utils/atoms';
import Dropdown from '../navigation/Dropdown';

const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const { locale, pathname } = useRouter();
  const dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';
  const [matched, _] = useAtom(newPermission);
  const { permissions } = getAuthCredentials();
  const { data } = useMeQuery();
  const [shopSlug, setShopSlug] = useAtom(shopSlugAtom);

  useEffect(() => {
    if (data?.shops?.length > 0) {
      const newShopSlug = data.shops[0].slug;
      setShopSlug(newShopSlug);
      localStorage.setItem('shopSlug', newShopSlug);
    }
  }, [data]);

  const getMatchedLinks = () => {
    const commonLinks = [
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

    if (pathname === Routes.adminMyShops) {
      return commonLinks;
    }

    if (
      [
        Routes.attribute.list,
        Routes.type.list,
        Routes.category.list,
        Routes.subcategory.list,
        Routes.product.list,
        Routes.reviews.list,
        Routes.tag.list,
      ].includes(pathname)
    ) {
      return [
        {
          href: Routes.dashboard,
          label: 'sidebar-nav-item-inventory-dashboard',
          icon: 'DashboardIcon',
        },
        ...commonLinks,
      ];
    }

    return permissions?.includes('super_admin')
      ? siteSettings.sidebarLinks.admin
      : siteSettings.sidebarLinks.admin.filter((link) =>
        matched.some((newItem) => newItem.type === link.label)
      );
  };

  const matchedLinks = getMatchedLinks();

  const SidebarItemMap = () => (
    <Fragment>
      {matchedLinks.map(({ href, label, icon }) => (
        <SidebarItem href={href} label={t(label)} icon={icon} key={href} />
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
