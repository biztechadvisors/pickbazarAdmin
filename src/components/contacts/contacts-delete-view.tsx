import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteContactMutation } from '@/data/contacts'; // Import the delete mutation for contacts

const ContactDeleteView = () => {
  const { mutate: deleteContact, isLoading: loading } =
    useDeleteContactMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteContact({ id: data }); // Ensure the ID is passed correctly
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

export default ContactDeleteView;
