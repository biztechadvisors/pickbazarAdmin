import Layout from '@/components/layouts/app';
import ProfileUpdateFrom from '@/components/auth/profile-update-form';
import ChangePasswordForm from '@/components/auth/change-password-from';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useMeQuery } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import EmailUpdateForm from '@/components/auth/email-update-form';
import CreateOrUpdateDealerForm from '@/components/dealerlist/add-dealer-form';
import { AddressType } from '@/types';
import UserAddressSelection from '@/components/UserAddressSelection';
import { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { dealerAddress } from '@/utils/atoms';
import { useRouter } from 'next/router';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { data, isLoading: loading, error } = useMeQuery();
  const userAddressSelectionRef = useRef(null);
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useAtom(dealerAddress);

  useEffect(() => {
    if (data && userAddressSelectionRef.current) {
      userAddressSelectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    if (!selectedAddress && router.query.from === 'order-checkout') {
      router.push('/profile-update'); // Navigate to profile update if address is missing
    }
  }, [data, selectedAddress, router.query.from]);

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-profile-settings')}
        </h1>
      </div>
      <EmailUpdateForm me={data} />
      <ProfileUpdateFrom me={data} />
      <ChangePasswordForm />

      {data?.dealer?.id && (
        <div ref={userAddressSelectionRef}>
          <UserAddressSelection
            addresses={data.address}
            dealerId={data.id}
            type={AddressType.Billing}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />
        </div>
      )}
    </>
  );
}
ProfilePage.Layout = Layout;
