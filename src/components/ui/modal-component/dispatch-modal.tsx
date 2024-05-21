import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import Button from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { useTranslation } from 'next-i18next';
import { useQuery } from 'react-query';

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  updateDispatch: (data: any) => void;
}

const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  onClose,
  order,
  updateDispatch,
}) => {
    console.log("order****************************", order)
  const { t } = useTranslation();
  const { handleSubmit, control } = useForm();

  const onSubmit = (data: any) => {
    updateDispatch(data);
    onClose();
  };

  const columns = [
    {
      title: t('SL.No'),
      key: 'slno',
      render: (_: any, item: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: t('Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: t('Current-Qty'),
      key: 'current_qty',
      render: (_: any, item: any) => (
        <Controller
          name={`products.${item.id}.current_qty`}
          control={control}
          defaultValue={item.pivot.order_quantity}
          render={({ field }) => (
            <input
              type="number"
              {...field}
              className="w-full rounded border border-gray-300 px-2 py-1"
            />
          )}
        />
      ),
    },
    {
      title: t('Dispatched-Qty'),
      key: 'dispatched_qty',
      render: (_: any, item: any) => (
        <Controller
          name={`products.${item.id}.dispatched_qty`}
          control={control}
          defaultValue={item.dispatched_qty || 0}
          render={({ field }) => (
            <input
              type="number"
              {...field}
              className="w-full rounded border border-gray-300 px-2 py-1"
            />
          )}
        />
      ),
    },
    {
      title: t('Update-Qty'),
      key: 'update_qty',
      render: (_: any, item: any) => (
        <Controller
          name={`products.${item.id}.update_qty`}
          control={control}
          defaultValue={item.update_qty || 0}
          render={({ field }) => (
            <input
              type="number"
              {...field}
              className="w-full rounded border border-gray-300 px-2 py-1"
            />
          )}
        />
      ),
    },
    {
      title: t('Pending-Qty'),
      key: 'pending_qty',
      render: (_: any, item: any) => (
        <Controller
          name={`products.${item.id}.pending_qty`}
          control={control}
          defaultValue={
            item.pivot.order_quantity -
            (item.dispatched_qty + (item.update_qty || 0))
          }
          render={({ field }) => (
            <input
              type="number"
              {...field}
              className="w-full rounded border border-gray-300 px-2 py-1"
            />
          )}
        />
      ),
    },
    {
      title: t('Action'),
      key: 'action',
      render: (_: any, item: any) => (
        <Button onClick={handleSubmit(onSubmit)}>Update</Button>
      ),
    },
  ];

  console.log('order*********', order);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="my-8 inline-block w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              {/* <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                {t('form:button-label-change-dispatch')}
              </Dialog.Title> */}
              <div className="mt-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="overflow-x-auto">
                    <Table
                      //@ts-ignore
                      columns={columns}
                      data={order?.products}
                      rowKey="id"
                    />
                  </div>
                  {/* <div className="mt-4">
                    <Button type="submit">{t('common:text-update')}</Button>
                  </div> */}
                </form>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DispatchModal;
