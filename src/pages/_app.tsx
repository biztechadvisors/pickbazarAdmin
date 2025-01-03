// import type { AppProps } from 'next/app';
// import 'react-toastify/dist/ReactToastify.css';
// import '@/assets/css/main.css';
// import { UIProvider } from '@/contexts/ui.context';
// import { SettingsProvider } from '@/contexts/settings.context';
// import ErrorMessage from '@/components/ui/error-message';
// import PageLoader from '@/components/ui/page-loader/page-loader';
// import { ToastContainer } from 'react-toastify';
// import { QueryClient, QueryClientProvider } from 'react-query';
// import { Hydrate } from 'react-query/hydration';
// import { useSettingsQuery } from '@/data/settings';
// import { ReactQueryDevtools } from 'react-query/devtools';
// import { appWithTranslation } from 'next-i18next';
// import { ModalProvider } from '@/components/ui/modal/modal.context';
// import DefaultSeo from '@/components/ui/default-seo';
// import ManagedModal from '@/components/ui/modal/managed-modal';
// import { CartProvider } from '@/contexts/quick-cart/cart.context';
// import { useState } from 'react';
// import { NextPageWithLayout, SortOrder } from '@/types';
// import { useRouter } from 'next/router';
// import PrivateRoute from '@/utils/private-route';
// import { Config } from '@/config';
// import 'react-toastify/dist/ReactToastify.css';
// import { StockProvider } from '@/contexts/quick-cart/stock.context';

// const Noop: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
//   <>{children}</>
// );

// const AppSettings: React.FC<{ children?: React.ReactNode }> = (props) => {
//   const { locale } = useRouter();
//   const authToken =
//     typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

//   let settings = null;
//   let loading = false;
//   let error = null;

//   if (authToken) {
//     const queryResult = useSettingsQuery({ language: locale! });
//     settings = queryResult.settings;
//     loading = queryResult.loading;
//     error = queryResult.error;
//   }

//   if (loading) return <PageLoader />;
//   if (error) return <ErrorMessage message={error.message} />;

//   return (
//     <SettingsProvider initialValue={settings?.options || null} {...props} />
//   );
// };
// type AppPropsWithLayout = AppProps & {
//   Component: NextPageWithLayout;
// };
// const CustomApp = ({ Component, pageProps }: AppPropsWithLayout) => {
//   const Layout = (Component as any).Layout || Noop;
//   const authProps = (Component as any).authenticate;
//   const [queryClient] = useState(() => new QueryClient());
//   const getLayout = Component.getLayout ?? ((page) => page);

//   const { locale } = useRouter();
//   const dir = Config.getDirection(locale);

//   return (
//     <div dir={dir}>
//       <QueryClientProvider client={queryClient}>
//         <Hydrate state={pageProps?.dehydratedState}>
//           <AppSettings>
//             <UIProvider>
//               <ModalProvider>
//                 <>
//                   <StockProvider>
//                     <CartProvider>
//                       <DefaultSeo />
//                       {authProps ? (
//                         <PrivateRoute authProps={authProps}>
//                           <Layout {...pageProps}>
//                             <Component {...pageProps} />
//                           </Layout>
//                         </PrivateRoute>
//                       ) : (
//                         <Layout {...pageProps}>
//                           <Component {...pageProps} />
//                         </Layout>
//                       )}
//                       <ToastContainer autoClose={2000} theme="colored" />
//                       <ManagedModal />
//                     </CartProvider>
//                   </StockProvider>
//                 </>
//               </ModalProvider>
//             </UIProvider>
//           </AppSettings>
//           {/* <ReactQueryDevtools /> */}
//         </Hydrate>
//       </QueryClientProvider>
//     </div>
//   );
// };

// export default appWithTranslation(CustomApp);


import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import '@/assets/css/main.css';
import { UIProvider } from '@/contexts/ui.context';
import { SettingsProvider } from '@/contexts/settings.context';
import ErrorMessage from '@/components/ui/error-message';
import PageLoader from '@/components/ui/page-loader/page-loader';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { useSettingsQuery } from '@/data/settings';
import { ReactQueryDevtools } from 'react-query/devtools';
import { appWithTranslation } from 'next-i18next';
import { ModalProvider } from '@/components/ui/modal/modal.context';
import DefaultSeo from '@/components/ui/default-seo';
import ManagedModal from '@/components/ui/modal/managed-modal';
import { CartProvider } from '@/contexts/quick-cart/cart.context';
import { useState } from 'react';
import { NextPageWithLayout } from '@/types';
import { useRouter } from 'next/router';
import PrivateRoute from '@/utils/private-route';
import { Config } from '@/config';
import { StockProvider } from '@/contexts/quick-cart/stock.context';

const Noop: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

const AppSettings: React.FC<{ children?: React.ReactNode }> = (props) => {
  const { locale } = useRouter();
  const authToken =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  // Always call the hook but handle loading and error states
  const queryResult = useSettingsQuery({ language: locale! });
  const settings = queryResult.settings;
  const loading = queryResult.isLoading; // Updated to queryResult.isLoading
  const error = queryResult.error;

  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <SettingsProvider initialValue={settings?.options || null} {...props} />
  );
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const CustomApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const Layout = (Component as any).Layout || Noop;
  const authProps = (Component as any).authenticate;
  const [queryClient] = useState(() => new QueryClient());
  const getLayout = Component.getLayout ?? ((page) => page);

  const { locale } = useRouter();
  const dir = Config.getDirection(locale);

  return (
    <div dir={dir}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps?.dehydratedState}>
          <AppSettings>
            <UIProvider>
              <ModalProvider>
                <StockProvider>
                  <CartProvider>
                    <DefaultSeo />
                    {authProps ? (
                      <PrivateRoute authProps={authProps}>
                        <Layout {...pageProps}>
                          <Component {...pageProps} />
                        </Layout>
                      </PrivateRoute>
                    ) : (
                      <Layout {...pageProps}>
                        <Component {...pageProps} />
                      </Layout>
                    )}
                    <ToastContainer autoClose={2000} theme="colored" />
                    <ManagedModal />
                  </CartProvider>
                </StockProvider>
              </ModalProvider>
            </UIProvider>
          </AppSettings>
          {/* <ReactQueryDevtools /> */}
        </Hydrate>
      </QueryClientProvider>
    </div>
  );
};

export default appWithTranslation(CustomApp);
