// import Navbar from '@/components/layouts/navigation/top-navbar';
// import { Fragment, useState } from 'react';
// import MobileNavigation from '@/components/layouts/navigation/mobile-navigation';
// import { siteSettings } from '@/settings/site.settings';
// import { useTranslation } from 'next-i18next';
// import SidebarItem from '@/components/layouts/navigation/sidebar-item';
// import { useRouter } from 'next/router';
// import { useMeQuery } from '@/data/user';
// import { getAuthCredentials } from '@/utils/auth-utils';
// import { OWNER } from '@/utils/constants';

// const OwnerLayout: React.FC<{ children?: React.ReactNode }> = ({
//   children,
// }) => {
//   const { t } = useTranslation();
//   const { locale } = useRouter();
//   const { permissions } = getAuthCredentials();

//   const router = useRouter();
//   const dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';

//   if (permissions?.includes(OWNER)) {
//     var matchedLinks = siteSettings.sidebarLinks.owner;
//   } else {
//     var matchedLinks = siteSettings.sidebarLinks.admin;
//   }

//   const SidebarItemMap = () => (
//     <Fragment>
//       {matchedLinks.map(({ href, label, icon }) => (
//         <SidebarItem href={href} label={t(label)} icon={icon} key={href} />
//       ))}
//     </Fragment>
//   );
//   return (
//     <div
//       className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150"
//       dir={dir}
//     >
//       <Navbar />
//       <MobileNavigation>
//         <SidebarItemMap />
//       </MobileNavigation>

//       <div className="flex flex-1 pt-20">
//         <aside className="xl:w-76 fixed bottom-0 hidden h-full w-72 overflow-y-auto bg-white px-4 pt-22 shadow ltr:left-0 ltr:right-auto rtl:right-0 rtl:left-auto lg:block">
//           <div className="flex flex-col space-y-6 py-3">
//             <SidebarItemMap />
//           </div>
//         </aside>
//         <main className="ltr:xl:pl-76 rtl:xl:pr-76 w-full ltr:lg:pl-72 rtl:lg:pr-72 rtl:lg:pl-0">
//           <div className="h-full p-5 md:p-8">{children}</div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default OwnerLayout;

import Navbar from '@/components/layouts/navigation/top-navbar';
import { Fragment, useState, useEffect } from 'react';
import MobileNavigation from '@/components/layouts/navigation/mobile-navigation';
import { siteSettings } from '@/settings/site.settings';
import { useTranslation } from 'next-i18next';
import SidebarItem from '@/components/layouts/navigation/sidebar-item';
import { useRouter } from 'next/router';
import { useMeQuery } from '@/data/user';
import { getAuthCredentials } from '@/utils/auth-utils';
import { OWNER } from '@/utils/constants';
import Loader from '@/components/ui/loader/loader';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const OwnerLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { permissions } = getAuthCredentials();

  const router = useRouter();
  const dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulating a 3 second delay

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div>
        <Loader text={t('common:text-loading')} />
      </div>
    ); // Replace with your loading indicator
  }

  const matchedLinks = permissions?.includes(OWNER)
    ? siteSettings.sidebarLinks.owner
    : siteSettings.sidebarLinks.admin;

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

export default OwnerLayout;




