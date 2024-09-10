import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteRegionsClassMutation } from '@/data/regions';

const RegionsDeleteView = () => {
  const { mutate: deleteRegionsClass, isLoading: loading } =
    useDeleteRegionsClassMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();
  console.log('useModalState = ', data)

  function handleDelete() {
    console.log('handle Delete = ', data)
    deleteRegionsClass({ id: data });
    closeModal();
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default RegionsDeleteView;
