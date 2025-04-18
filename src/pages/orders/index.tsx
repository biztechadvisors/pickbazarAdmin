import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import OrderList from '@/components/order/order-list';
import { Fragment, useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useOrdersQuery } from '@/data/order';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import { MoreIcon } from '@/components/icons/more-icon';
import { useRouter } from 'next/router';
import { useShopQuery } from '@/data/shop';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { DownloadIcon } from '@/components/icons/download-icon';
import { useMeQuery } from '@/data/user';
import { CUSTOMER, DEALER } from '@/utils/constants';

export default function Orders() {
    const router = useRouter();
    const { locale, query } = router;
    const { shop: shopSlug, dealerId } = query;

    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [orderBy, setOrder] = useState('created_at');
    const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

    const { data: me } = useMeQuery();
    const { data: shopData, isLoading: fetchingShop } = useShopQuery(
        { slug: shopSlug as string },
        { enabled: !!shopSlug }
    );

    // Safely parse dealerId
    const parsedDealerId = dealerId
        ? Array.isArray(dealerId) ? Number(dealerId[0]) : Number(dealerId)
        : undefined;

    const queryConfig = {
        language: locale,
        limit: 20,
        page,
        search: searchTerm,
        ...(shopData?.slug && {
            shopSlug: shopData.slug,
            shop_id: shopData.id,
        }),
        ...(parsedDealerId
            ? {
                dealerId: parsedDealerId,
                customer_id: Number(me?.id),
                type: DEALER,
            }
            : me?.permission?.type_name === DEALER
                ? {
                    dealerId: Number(me?.id),
                    type: CUSTOMER,
                }
                : {
                    customer_id: Number(me?.id),
                    type: CUSTOMER,
                }),
    };


    const { orders, loading, paginatorInfo, error } = useOrdersQuery(queryConfig);

    function handleSearch({ searchText }: { searchText: string }) {
        setSearchTerm(searchText);
        setPage(1);
    }

    function handlePagination(current: any) {
        setPage(current);
    }

    if (loading) return <Loader text={t('common:text-loading')} />;
    if (error) return <ErrorMessage message={error.message} />;

    return (
        <>
            <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
                <h1 className="text-lg font-semibold text-heading md:w-1/4">
                    {t('form:input-label-orders')}
                </h1>

                <div className="flex w-full flex-col items-center ms-auto md:w-1/2 md:flex-row">
                    <Search onSearch={handleSearch} />
                </div>

                <Menu as="div" className="relative inline-block">
                    <Menu.Button className="group p-2">
                        <MoreIcon className="w-3.5 text-body" />
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="shadow-700 absolute z-50 mt-2 w-52 rounded border border-border-200 bg-light py-2">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={classNames(
                                            'flex w-full items-center px-5 py-2.5 text-sm font-semibold capitalize transition duration-200',
                                            active ? 'text-accent' : 'text-body'
                                        )}
                                    >
                                        <DownloadIcon className="w-5 shrink-0" />
                                        {t('common:text-export-orders')}
                                    </button>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </Card>

            <OrderList
                orders={orders}
                paginatorInfo={paginatorInfo}
                onPagination={handlePagination}
                onOrder={setOrder}
                onSort={setColumn}
                Shop={false}
            />
        </>
    );
}

Orders.authenticate = { permissions: adminOnly };
Orders.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
    },
});
