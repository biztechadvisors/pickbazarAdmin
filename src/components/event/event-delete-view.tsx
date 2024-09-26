import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteBlogMutation } from '@/data/blog';
import { useDeleteEventMutation } from '@/data/event';

const EventDeleteView = () => {
  const { mutate: deleteEventByID, isLoading: loading } =
    useDeleteEventMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  async function handleDelete() {
    deleteEventByID({
      id: data,
    });
    closeModal();
  }

  console.log(
    'data++++++++++++++++++++++++++++++++++++++++++++++++++++++++',
    data
  );

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default EventDeleteView;
