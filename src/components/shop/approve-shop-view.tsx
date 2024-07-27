import Button from '@/components/ui/button';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useTranslation } from 'next-i18next';
import { useApproveShopMutation } from '@/data/shop';
import cn from 'classnames';

const ApproveShopView = () => {
  const { t } = useTranslation();
  const { mutate: approveShopMutation, isLoading: loading } =
    useApproveShopMutation();

  const { data: shopId } = useModalState();
  const { closeModal } = useModalAction();

  const handleApprove = () => {
    approveShopMutation({
      id: shopId as string,
    });
    closeModal();
  };

  return (
    <div className="m-auto w-full max-w-sm rounded-md bg-light p-4 pb-6 sm:w-[24rem] md:rounded-xl">
      <div className="h-full w-full text-center">
        <div className="flex h-full flex-col justify-between">
          <p className="mt-4 text-xl font-bold text-heading">You want to Active this Company</p>
          <div className="space-s-4 mt-8 flex w-full items-center justify-between">
            <div className="w-1/2">
              <Button
                onClick={closeModal}
                className={cn(
                  'w-full rounded bg-red-600 py-2 px-4 text-center text-base font-semibold text-light shadow-md transition duration-200 ease-in hover:bg-red-700 focus:bg-red-700 focus:outline-none'
                )}
              >
                {t('common:button-cancel')}
              </Button>
            </div>

            <div className="w-1/2">
              <Button
                onClick={handleApprove}
                loading={loading}
                disabled={loading}
                className={cn(
                  'w-full rounded bg-accent py-2 px-4 text-center text-base font-semibold text-light shadow-md transition duration-200 ease-in hover:bg-accent-hover focus:bg-accent-hover focus:outline-none'
                )}
              >
                Active
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveShopView;