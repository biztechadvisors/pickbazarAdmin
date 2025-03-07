import { useRouter } from 'next/router';
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMeQuery, useUsersQuery } from '@/data/user';
import { AllPermission } from '@/utils/AllPermission';
import { DEALER, OWNER } from '@/utils/constants';
import OwnerLayout from '@/components/layouts/owner';
import { Table } from '@/components/ui/table';
import { SortOrder } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Routes } from '@/config/routes';
import Pagination from '@/components/ui/pagination';
import ActionButtons from '@/components/common/action-buttons';
import { adminOnly, getAuthCredentials } from '@/utils/auth-utils';
import AdminLayout from '@/components/layouts/admin';

export type IProps = {
    users: any[] | undefined;
    paginatorInfo: any | null;
    onPagination: (key: number) => void;
    onSort: (current: any) => void;
    onOrder: (current: string) => void;
};

const DealerList = ({ users, paginatorInfo, onPagination, onSort, onOrder }: IProps) => {
    const { t } = useTranslation();
    const { alignLeft, alignRight } = useIsRTL();
    const [sortingObj, setSortingObj] = useState({
        sort: SortOrder.Desc,
        column: null,
    });

    const onHeaderClick = (column: string | null) => ({
        onClick: () => {
            onSort((currentSortDirection: SortOrder) =>
                currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
            );
            onOrder(column!);
            setSortingObj({
                sort: sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
                column: column,
            });
        },
    });

    const columns = [
        {
            title: t('table:table-item-id'),
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: 60,
        },
        {
            title: (
                <TitleWithSort
                    title={t('table:table-item-title')}
                    ascending={
                        sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
                    }
                    isActive={sortingObj.column === 'name'}
                />
            ),
            className: 'cursor-pointer',
            dataIndex: 'name',
            key: 'name',
            align: alignLeft,
            onHeaderCell: () => onHeaderClick('name'),
            render: (name) => <span className="whitespace-nowrap">{name}</span>,
        },
        {
            title: (
                <TitleWithSort
                    title={t('table:table-item-email')}
                    ascending={
                        sortingObj.sort === SortOrder.Asc && sortingObj.column === 'email'
                    }
                    isActive={sortingObj.column === 'email'}
                />
            ),
            className: 'cursor-pointer',
            dataIndex: 'email',
            key: 'email',
            align: alignLeft,
            onHeaderCell: () => onHeaderClick('email'),
            render: (email) => <span className="whitespace-nowrap">{email}</span>,
        },
        {
            title: t('table:table-item-actions'),
            dataIndex: 'id',
            key: 'actions',
            align: alignRight,
            render: (id) => (
                <ActionButtons
                    id={id}
                    detailsUrl={`${Routes.order.list}?dealerId=${id}`}
                />
            ),
        },
    ];

    return (
        <>
            <div className="mb-8 overflow-hidden rounded shadow">
                <Table
                    //@ts-ignore
                    columns={columns}
                    emptyText={t('table:empty-table-data')}
                    data={users}
                    rowKey="id"
                    scroll={{ x: 380 }}
                />
            </div>
            {!!paginatorInfo?.total && (
                <div className="flex items-center justify-end">
                    <Pagination total={paginatorInfo.total} current={paginatorInfo.currentPage} onChange={onPagination} />
                </div>
            )}
        </>
    );

};

export default function DealerListOd() {
    const { t } = useTranslation();
    const [orderBy, setOrder] = useState('created_at');
    const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
    const [searchTerm, setSearchTerm] = useState('');
    const { data } = useMeQuery();
    const [page, setPage] = useState(1);
    const { users, paginatorInfo, loading, error } = useUsersQuery({
        type: DEALER,
        usrById: data?.id,
        name: searchTerm,
        orderBy,
        sortedBy,
        limit: 10,
        page,
    });

    const userdealer = users.filter((user) => user?.permission?.type_name === DEALER);

    if (loading) return <Loader text={t('common:text-loading')} />;
    if (error) return <ErrorMessage message={error.message} />;

    return (
        <>
            <Card className="mb-8 flex flex-col items-center xl:flex-row">
                <div className="mb-4 md:w-1/4 xl:mb-0">
                    <h1 className="text-xl font-semibold text-heading">
                        {t('common:sidebar-nav-item-dealerlist')}
                    </h1>
                </div>
                <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
                    <Search onSearch={(searchText) => setSearchTerm(searchText.searchText)} />
                </div>
            </Card>
            <DealerList paginatorInfo={paginatorInfo} onPagination={setPage} users={userdealer} onOrder={setOrder} onSort={setColumn} />
        </>
    );
}

const { permissions } = getAuthCredentials();
const resLayout = () => {
    return permissions?.[0] === OWNER ? OwnerLayout : AdminLayout;
};

DealerListOd.authenticate = {
    permissions: adminOnly,
};
DealerListOd.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
    },
});