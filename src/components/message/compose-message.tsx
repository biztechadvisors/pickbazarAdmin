import { MessageAvatarPlaceholderIcon } from '@/components/icons/message-avatar-placeholder-icon';
import Button from '@/components/ui/button';
import ErrorMessage from '@/components/ui/error-message';
import Select from '@/components/ui/select/select';
import { useCreateConversations } from '@/data/conversations';
import { useShopsQuery } from '@/data/shop';
import { useAdminsQuery, useMeQuery, useUsersQuery } from '@/data/user';
import { Shop, SortOrder } from '@/types';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormatOptionLabelProps = {
  name: string;
  logo: {
    thumbnail: string;
  };
};

const formatOptionLabel = ({ logo, name }: FormatOptionLabelProps) => (
  <div className="flex items-center">
    <div className="relative mr-3 h-6 w-6 shrink-0 overflow-hidden rounded-full">
      {!isEmpty(logo?.thumbnail) ? (
        <Image
          src={logo?.thumbnail}
          alt={name}
          className="product-image object-contain"
          fill
          sizes="(max-width: 768px) 100vw"
        />
      ) : (
        <MessageAvatarPlaceholderIcon
          className="text-[1.5rem]"
          color="#DDDDDD"
        />
      )}
    </div>
    <div className="truncate">{name}</div>
  </div>
);

const ComposeMessageModal = () => {
  const [shop, setShop] = useState(null);
  const [active, setIsActive] = useState<boolean>(Boolean(0));
  const { t } = useTranslation();
  const { permissions } = getAuthCredentials();
  let permission = hasAccess(adminOnly, permissions);

  let options = {
    limit: 1000,
    page: 1,
    orderBy: 'created_at',
    sortedBy: SortOrder.Desc as SortOrder,
  };

  const {data:user}=useMeQuery()

  let { shops, loading, error } = useShopsQuery(options);
  const { users, loading:dealer } = useUsersQuery({
    type: 'Dealer',
    usrById: user?.id,
  });
  
  const userdealer = users.filter((user)=>user?.type?.type_name==='dealer')
  const getdealer = userdealer.map((dealer)=> dealer.dealer)

  let {
    admins,
    loading: adminLoading,
    error: adminError,
  } = useAdminsQuery(options);
  const { mutate: createConversations, isLoading: creating } =
    useCreateConversations();
  const { handleSubmit } = useForm();
  let lists = permission ? shops : admins;
  let loadingState = permission ? loading : adminLoading;
  let errorState = permission ? error : adminError;
  const mergeList = lists.concat(getdealer)
  console.log("HiDealer",mergeList)

  if (errorState) return <ErrorMessage message={error?.message} />;

  const onTypeFilter = (shop: Shop[] | undefined) => {
    // @ts-ignore
    setShop(shop);
    // @ts-ignore
    setIsActive(shop?.is_active || shop?.isActive);
  };
  async function onSubmit() {
    if (shop?.is_active) {
      createConversations({
        // @ts-ignore
        shop_id: shop?.id,
        latest_message: { 
          user_id: user?.id,
          // body:''
        },
        shop:shop,
        user:user,
        user_id: user?.id,
        // message: '',
        // id: ''
      });
    }
    else if(shop?.isActive){
      createConversations({
        // @ts-ignore
        dealer_id: shop?.id,
        latest_message: { 
          user_id: user?.id,
          // body:''
        },
        dealer:shop,
        user:user,
        user_id: user?.id,
        // message: '',
        // id: ''
      });
    }
  }

  return (
    <div className="m-auto block max-w-lg rounded bg-light p-6 md:w-[32.5rem]">
      <h2 className="mb-6 text-base font-medium">{t('text-starting-chat')}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Select
          options={mergeList}
          isLoading={loadingState}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.slug}
          placeholder="Find Vendor"
          onChange={onTypeFilter as any}
          isClearable={true}
          // @ts-ignore
          formatOptionLabel={formatOptionLabel}
        />
        <div className="mt-6 text-right">
          <Button
            className="px-4 text-base "
            loading={creating}
            disabled={!!creating || !shop || !Boolean(active)}
          >
            {t('text-start-conversation')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ComposeMessageModal;
